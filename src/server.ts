import "dotenv/config";

import app from "./app";
import { env } from "./config/env";

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

app.listen(env.PORT, () => {
  logger.info(
  `Vault Server running on http://localhost:${env.PORT}`
);
});