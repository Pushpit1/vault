import "dotenv/config";

import "./workers/email.worker";

import app from "./app";

import { env } from "./config/env";
import redis, { connectRedis } from "./config/redis";
import { storageService } from "./services/storage/storage.service";

import { logger } from "./utils/logger/logger";

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    message: error.message,
    stack: error.stack,
  });

  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", {
    reason,
  });

  process.exit(1);
});

async function bootstrap() {
  try {
    // Redis
await connectRedis();
    // MinIO
    await storageService.initialize();

    const server = app.listen(env.PORT, () => {
      logger.info(
        `Vault Server running on http://localhost:${env.PORT}`
      );
    });

    const shutdown = async () => {
      logger.info("Shutting down server...");

      await redis.quit();

      server.close(() => {
        logger.info("Server stopped.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("FAILED TO START SERVER:", error);

    if (error instanceof Error) {
      console.error("MESSAGE:", error.message);
      console.error("STACK:", error.stack);
    }

    process.exit(1);
  }
}

bootstrap();
