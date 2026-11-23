import dotenv from "dotenv";
import { beforeAll, afterAll } from "vitest";
import redis from "../src/config/redis";

// Load .env.test for local development without overriding CI-injected variables.
// When running in CI, process.env is already populated by the workflow; override: false
// (the dotenv default) ensures those values take precedence over .env.test.
dotenv.config({
  path: ".env.test",
});

beforeAll(async () => {
  if (process.env.TEST_SKIP_REDIS === "true") {
    return;
  }

  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
  } catch (error) {
    // If Redis is not running locally, integration tests requiring Redis will fail, but unit tests can proceed
  }
});

afterAll(async () => {
  if (process.env.TEST_SKIP_REDIS === "true") {
    return;
  }

  try {
    if (redis.isOpen) {
      await redis.quit();
    }
  } catch {}
});
