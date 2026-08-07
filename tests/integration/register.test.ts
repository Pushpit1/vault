import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import app from "../../src/app";
import { prisma } from "../../src/config/prisma";

const testUser = {
  name: "Integration Test User",
  email: "integration@test.com",
  password: "Password123",
};

describe("User Registration", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
  });

  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send(testUser);

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.email).toBe(
      testUser.email
    );

    expect(response.body.data.name).toBe(
      testUser.name
    );

    expect(response.body.data.password).toBeUndefined();
  });

  it("should reject duplicate email", async () => {
    await request(app)
      .post("/api/v1/users")
      .send(testUser);

    const response = await request(app)
      .post("/api/v1/users")
      .send(testUser);

    expect(response.status).toBe(409);

    expect(response.body.success).toBe(false);
  });
});