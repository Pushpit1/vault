import { Router } from "express";

import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

import {
  loginSchema,
  changePasswordSchema,
} from "../../validators/auth.validator";

import {
  getUsers,
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
  changePassword,
  getProfile,
  getAdminDashboard,
} from "../../controllers/user.controller";

const router = Router();

router.get("/", getUsers);

router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword
);

router.post(
  "/login",
  validate(loginSchema),
  loginUser
);

router.post(
  "/refresh",
  refreshToken
);

router.post(
  "/logout",
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