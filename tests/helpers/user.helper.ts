import request from "supertest";

import app from "../../src/app";
import { testUser } from "../fixtures/user.fixture";

export async function registerUser() {
  return request(app)
    .post("/api/v1/users")
    .send(testUser);
}

export function createTestUser() {
  const id = Date.now() + Math.random();

  return {
    name: "Integration Test User",
    email: `user-${id}@test.com`,
    password: "Password123",
  };
}