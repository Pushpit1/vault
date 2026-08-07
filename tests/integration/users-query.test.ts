import {
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import request from "supertest";

import app from "../../src/app";

import { prisma } from "../../src/config/prisma";

import { createTestUser } from "../fixtures/user.factory";

const users = [
  createTestUser(),
  createTestUser(),
  createTestUser(),
  createTestUser(),
  createTestUser(),
];

describe("Users Query API", () => {
  beforeAll(async () => {
    for (const user of users) {
      await prisma.user.deleteMany({
        where: {
          email: user.email,
        },
      });

      await request(app)
        .post("/api/v1/users")
        .send(user);
    }
  });

  it("should paginate users", async () => {
  const response =
    await request(app)
      .get("/api/v1/users?page=1&limit=2");

  expect(response.status).toBe(200);

  expect(response.body.success)
    .toBe(true);

  expect(
    response.body.data.length
  ).toBe(2);

  expect(
    response.body.meta.page
  ).toBe(1);

  expect(
    response.body.meta.limit
  ).toBe(2);
});

it("should filter users by role", async () => {
  const response = await request(app)
    .get("/api/v1/users?role=USER");

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.length)
    .toBeGreaterThan(0);

  for (const user of response.body.data) {
    expect(user.role).toBe("USER");
  }
});
it("should search users by email", async () => {
  const targetUser = users[0];

  const response = await request(app)
    .get(
      `/api/v1/users?search=${encodeURIComponent(
        targetUser.email
      )}`
    );

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.length)
    .toBeGreaterThan(0);

  expect(
    response.body.data.some(
      (user: any) =>
        user.email === targetUser.email
    )
  ).toBe(true);
});

it("should sort users by name ascending", async () => {
  const response = await request(app)
    .get(
      "/api/v1/users?sort=name&order=asc"
    );

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  const names = response.body.data.map(
    (user: any) => user.name
  );

  const sorted = [...names].sort();

  expect(names).toEqual(sorted);
});

it("should sort users by createdAt descending", async () => {
  const response = await request(app)
    .get(
      "/api/v1/users?sort=createdAt&order=desc"
    );

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  const dates = response.body.data.map(
    (user: any) =>
      new Date(user.createdAt).getTime()
  );

  const sorted = [...dates].sort(
    (a, b) => b - a
  );

  expect(dates).toEqual(sorted);
});

it("should ignore invalid sort field", async () => {
  const response = await request(app)
    .get(
      "/api/v1/users?sort=invalidField"
    );

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.length)
    .toBeGreaterThan(0);
});

});