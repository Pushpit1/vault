import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";

import { createUserSchema } from "../../validators/user.validator";
import { loginSchema } from "../../validators/auth.validator";
import { authorize } from "../../middlewares/authorize.middleware";

import {
  getUsers,
  createUser,
  loginUser,
  getProfile,
  getAdminDashboard,
} from "../../controllers/user.controller";

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  validate(createUserSchema),
  createUser
);

router.post(
  "/login",
  validate(loginSchema),
  loginUser
);

router.get(
  "/me",
  authenticate,
  getProfile
);

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  getAdminDashboard
);

export default router;