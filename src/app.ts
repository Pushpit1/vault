import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import express from "express";
import helmet from "helmet";
import apiV1Routes from "./routes/v1";
import { requestLogger } from "./middlewares/logger.middleware";
import { requestId } from "./middlewares/requestId.middleware";
import { metricsMiddleware } from "./middlewares/metrics.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { corsMiddleware } from "./config/cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import { serverAdapter } from "./config/bull-board/bullBoard";
import { adminBoardAuth } from "./middlewares/adminBoardAuth.middleware";

import metricsRoutes from "./routes/metrics.routes";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(corsMiddleware);
app.use(compression());
app.use(cookieParser());

app.use(requestId);
app.use(metricsMiddleware);
app.use(requestLogger);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/", (_req, res) => {
  res.json({
    name: "Vault API",
    version: "1.0.0",
    status: "running",
    docs: "/docs",
    health: "/api/v1/health/ready",
  });
});

app.use("/metrics", metricsRoutes);

app.use("/api/v1", apiV1Routes);

// Bull Board queue admin — browser and API compatible admin authentication
app.use(
  "/admin/queues",
  adminBoardAuth,
  serverAdapter.getRouter()
);

app.use(notFound);
app.use(errorHandler);

export default app;
