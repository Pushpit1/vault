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
    await registerUser(testUser);
  });

  it("should respond with 200 and generic message for known email", async () => {
    const response = await request(app)
      .post("/api/v1/users/forgot-password")
      .send({ email: testUser.email });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // Should NOT expose the raw reset token (security: token is emailed, not returned)
    expect(response.body.data?.resetToken).toBeUndefined();
    expect(response.body.data?.message).toBeDefined();
  });

  it("should respond with 200 and generic message for unknown email (no user enumeration)", async () => {
    const response = await request(app)
      .post("/api/v1/users/forgot-password")
      .send({ email: "nonexistent@example.com" });

    // Must NOT reveal whether the email exists
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data?.message).toBeDefined();
  });

  it("should reject invalid email format", async () => {
    const response = await request(app)
      .post("/api/v1/users/forgot-password")
      .send({ email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
