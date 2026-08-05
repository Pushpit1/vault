import express from "express";
import healthRoutes from "./routes/health.routes";
import { logger } from "./middlewares/logger.middleware";
const app = express();
app.use(logger);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Vault API is running 🚀");
});

app.use("/health", healthRoutes);

export default app;