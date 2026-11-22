import dotenv from "dotenv";
import { beforeAll, afterAll } from "vitest";
import redis from "../src/config/redis";

dotenv.config({
  path: ".env.test",
  override: true,
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
