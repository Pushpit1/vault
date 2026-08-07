import "express";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      user: JwtPayload;
    }
  }
}

export {};