import { RequestHandler } from "express";
import {
  httpRequestsTotal,
  httpRequestDuration,
} from "../config/metrics";

export const metricsMiddleware: RequestHandler =
  (req, res, next) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
      const duration =
        Number(process.hrtime.bigint() - start) /
        1_000_000_000;

      const route =
        req.route?.path ||
        req.path ||
        "unknown";

      const labels = {
        method: req.method,
        route,
        status_code: String(res.statusCode),
      };

      httpRequestsTotal.inc(labels);

      httpRequestDuration.observe(
        labels,
        duration
      );
    });

    next();
  };
