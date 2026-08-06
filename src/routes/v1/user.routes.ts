import { Router } from "express";

import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

import { createUserSchema } from "../../validators/user.validator";
import { loginSchema } from "../../validators/auth.validator";
import { refreshSchema } from "../../validators/refresh.validator";
import { logoutSchema } from "../../validators/logout.validator";

import {
  getUsers,
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
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

router.post(
  "/refresh",
  validate(refreshSchema),
  refreshToken
);

router.post(
  "/logout",
  validate(logoutSchema),
  logoutUser
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