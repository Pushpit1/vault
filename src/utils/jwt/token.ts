import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateAccessToken(
  userId: string,
  email: string
) {
  return jwt.sign(
    {
      sub: userId,
      email,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
}