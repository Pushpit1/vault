import { Router } from "express";
import healthRoutes from "./health.routes";
import userRoutes from "./user.routes";
import queueRoutes from "./queue/queue.routes";
import cacheRoutes from "./cache/cache.routes";
import fileRoutes from "./file/file.routes";
const router = Router();

router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/queue", queueRoutes);
router.use("/cache", cacheRoutes);
router.use(
  "/files",
  fileRoutes
);
export default router;