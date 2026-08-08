import { Router } from "express";
import {
  getCacheStats,
  getCacheHealth,
} from "../../../controllers/cache/cache.controller";

const router = Router();

router.get("/stats", getCacheStats);
router.get("/health", getCacheHealth);
export default router;