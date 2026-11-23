import { Prisma } from "../generated/prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { getPagination } from "../utils/pagination";
import { userRepository } from "../repositories/user.repository";
import { buildUserFilter } from "../utils/filter";
import { refreshTokenRepository } from "../repositories/refreshToken.repository";
import { buildUserSorting } from "../utils/sorting";
import { emailQueue } from "../queues/email.queue";
import {
  comparePassword,
  hashPassword,
} from "../utils/auth/password";
import redis from "../config/redis";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt/token";

import { ConflictError } from "../errors/ConflictError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";

import { passwordResetTokenRepository } from "../repositories/passwordResetToken.repository";
import { generatePasswordResetToken } from "../utils/auth/resetToken";
import { emailVerificationTokenRepository } from "../repositories/emailVerificationToken.repository";
import { storageService } from "./storage/storage.service";

export const userService = {
  async getAllUsers(
    page?: number,
    limit?: number,
    role?: string,
    isVerified?: string,
    search?: string,
    sort?: string,
    order?: string
  ) {
    const pagination = getPagination({ page, limit });

    const where = buildUserFilter({ role, isVerified, search });

    const orderBy = buildUserSorting({ sort, order });

    const result = await userRepository.findAll(
      pagination.skip,
      pagination.limit,
      where,
      orderBy
    );

    return {
      data: result.users,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / pagination.limit),
      },
    };
  },

  async createUser(data: Prisma.UserCreateInput) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    return userRepository.create({
      ...data,
      password: hashedPassword,
    });
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await refreshTokenRepository.create(refreshToken, user.id, expiresAt);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  },

  async refreshAccessToken(refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = verifyRefreshToken(refreshToken) as JwtPayload;
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const storedToken = await refreshTokenRepository.findByToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (storedToken.expiresAt <= new Date()) {
      await refreshTokenRepository.delete(refreshToken);
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (storedToken.user.id !== payload.sub) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Rotate: delete old, create new
    await refreshTokenRepository.delete(refreshToken);

    const newRefreshToken = generateRefreshToken(storedToken.user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await refreshTokenRepository.create(newRefreshToken, storedToken.user.id, expiresAt);

    const accessToken = generateAccessToken(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  },

  async logout(refreshToken: string) {
    try {
      verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const exists = await refreshTokenRepository.exists(refreshToken);

    if (!exists) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    await refreshTokenRepository.delete(refreshToken);

    return { message: "Logout successful" };
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    const hashedPassword = await hashPassword(newPassword);

    await userRepository.updatePassword(user.id, hashedPassword);

    // Invalidate all existing sessions
    await refreshTokenRepository.deleteAllByUser(user.id);

    return {
      message: "Password changed successfully. Please login again.",
    };
  },

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);

    // Always return the same response to prevent user enumeration
    if (!user) {
      return {
        message: "If that email exists in our system, you will receive a password reset link.",
      };
    }

    // Clear any existing reset tokens
    await passwordResetTokenRepository.deleteAllByUser(user.id);

    const token = generatePasswordResetToken();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await passwordResetTokenRepository.create(token, user.id, expiresAt);

    // Queue email dispatch (never return raw token to client)
    await emailQueue.add("password-reset-email", {
      type: "password-reset-email",
      email: user.email,
      token,
    });

    return {
      message: "If that email exists in our system, you will receive a password reset link.",
    };
  },

  async generateEmailVerification(email: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.isVerified) {
      throw new ConflictError("Email already verified");
    }

    // Clear existing verification tokens
    await emailVerificationTokenRepository.deleteAllByUser(user.id);

    const token = generatePasswordResetToken();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await emailVerificationTokenRepository.create(token, user.id, expiresAt);

    await emailQueue.add("verification-email", {
      type: "verification-email",
      email: user.email,
      token,
    });

    return {
      message: "Verification email sent successfully.",
    };
  },

  async verifyEmail(token: string) {
    const verificationToken = await emailVerificationTokenRepository.findByToken(token);

    if (!verificationToken) {
      throw new UnauthorizedError("Invalid or expired verification token");
    }

    if (verificationToken.expiresAt < new Date()) {
      await emailVerificationTokenRepository.delete(token);
      throw new UnauthorizedError("Verification token has expired. Please request a new one.");
    }

    // Mark user as verified
    await userRepository.updateVerificationStatus(verificationToken.userId, true);

    // Clean up token
    await emailVerificationTokenRepository.delete(token);

    return {
      message: "Email verified successfully.",
    };
  },

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await passwordResetTokenRepository.findByToken(token);

    if (!resetToken) {
      throw new UnauthorizedError("Invalid reset token");
    }

    if (resetToken.expiresAt < new Date()) {
      await passwordResetTokenRepository.delete(token);
      throw new UnauthorizedError("Reset token has expired");
    }

    const hashedPassword = await hashPassword(newPassword);

    await userRepository.updatePassword(resetToken.user.id, hashedPassword);

    await passwordResetTokenRepository.delete(token);

    // Invalidate all sessions
    await refreshTokenRepository.deleteAllByUser(resetToken.user.id);

    return {
      message: "Password reset successful. Please login again.",
    };
  },

  async updateProfile(userId: string, name?: string, email?: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (email && email !== user.email) {
      const existingUser = await userRepository.findByEmail(email);

      if (existingUser) {
        throw new ConflictError("Email already exists");
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      isVerified?: boolean;
    } = { name };

    if (email && email !== user.email) {
      updateData.email = email;
      updateData.isVerified = false;
    }

    const updatedUser = await userRepository.updateProfile(userId, updateData);

    // Invalidate profile cache
    await redis.del(`cache:/api/v1/users/me:${userId}`);

    return updatedUser;
  },

  async updateAvatar(userId: string, file: Express.Multer.File) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // If user already has an avatar stored in MinIO, delete it
    if (user.avatar) {
      try {
        await storageService.delete(user.avatar);
      } catch {
        // Ignore deletion errors for old avatar
      }
    }

    // Build a unique object key for the avatar
    const ext = file.originalname.includes(".")
      ? "." + file.originalname.split(".").pop()
      : "";
    const objectKey = `avatars/${userId}${ext}`;

    // Upload to MinIO
    await storageService.upload(objectKey, file.buffer, file.mimetype);

    // Store the MinIO object key
    const updatedUser = await userRepository.updateAvatar(userId, objectKey);

    // Invalidate profile cache
    await redis.del(`cache:/api/v1/users/me:${userId}`);

    return updatedUser;
  },

  async getProfile(userId: string) {
    const user = await userRepository.findPublicById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Resolve avatar object key to a presigned URL for the client
    if (user.avatar) {
      try {
        const avatarUrl = await storageService.getPresignedUrl(user.avatar, 900);
        return { ...user, avatarUrl };
      } catch {
        // Storage unavailable; return profile without avatar URL
      }
    }

    return user;
  },

  async getAdminStats() {
    const [totalUsers, verifiedUsers, adminUsers] = await Promise.all([
      userRepository.count({}),
      userRepository.count({ isVerified: true }),
      userRepository.count({ role: "ADMIN" }),
    ]);

    return {
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        unverified: totalUsers - verifiedUsers,
        admins: adminUsers,
      },
    };
  },
};
