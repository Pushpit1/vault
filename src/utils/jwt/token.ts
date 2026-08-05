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