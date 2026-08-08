import { Router } from "express";
import { getQueueStats } from "../../../controllers/queue/queue.controller";
import { getQueueHealth } from "../../../controllers/queue/queueHealth.controller";

const router = Router();
router.get("/health", getQueueHealth);
router.get("/stats", getQueueStats);

export default router;