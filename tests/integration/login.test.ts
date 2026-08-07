import request from "supertest";
import {
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import app from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { invalidUser } from "../fixtures/user.fixture";
import { createTestUser } from "../fixtures/user.factory";

const testUser = createTestUser();
describe("User Login", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });

    await request(app)
      .post("/api/v1/users")
      .send(testUser);
  });

  it("should login successfully", async () => {
    const response = await request(app)
      .post("/api/v1/users/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.accessToken)
      .toBeDefined();

    expect(response.body.data.user.email)
      .toBe(testUser.email);

    expect(response.body.data.user.password)
      .toBeUndefined();

    expect(
      response.headers["set-cookie"]
    ).toBeDefined();
  });

  it("should reject invalid password", async () => {
    const response = await request(app)
      .post("/api/v1/users/login")
      .send({
        email: testUser.email,
        password: invalidUser.password,
      });

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  it("should reject unknown email", async () => {
    const response = await request(app)
      .post("/api/v1/users/login")
      .send({
        email: invalidUser.email,
        password: testUser.password,
      });

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });
});