import { Request, Response, NextFunction } from "express";

import { cacheService } from "../services/cache/cache.service";
import { logger } from "../utils/logger/logger";

const DEFAULT_TTL = 60;

export function cache(ttl = DEFAULT_TTL) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = (req as any).user?.id ?? "guest";

    const key =
      req.originalUrl === "/api/v1/users/me"
        ? `cache:${req.originalUrl}:${userId}`
        : `cache:${req.originalUrl}`;

    try {
      const cached = await cacheService.get(key);

      if (cached) {
        logger.info("Cache HIT", {
          key,
          ttl,
          method: req.method,
        });

        return res.status(200).json(cached);
      }

      logger.info("Cache MISS", {
        key,
        ttl,
        method: req.method,
      });

      const originalJson = res.json.bind(res);

      res.json = (body: any) => {
        logger.info("Cache STORE", {
          key,
          ttl,
        });

        cacheService
          .set(key, body, ttl)
          .catch((err) => {
            logger.error("Cache Store Error", {
              error: err,
              key,
            });
          });

        return originalJson(body);
      };

      next();
    } catch (err) {
      logger.error("Redis Cache Error", {
        error: err,
        key,
      });

      next();
    }
  };
}