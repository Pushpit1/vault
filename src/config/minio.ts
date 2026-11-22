import { Client } from "minio";

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
  region: "us-east-1",
});

export const minioPublicClient = new Client({
  endPoint:
    process.env.MINIO_PUBLIC_ENDPOINT ||
    process.env.MINIO_ENDPOINT!,
  port: Number(
    process.env.MINIO_PUBLIC_PORT ||
      process.env.MINIO_PORT,
  ),
  useSSL:
    process.env.MINIO_PUBLIC_USE_SSL !== undefined
      ? process.env.MINIO_PUBLIC_USE_SSL === "true"
      : process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
  region: "us-east-1",
});

const bucket =
  process.env.MINIO_BUCKET_NAME ||
  process.env.MINIO_BUCKET;

if (!bucket) {
  throw new Error(
    "MinIO bucket configuration missing: please set MINIO_BUCKET_NAME or MINIO_BUCKET in your environment variables."
  );
}

export const BUCKET_NAME = bucket;

