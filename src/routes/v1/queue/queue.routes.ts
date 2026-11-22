import { Router } from "express";
import { getQueueStats } from "../../../controllers/queue/queue.controller";
import { getQueueHealth } from "../../../controllers/queue/queueHealth.controller";
import { authenticate } from "../../../middlewares/auth.middleware";
import { authorize } from "../../../middlewares/authorize.middleware";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/health", getQueueHealth);
router.get("/stats", getQueueStats);

export default router;
