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

export const userService = {
  async getAllUsers() {
    return userRepository.findAll();
  },

  async createUser(data: Prisma.UserCreateInput) {
    const existingUser =
      await userRepository.findByEmail(
        data.email
      );

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

    const accessToken =
      generateAccessToken(
        storedToken.user.id,
        storedToken.user.email,
        storedToken.user.role
      );

    return {
      accessToken,
    };
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