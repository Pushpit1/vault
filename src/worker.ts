import "dotenv/config";

import "./workers/email.worker";

import redis from "./config/redis";
import { logger } from "./utils/logger/logger";

async function bootstrap() {
  try {
    await redis.connect();

    logger.info("📦 BullMQ Worker started");

    const shutdown = async () => {
      logger.info("Stopping worker...");

      await redis.quit();

      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error("Worker failed to start", { error });

    process.exit(1);
  }
}

bootstrap();