import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { userRepository } from "../repositories/user.repository";
import { comparePassword } from "../utils/auth/password";

/**
 * Browser-compatible admin authentication middleware for Bull Board (/admin/queues).
 * Supports:
 * 1. Bearer JWT in Authorization header
 * 2. accessToken / token cookie
 * 3. ?token= query parameter (sets cookie for SPA asset requests)
 * 4. HTTP Basic Auth (prompts native browser login dialog if unauthenticated)
 */
export const adminBoardAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryToken =
    typeof req.query.token === "string" ? req.query.token : undefined;

  const cookieToken =
    req.cookies?.accessToken || req.cookies?.token;

  const authHeader = req.headers.authorization;
  let bearerToken: string | undefined;
  if (authHeader?.startsWith("Bearer ")) {
    bearerToken = authHeader.split(" ")[1];
  }

  const token = bearerToken || cookieToken || queryToken;

  if (token) {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
      if (payload.role === "ADMIN") {
        req.user = payload;
        if (queryToken && !cookieToken) {
          res.cookie("accessToken", queryToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000, // 15 minutes — matches access token lifetime
          });
        }
        return next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Admin access required",
        });
      }
    } catch {
      // Invalid token, fall through to Basic Auth
    }
  }

  if (authHeader?.startsWith("Basic ")) {
    try {
      const credentials = Buffer.from(
        authHeader.split(" ")[1],
        "base64"
      ).toString("utf-8");
      const [email, ...passParts] = credentials.split(":");
      const password = passParts.join(":");

      if (email && password) {
        const user = await userRepository.findByEmail(email);
        if (user && user.role === "ADMIN") {
          const isValid = await comparePassword(password, user.password);
          if (isValid) {
            req.user = {
              sub: user.id,
              email: user.email,
              role: user.role,
            };
            return next();
          }
        }
      }
    } catch {
      // Malformed basic auth header
    }
  }

  res.setHeader("WWW-Authenticate", 'Basic realm="Vault Queue Admin"');
  return res
    .status(401)
    .send("Authentication required to access Vault Queue Admin");
};
