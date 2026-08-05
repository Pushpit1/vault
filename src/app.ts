import express from "express";

import apiV1Routes from "./routes/v1";
import { logger } from "./middlewares/logger.middleware";
import { requestId } from "./middlewares/requestId.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(requestId);
app.use(logger);
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Vault API is running 🚀");
});

app.use("/api/v1", apiV1Routes);

app.use(notFound);
app.use(errorHandler);

export default app;