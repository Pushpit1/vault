
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import express from "express";
import helmet from "helmet";
import apiV1Routes from "./routes/v1";
import { requestLogger } from "./middlewares/logger.middleware";
import { requestId } from "./middlewares/requestId.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { corsMiddleware } from "./config/cors";
import compression from "compression";


const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(corsMiddleware);
app.use(compression());
app.use(requestId);
app.use(requestLogger);
app.use(express.json());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/", (_req, res) => {
  res.send("Vault API is running 🚀");
});

app.use("/api/v1", apiV1Routes);

app.use(notFound);
app.use(errorHandler);

export default app;