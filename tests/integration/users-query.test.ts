import {
  beforeAll,
  afterAll,
  describe,
  expect,
  it,
} from "vitest";

import request from "supertest";

import app from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { createTestUser } from "../fixtures/user.factory";
import { loginUser } from "../helpers/auth.helper";
import { hashPassword } from "../../src/utils/auth/password";

const users = [
  createTestUser(),
  createTestUser(),
  createTestUser(),
  createTestUser(),
  createTestUser(),
];

// Admin user for authenticated admin-only endpoint
const adminEmail = `admin-query-test-${Date.now()}@test.com`;
const adminPassword = "AdminPass1!";
let adminToken: string;

describe("Users Query API", () => {
  beforeAll(async () => {
    // Create regular test users
    for (const user of users) {
      await prisma.user.deleteMany({ where: { email: user.email } });
      await request(app).post("/api/v1/users").send(user);
    }

    // Create admin user directly in DB (can't set role via API)
    await prisma.user.deleteMany({ where: { email: adminEmail } });
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Test Admin",
        password: await hashPassword(adminPassword),
        role: "ADMIN",
        isVerified: true,
      },
    });

    const login = await loginUser({ email: adminEmail, password: adminPassword });
    adminToken = login.body.data.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: adminEmail } });
  });

  it("should reject unauthenticated requests", async () => {
    const response = await request(app).get("/api/v1/users?page=1&limit=2");
    expect(response.status).toBe(401);
  });

  it("should reject non-admin users", async () => {
    // Login as regular user
    const regularLogin = await loginUser({ email: users[0].email, password: users[0].password });
    const regularToken = regularLogin.body.data.accessToken;

    const response = await request(app)
      .get("/api/v1/users?page=1&limit=2")
      .set("Authorization", `Bearer ${regularToken}`);

    expect(response.status).toBe(403);
  });

  it("should paginate users (admin only)", async () => {
    const response = await request(app)
      .get("/api/v1/users?page=1&limit=2")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(2);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(2);
  });

  it("should filter users by role", async () => {
    const response = await request(app)
      .get("/api/v1/users?role=USER")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    for (const user of response.body.data) {
      expect(user.role).toBe("USER");
    }
  });

  it("should search users by email", async () => {
    const targetUser = users[0];

    const response = await request(app)
      .get(`/api/v1/users?search=${encodeURIComponent(targetUser.email)}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(
      response.body.data.some((user: any) => user.email === targetUser.email)
    ).toBe(true);
  });

  it("should sort users by name ascending", async () => {
    const response = await request(app)
      .get("/api/v1/users?sort=name&order=asc")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const names = response.body.data.map((user: any) => user.name);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  it("should sort users by createdAt descending", async () => {
    const response = await request(app)
      .get("/api/v1/users?sort=createdAt&order=desc")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const dates = response.body.data.map((user: any) =>
      new Date(user.createdAt).getTime()
    );
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it("should ignore invalid sort field", async () => {
    const response = await request(app)
      .get("/api/v1/users?sort=invalidField")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });
});
