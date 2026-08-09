import dotenv from "dotenv";
import { beforeAll, afterAll } from "vitest";
import redis from "../src/config/redis";

dotenv.config({
  path: ".env.test",
});

beforeAll(async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
});

afterAll(async () => {
  if (redis.isOpen) {
    await redis.quit();
  }
});