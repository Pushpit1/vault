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

describe("Reset Password", () => {
  let resetToken: string;

  beforeAll(async () => {
    await cleanupUser(testUser.email);
    await registerUser();

    const forgotResponse = await request(app)
      .post("/api/v1/users/forgot-password")
      .send({
        email: testUser.email,
      });

    resetToken =
      forgotResponse.body.data.resetToken;
  });

  it("should reset password successfully", async () => {
    const response = await request(app)
      .post("/api/v1/users/reset-password")
      .send({
        token: resetToken,
        newPassword: "NewPassword123",
      });

    expect(response.status).toBe(200);

    expect(response.body.success)
      .toBe(true);
  });

  it("should reject invalid token", async () => {
    const response = await request(app)
      .post("/api/v1/users/reset-password")
      .send({
        token: "invalid-token",
        newPassword: "NewPassword123",
      });

    expect(response.status).toBe(401);

    expect(response.body.success)
      .toBe(false);
  });
});