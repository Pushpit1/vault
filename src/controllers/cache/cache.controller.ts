import { Request, Response } from "express";
import { cacheService } from "../../services/cache/cache.service";

export const getCacheStats = async (
  _req: Request,
  res: Response
) => {
  const stats =
    await cacheService.stats();

  res.json(stats);
};

export const getCacheHealth = async (
  _req: Request,
  res: Response
) => {
  const health =
    await cacheService.health();

  res.json(health);
};