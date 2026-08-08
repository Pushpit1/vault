import { Request, Response, NextFunction } from "express";
import { cacheService } from "../services/cache/cache.service";

export const cacheResponse =
  (ttl = 300) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const key =
      `${req.originalUrl}`;

    const cached =
      await cacheService.get(key);

    if (cached) {
      console.log("🟢 Middleware Cache HIT");
      return res.json(cached);
    }

    console.log("🔴 Middleware Cache MISS");

    const originalJson = res.json.bind(res);

    res.json = (body: unknown) => {
      cacheService.set(key, body, ttl);

      return originalJson(body);
    };

    next();
  };