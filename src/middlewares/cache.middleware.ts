import { Request, Response, NextFunction } from "express";
import redis from "../config/redis";

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
      const cached = await redis.get(key);

      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }

      const originalJson = res.json.bind(res);

      res.json = (body: any) => {
        redis
          .setEx(key, ttl, JSON.stringify(body))
          .catch(console.error);

        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error("Redis Cache Error:", err);
      next();
    }
  };
}