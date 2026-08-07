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

describe("Email Verification", () => {
  beforeAll(async () => {
    await cleanupUser(testUser.email);
    await registerUser();
  });

  it("should generate verification token", async () => {
    const response = await request(app)
      .post("/api/v1/users/verify-email")
      .send({
        email: testUser.email,
      });

    expect(response.status).toBe(200);

    expect(response.body.success)
      .toBe(true);
  });

  it("should reject unknown email", async () => {
    const response = await request(app)
      .post("/api/v1/users/verify-email")
      .send({
        email: "unknown@test.com",
      });

    expect(response.status).toBe(404);

    expect(response.body.success)
      .toBe(false);
  });
});