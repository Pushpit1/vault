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

describe("Logout", () => {
  beforeAll(async () => {
    await cleanupUser(testUser.email);
    await registerUser();
  });

  it("should logout successfully", async () => {
    const loginResponse =
      await loginUser();

    const cookies =
      loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/api/v1/users/logout")
      .set("Cookie", cookies);

    expect(response.status).toBe(200);

    expect(response.body.success)
      .toBe(true);

    expect(response.body.data.message).toBe(
      "Logout successful"
    );

    expect(
      response.headers["set-cookie"]
    ).toBeDefined();
  });

  it("should reject invalid refresh token", async () => {
    const response = await request(app)
      .post("/api/v1/users/logout")
      .set(
        "Cookie",
        "refreshToken=invalid-token"
      );

    expect(response.status).toBe(401);

    expect(response.body.success)
      .toBe(false);
  });
});