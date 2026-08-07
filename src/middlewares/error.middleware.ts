import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { logger } from "../utils/logger/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error("Unhandled Error", {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    status:
      err instanceof AppError
        ? err.statusCode
        : 500,
    message: err.message,
    stack: err.stack,
    ip: req.ip,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};