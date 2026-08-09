import { prisma } from "../config/prisma";
import redis from "../config/redis";
import { minioClient, BUCKET_NAME } from "../config/minio";

export const healthService = {
  async checkReadiness() {
    const checks = {
      database: false,
      redis: false,
      minio: false,
    };

    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch {}

    try {
      checks.redis = redis.isReady;
    } catch {}

    try {
      checks.minio =
        await minioClient.bucketExists(
          BUCKET_NAME
        );
    } catch {}

    const ready =
      checks.database &&
      checks.redis &&
      checks.minio;

    return {
      ready,
      checks,
    };
  },
};