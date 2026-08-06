import { Prisma } from "../generated/prisma";
import { JwtPayload } from "jsonwebtoken";

import { userRepository } from "../repositories/user.repository";
import { refreshTokenRepository } from "../repositories/refreshToken.repository";

import {
  comparePassword,
  hashPassword,
} from "../utils/auth/password";

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

import { emailService } from "./email.service";

export const userService = {
  async getAllUsers() {
    return userRepository.findAll();
  },

  async createUser(data: Prisma.UserCreateInput) {
    const existingUser =
      await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError(
        "Email already exists"
      );
    }

    const hashedPassword =
      await hashPassword(data.password);

    return userRepository.create({
      ...data,
      password: hashedPassword,
    });
  },

  async login(
    email: string,
    password: string
  ) {
    const user =
      await userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError(
        "Invalid email or password"
      );
    }

    const isPasswordValid =
      await comparePassword(
        password,
        user.password
      );

    if (!isPasswordValid) {
      throw new UnauthorizedError(
        "Invalid email or password"
      );
    }

    const accessToken =
      generateAccessToken(
        user.id,
        user.email,
        user.role
      );

    const refreshToken =
      generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + 7
    );

    await refreshTokenRepository.create(
      refreshToken,
      user.id,
      expiresAt
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  },

  async refreshAccessToken(
    refreshToken: string
  ) {
    let payload: JwtPayload;

    try {
      payload =
        verifyRefreshToken(
          refreshToken
        ) as JwtPayload;
    } catch {
      throw new UnauthorizedError(
        "Invalid refresh token"
      );
    }

    const storedToken =
      await refreshTokenRepository.findByToken(
        refreshToken
      );

    if (!storedToken) {
      throw new UnauthorizedError(
        "Invalid refresh token"
      );
    }

    if (
      storedToken.user.id !==
      payload.sub
    ) {
      throw new UnauthorizedError(
        "Invalid refresh token"
      );
    }

    // Delete old Refresh Token
    await refreshTokenRepository.delete(
      refreshToken
    );

    // Generate new Refresh Token
    const newRefreshToken =
      generateRefreshToken(
        storedToken.user.id
      );

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + 7
    );

    // Save new Refresh Token
    await refreshTokenRepository.create(
      newRefreshToken,
      storedToken.user.id,
      expiresAt
    );

    // Generate new Access Token
    const accessToken =
      generateAccessToken(
        storedToken.user.id,
        storedToken.user.email,
        storedToken.user.role
      );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  },

  async logout(
  refreshToken: string
) {
  try {
    verifyRefreshToken(
      refreshToken
    );
  } catch {
    throw new UnauthorizedError(
      "Invalid refresh token"
    );
  }

  const exists =
    await refreshTokenRepository.exists(
      refreshToken
    );

  if (!exists) {
    throw new UnauthorizedError(
      "Invalid refresh token"
    );
  }

  await refreshTokenRepository.delete(
    refreshToken
  );

  return {
    message: "Logout successful",
  };
},

async changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user =
    await userRepository.findById(
      userId
    );

  if (!user) {
    throw new NotFoundError(
      "User not found"
    );
  }

  const isPasswordValid =
    await comparePassword(
      currentPassword,
      user.password
    );

  if (!isPasswordValid) {
    throw new UnauthorizedError(
      "Current password is incorrect"
    );
  }

  const hashedPassword =
    await hashPassword(
      newPassword
    );

  await userRepository.updatePassword(
    user.id,
    hashedPassword
  );

  await refreshTokenRepository.deleteAllByUser(
    user.id
  );

  return {
    message:
      "Password changed successfully. Please login again.",
  };
},

async forgotPassword(
  email: string
) {
  const user =
    await userRepository.findByEmail(
      email
    );

  if (!user) {
    throw new NotFoundError(
      "User not found"
    );
  }

  await passwordResetTokenRepository.deleteAllByUser(
    user.id
  );

  const token =
    generatePasswordResetToken();

  const expiresAt = new Date();
  expiresAt.setMinutes(
    expiresAt.getMinutes() + 15
  );

  await passwordResetTokenRepository.create(
    token,
    user.id,
    expiresAt
  );

  return {
    resetToken: token,
  };
},
async generateEmailVerification(
  email: string
) {
  const user =
    await userRepository.findByEmail(
      email
    );

  if (!user) {
    throw new NotFoundError(
      "User not found"
    );
  }

  if (user.isVerified) {
    throw new ConflictError(
      "Email already verified"
    );
  }

  await emailVerificationTokenRepository.deleteAllByUser(
    user.id
  );

  const token =
    generatePasswordResetToken();

  const expiresAt = new Date();
  expiresAt.setHours(
    expiresAt.getHours() + 24
  );

  await emailVerificationTokenRepository.create(
    token,
    user.id,
    expiresAt
  );

  await emailService.sendVerificationEmail(
  user.email,
  token
);

return {
  message:
    "Verification email sent successfully.",
};
},

async resetPassword(
  token: string,
  newPassword: string
) {
  const resetToken =
    await passwordResetTokenRepository.findByToken(
      token
    );

  if (!resetToken) {
    throw new UnauthorizedError(
      "Invalid reset token"
    );
  }

  if (
    resetToken.expiresAt <
    new Date()
  ) {
    await passwordResetTokenRepository.delete(
      token
    );

    throw new UnauthorizedError(
      "Reset token has expired"
    );
  }

  const hashedPassword =
    await hashPassword(
      newPassword
    );

  await userRepository.updatePassword(
    resetToken.user.id,
    hashedPassword
  );

  await passwordResetTokenRepository.delete(
    token
  );

  await refreshTokenRepository.deleteAllByUser(
    resetToken.user.id
  );

  return {
    message:
      "Password reset successful. Please login again.",
  };
},

async updateProfile(
  userId: string,
  name?: string,
  email?: string
) {
  const user =
    await userRepository.findById(
      userId
    );

  if (!user) {
    throw new NotFoundError(
      "User not found"
    );
  }

  if (
    email &&
    email !== user.email
  ) {
    const existingUser =
      await userRepository.findByEmail(
        email
      );

    if (existingUser) {
      throw new ConflictError(
        "Email already exists"
      );
    }
  }

  const updateData: {
    name?: string;
    email?: string;
    isVerified?: boolean;
  } = {
    name,
  };

  if (
    email &&
    email !== user.email
  ) {
    updateData.email = email;
    updateData.isVerified = false;
  }

  return userRepository.updateProfile(
    userId,
    updateData
  );
},

async updateAvatar(
  userId: string,
  avatar: string
) {
  const user =
    await userRepository.findById(
      userId
    );

  if (!user) {
    throw new NotFoundError(
      "User not found"
    );
  }

  return userRepository.updateAvatar(
    userId,
    avatar
  );
},

  async getProfile(
    userId: string
  ) {
    const user =
      await userRepository.findById(
        userId
      );

    if (!user) {
      throw new NotFoundError(
        "User not found"
      );
    }

    return user;
  },
};