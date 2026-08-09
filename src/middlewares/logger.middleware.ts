import {
  NextFunction,
  Request,
  Response,
} from "express";

import { logger } from "../utils/logger/logger";

import {
  httpRequestsTotal,
  httpRequestDuration,
} from "../config/metrics";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] =
      process.hrtime(start);

    const durationSeconds =
      seconds + nanoseconds / 1_000_000_000;

    const route =
      req.route?.path || req.originalUrl;

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode,
      },
      durationSeconds
    );

    logger.info("HTTP Request", {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${Math.round(
        durationSeconds * 1000
      )}ms`,
      ip: req.ip,
    });
  });

  next();
};