import { Client } from "minio";

const accessKey =
  process.env.MINIO_ACCESS_KEY!;

const secretKey =
  process.env.MINIO_SECRET_KEY!;

const bucket =
  process.env.MINIO_BUCKET!;

/*
 * Internal MinIO client.
 *
 * Used by the API container to actually
 * upload/download/delete objects.
 *
 * Docker can resolve "minio".
 */
export const minioClient = new Client({
  endPoint:
    process.env.MINIO_ENDPOINT!,
  port:
    Number(process.env.MINIO_PORT),
  useSSL:
    process.env.MINIO_USE_SSL === "true",
  accessKey,
  secretKey,
  region: "us-east-1",
});

/*
 * Public MinIO client.
 *
 * IMPORTANT:
 * The browser needs localhost:9000 in the
 * signed URL.
 *
 * We therefore sign the URL using
 * localhost:9000 from the beginning.
 *
 * region is explicitly supplied so the SDK
 * does not need to contact MinIO to discover
 * the bucket region.
 */
export const minioPublicClient =
  new Client({
    endPoint: "localhost",
    port: 9000,
    useSSL: false,
    accessKey,
    secretKey,
    region: "us-east-1",
  });

export const BUCKET_NAME = bucket;

export const MINIO_PUBLIC_URL =
  process.env.MINIO_PUBLIC_URL ||
  "http://localhost:9000";