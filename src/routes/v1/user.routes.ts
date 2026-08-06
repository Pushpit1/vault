import { Router } from "express";

import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";
import { upload } from "../../middlewares/upload.middleware";

import { emailService } from "../../services/email.service";

import {
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  emailVerificationSchema ,
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
  generateEmailVerification ,
  updateProfile ,
  updateAvatar
} from "../../controllers/user.controller";

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  validate(createUserSchema),
  createUser
);

router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword
);

router.post(
  "/forgot-password",
  validate(
    forgotPasswordSchema
  ),
  forgotPassword
);

router.post(
  "/verify-email",
  validate(
    emailVerificationSchema
  ),
  generateEmailVerification
);

router.post(
  "/reset-password",
  validate(
    resetPasswordSchema
  ),
  resetPassword
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

router.patch(
  "/me",
  authenticate,
  validate(
    updateProfileSchema
  ),
  updateProfile
);

router.patch(
  "/me/avatar",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  getAdminDashboard
);

router.get(
  "/test-email",
  async (_req, res) => {
    await emailService.sendVerificationEmail(
      "YOUR_EMAIL@gmail.com",
      "test-token-123"
    );

    res.json({
      success: true,
      message: "Email sent!",
    });
  }
);

export default router;