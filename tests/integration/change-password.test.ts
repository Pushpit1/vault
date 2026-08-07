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

describe("Change Password", () => {
  let accessToken: string;

  beforeAll(async () => {
    await cleanupUser(testUser.email);

    await registerUser();

    const login =
      await loginUser();

    accessToken =
      login.body.data.accessToken;
  });

  it("should change password successfully", async () => {
    const response = await request(app)
      .post("/api/v1/users/change-password")
      .set(
        "Authorization",
        `Bearer ${accessToken}`
      )
      .send({
        currentPassword:
          testUser.password,
        newPassword:
          "NewPassword123",
      });

    expect(response.status).toBe(200);

    expect(response.body.success)
      .toBe(true);
  });

  it("should reject wrong current password", async () => {
    const response = await request(app)
      .post("/api/v1/users/change-password")
      .set(
        "Authorization",
        `Bearer ${accessToken}`
      )
      .send({
        currentPassword:
          "WrongPassword",
        newPassword:
          "NewPassword123",
      });

    expect(response.status).toBe(401);

    expect(response.body.success)
      .toBe(false);
  });
});