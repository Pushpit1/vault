import request from "supertest";
import app from "../../src/app";

export async function registerUser(
  user: {
    name: string;
    email: string;
    password: string;
  }
) {
  return request(app)
    .post("/api/v1/users")
    .send(user);
}