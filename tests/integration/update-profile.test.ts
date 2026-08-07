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
import { loginUser } from "../helpers/auth.helper";

describe("Update Profile", () => {
  let accessToken: string;

  beforeAll(async () => {
    await cleanupUser(testUser.email);

await registerUser(testUser);

    const login = await loginUser(testUser);

    accessToken =
      login.body.data.accessToken;
  });

  it("should update profile", async () => {
    const response = await request(app)
      .patch("/api/v1/users/me")
      .set(
        "Authorization",
        `Bearer ${accessToken}`
      )
      .send({
        name: "Updated User",
      });

    expect(response.status).toBe(200);

    expect(response.body.success)
      .toBe(true);

    expect(response.body.data.name)
      .toBe("Updated User");
  });

  it("should reject unauthorized update", async () => {
    const response = await request(app)
      .patch("/api/v1/users/me")
      .send({
        name: "Hack",
      });

    expect(response.status).toBe(401);

    expect(response.body.success)
      .toBe(false);
  });
});