import { Router } from "express";

import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";
import { avatarUpload } from "../../middlewares/upload.middleware";
import { cache } from "../../middlewares/cache.middleware";
import {
  authRateLimit,
  sensitiveActionRateLimit,
} from "../../middlewares/rateLimit.middleware";

import {
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  emailVerificationSchema,
  verifyEmailSchema,
} from "../../validators/auth.validator";

import {
  createUserSchema,
  updateProfileSchema,
} from "../../validators/user.validator";

import {
  getUsers,
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getProfile,
  getAdminDashboard,
  generateEmailVerification,
  verifyEmail,
  updateProfile,
  updateAvatar,
} from "../../controllers/user.controller";

const router = Router();

// ─── Public Auth Routes ──────────────────────────────────────────────────────

router.post(
  "/",
  authRateLimit,
  validate(createUserSchema),
  createUser
);

router.post(
  "/login",
  authRateLimit,
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

router.post(
  "/forgot-password",
  sensitiveActionRateLimit,
  validate(forgotPasswordSchema),
  forgotPassword
);

router.post(
  "/reset-password",
  sensitiveActionRateLimit,
  validate(resetPasswordSchema),
  resetPassword
);

// ─── Email Verification ───────────────────────────────────────────────────────

router.post(
  "/verify-email",
  sensitiveActionRateLimit,
  validate(emailVerificationSchema),
  generateEmailVerification
);

router.get(
  "/verify-email",
  validate(verifyEmailSchema),
  verifyEmail
);

// ─── Authenticated User Routes ────────────────────────────────────────────────

router.post(
  "/change-password",
  authenticate,
  sensitiveActionRateLimit,
  validate(changePasswordSchema),
  changePassword
);

router.get(
  "/me",
  authenticate,
  cache(60),
  getProfile
);

router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  updateProfile
);

router.patch(
  "/me/avatar",
  authenticate,
  avatarUpload.single("avatar"),
  updateAvatar
);

// ─── Admin Routes ─────────────────────────────────────────────────────────────

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getUsers
);

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  getAdminDashboard
);

export default router;
