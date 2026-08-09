import { RequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import redis, { connectRedis } from "../config/redis";
import { env } from "../config/env";

const sendCommand = async (...args: string[]): Promise<any> => {
  await connectRedis();

  return redis.sendCommand(args);
};

const authStore = new RedisStore({
  sendCommand,
  prefix: "vault:ratelimit:auth:",
});

const sensitiveActionStore = new RedisStore({
  sendCommand,
  prefix: "vault:ratelimit:sensitive:",
});

export const authRateLimit: RequestHandler = rateLimit({
  store: authStore,
  skip: () =>
    env.NODE_ENV === "test" &&
    process.env.RATE_LIMIT_TEST !== "true",
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later.",
  },
});

export const sensitiveActionRateLimit: RequestHandler =
  rateLimit({
    store: sensitiveActionStore,
    skip: () =>
      env.NODE_ENV === "test" &&
      process.env.RATE_LIMIT_TEST !== "true",
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  });
