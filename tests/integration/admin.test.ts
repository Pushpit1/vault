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

describe("Admin Authorization", () => {
  let accessToken: string;

  beforeAll(async () => {
    await cleanupUser(testUser.email);
await registerUser(testUser);

const login = await loginUser(testUser);
    accessToken = login.body.data.accessToken;
  });

  it("should reject normal user", async () => {
    const response = await request(app)
      .get("/api/v1/users/admin")
      .set(
        "Authorization",
        `Bearer ${accessToken}`
      );

    expect(response.status).toBe(403);

    expect(response.body.success)
      .toBe(false);
  });

  it("should reject unauthenticated request", async () => {
    const response = await request(app)
      .get("/api/v1/users/admin");

    expect(response.status).toBe(401);

    expect(response.body.success)
      .toBe(false);
  });
});