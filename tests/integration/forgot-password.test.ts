import request from "supertest";
import {
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import app from "../../src/app";

import { createTestUser } from "../fixtures/user.factory";

const testUser = createTestUser();
import { cleanupUser } from "../helpers/db.helper";
import { registerUser } from "../helpers/user.helper";

describe("Forgot Password", () => {
  beforeAll(async () => {
    await cleanupUser(testUser.email);
await registerUser(testUser);  });

  it("should generate password reset token", async () => {
    const response = await request(app)
      .post("/api/v1/users/forgot-password")
      .send({
        email: testUser.email,
      });

    expect(response.status).toBe(200);

    expect(response.body.success)
      .toBe(true);

    expect(
      response.body.data.resetToken
    ).toBeDefined();
  });

  it("should reject unknown email", async () => {
    const response = await request(app)
      .post("/api/v1/users/forgot-password")
      .send({
        email: "unknown@test.com",
      });

    expect(response.status).toBe(404);

    expect(response.body.success)
      .toBe(false);
  });
});