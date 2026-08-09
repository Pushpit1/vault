import { Router } from "express";

import {
  getHealth,
  getLiveness,
  getReadiness,
} from "../../controllers/health.controller";

import { validate } from "../../middlewares/validate.middleware";
import { healthQuerySchema } from "../../validators/health.validator";

const router = Router();

router.get("/", validate(healthQuerySchema), getHealth);

router.get(
  "/live",
  getLiveness
);

router.get(
  "/ready",
  getReadiness
);

export default router;