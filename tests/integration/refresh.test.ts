import request from "supertest";

import {
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import app from "../../src/app";

import { prisma } from "../../src/config/prisma";

import { generateRefreshToken } from "../../src/utils/jwt/token";

import { createTestUser } from "../fixtures/user.factory";
import { cleanupUser } from "../helpers/db.helper";
import { registerUser } from "../helpers/user.helper";
import { loginUser } from "../helpers/auth.helper";

const testUser = createTestUser();

describe("Refresh Token", () => {
  beforeAll(async () => {
    await cleanupUser(testUser.email);
    await registerUser(testUser);
  });

  it("should generate a new access token", async () => {
    const loginResponse = await loginUser(testUser);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/api/v1/users/refresh")
      .set("Cookie", cookies);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(
      response.body.data.accessToken
    ).toBeDefined();

    expect(
      response.headers["set-cookie"]
    ).toBeDefined();
  });

  it("should reject invalid refresh token", async () => {
    const response = await request(app)
      .post("/api/v1/users/refresh")
      .set(
        "Cookie",
        "refreshToken=invalid-token"
      );

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  it("should reject expired refresh token", async () => {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: testUser.email,
      },
    });

    const expiredToken =
      generateRefreshToken(user.id);

    const expiresAt = new Date(
      Date.now() - 60 * 1000
    );

    const {
      hashRefreshToken,
    } = await import(
      "../../src/utils/jwt/refresh-token-hash"
    );

    await prisma.refreshToken.deleteMany({
      where: {
        token: hashRefreshToken(expiredToken),
      },
    });

    await prisma.refreshToken.create({
      data: {
        token: hashRefreshToken(expiredToken),
        userId: user.id,
        expiresAt,
      },
    });

    const response = await request(app)
      .post("/api/v1/users/refresh")
      .set(
        "Cookie",
        `refreshToken=${expiredToken}`
      );

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    const storedToken =
      await prisma.refreshToken.findUnique({
        where: {
          token: hashRefreshToken(expiredToken),
        },
      });

    expect(storedToken).toBeNull();
  });
});



