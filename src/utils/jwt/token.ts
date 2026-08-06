import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { Role } from "../../generated/prisma";

export function generateAccessToken(
  userId: string,
  email: string,
  role: Role
) {
  console.log("Signing Access Secret:", env.JWT_SECRET);

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
  console.log("Signing Refresh Secret:", env.JWT_SECRET);

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
  console.log("Verify Secret:", env.JWT_SECRET);
  console.log("Token Length:", token.length);
  console.log("Token:", JSON.stringify(token));

  return jwt.verify(
    token.trim(),
    env.JWT_SECRET
  ) as jwt.JwtPayload;
}