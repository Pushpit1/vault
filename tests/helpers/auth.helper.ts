import request from "supertest";

import app from "../../src/app";
import { testUser } from "../fixtures/user.fixture";

export async function loginUser() {
  return request(app)
    .post("/api/v1/users/login")
    .send({
      email: testUser.email,
      password: testUser.password,
    });
}