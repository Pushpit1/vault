import redis from "../../config/redis";

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  },

  async set(
    key: string,
    value: unknown,
    ttlSeconds = 300
  ) {
   await redis.set(
  key,
  JSON.stringify(value),
  {
    EX: ttlSeconds,
  }
);
  },

  async del(key: string) {
    await redis.del(key);
  },

  async delByPattern(pattern: string) {
  const keys = await redis.keys(pattern);

  if (keys.length > 0) {
    await redis.del(keys);
  }
},

  async exists(key: string) {
    return (await redis.exists(key)) === 1;
  },

  async flush() {
    await redis.flushDb();
  },
  async stats() {
  const keys = await redis.dbSize();

  const info = await redis.info("memory");

  const memory =
    info
      .split("\n")
      .find(line =>
        line.startsWith("used_memory_human:")
      )
      ?.split(":")[1]
      ?.trim() ?? "Unknown";

  return {
    healthy: true,
    connected: true,
    keys,
    memory,
  };
}
,
async health() {
  const start = Date.now();

  await redis.ping();

  const latency = Date.now() - start;

  return {
    healthy: true,
    connected: true,
    latency: `${latency}ms`,
    timestamp: new Date().toISOString(),
  };
}
};