import request from "supertest";
import app from "../../src/app";

export async function loginUser(
  user: {
    email: string;
    password: string;
  }
) {
  return request(app)
    .post("/api/v1/users/login")
    .send({
      email: user.email,
      password: user.password,
    });
}