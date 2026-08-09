import { createClient } from "redis";
import { env } from "./env";

const redis = createClient({
  url: env.REDIS_URL,
});

redis.on("connect", () => {
  console.log("?? Redis connected");
});

redis.on("ready", () => {
  console.log("?? Redis ready");
});

redis.on("error", (err) => {
  console.error("?? Redis error:", err);
});

let connectionPromise: Promise<void> | null = null;

export const connectRedis = async (): Promise<void> => {
  if (redis.isReady) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = redis
      .connect()
      .then(() => undefined)
      .finally(() => {
        connectionPromise = null;
      });
  }

  await connectionPromise;
};

export default redis;
