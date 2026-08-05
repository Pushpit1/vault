import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export function generateAccessToken(
  userId: string,
  email: string
) {
  return jwt.sign(
    {
      sub: userId,
      email,
    },
    env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
}