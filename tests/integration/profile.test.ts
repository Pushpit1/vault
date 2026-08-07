import request from "supertest";
import {
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import app from "../../src/app";

import { testUser } from "../fixtures/user.fixture";
import { cleanupUser } from "../helpers/db.helper";
import { registerUser } from "../helpers/user.helper";
import { loginUser } from "../helpers/auth.helper";

describe("Get Profile", () => {
  let accessToken: string;

  beforeAll(async () => {
    await cleanupUser(testUser.email);

    await registerUser();

    const login =
      await loginUser();

    accessToken =
      login.body.data.accessToken;
  });

  it("should return current user profile", async () => {
    const response = await request(app)
      .get("/api/v1/users/me")
      .set(
        "Authorization",
        `Bearer ${accessToken}`
      );

    expect(response.status).toBe(200);

    expect(response.body.success)
      .toBe(true);

    expect(response.body.data.email)
      .toBe(testUser.email);

    expect(response.body.data.name)
      .toBe(testUser.name);

    expect(response.body.data.password)
      .toBeUndefined();
  });

  it("should reject unauthorized request", async () => {
    const response = await request(app)
      .get("/api/v1/users/me");

    expect(response.status).toBe(401);

    expect(response.body.success)
      .toBe(false);
  });
});