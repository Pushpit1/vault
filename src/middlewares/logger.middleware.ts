import { NextFunction, Request, Response } from "express";

import { logger } from "../utils/logger/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    logger.info("HTTP Request", {
  requestId: req.requestId,
  method: req.method,
  url: req.originalUrl,
  status: res.statusCode,
  duration: `${Date.now() - start}ms`,
  ip: req.ip,
});
  });

  next();
};