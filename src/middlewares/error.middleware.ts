import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppError } from "../errors/AppError";
import { logger } from "../utils/logger/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    let message = "File upload error";
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds the allowed limit";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = `Unexpected upload field '${err.field}'`;
    } else {
      message = err.message;
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }

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