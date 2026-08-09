import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../src/app";

describe("Rate Limiting", () => {
  it("should return 429 after exceeding the login limit", async () => {
    process.env.RATE_LIMIT_TEST = "true";

    const responses: number[] = [];

    for (let i = 0; i < 11; i++) {
      const response = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: `ratelimit-${Date.now()}-${i}@example.com`,
          password: "wrong-password",
        });

      responses.push(response.status);
    }

    expect(responses).toContain(429);

    delete process.env.RATE_LIMIT_TEST;
  });
});
