import express from "express";
import healthRoutes from "./routes/health.routes";
import { logger } from "./middlewares/logger.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
const app = express();

app.use(logger);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Vault API is running 🚀");
});

app.use("/health", healthRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
