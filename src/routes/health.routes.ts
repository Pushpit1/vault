import { Router } from "express";
import { getHealth } from "../controllers/health.controller";
import { validate } from "../middlewares/validate.middleware";
import { healthQuerySchema } from "../validators/health.validator";

const router = Router();

router.get("/", validate(healthQuerySchema), getHealth);

export default router;