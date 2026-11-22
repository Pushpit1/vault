import { Router } from "express";
import {
  getCacheStats,
  getCacheHealth,
} from "../../../controllers/cache/cache.controller";
import { authenticate } from "../../../middlewares/auth.middleware";
import { authorize } from "../../../middlewares/authorize.middleware";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/stats", getCacheStats);
router.get("/health", getCacheHealth);

export default router;
