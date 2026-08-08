import "dotenv/config";

import app from "./app";
import { env } from "./config/env";
import redis from "./config/redis";
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
    await redis.connect();

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
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

bootstrap();