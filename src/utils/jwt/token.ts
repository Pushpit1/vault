import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { Role } from "../../generated/prisma";

export function generateAccessToken(
  userId: string,
  email: string,
  role: Role
) {
  return jwt.sign(
    {
      sub: userId,
      email,
      role,
    },
    env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

export function generateRefreshToken(
  userId: string
) {
  return jwt.sign(
    {
      sub: userId,
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export function verifyRefreshToken(
  token: string
) {
  return jwt.verify(
    token.trim(),
    env.JWT_SECRET
  ) as jwt.JwtPayload;
}