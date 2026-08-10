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
 * Used by the API container to upload,
 * download, delete, and inspect objects.
 */
export const minioClient =
  new Client({
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
 * Public signing client.
 *
 * This endpoint is served by Nginx and
 * proxied to the private MinIO instance.
 */
export const minioPublicClient =
  new Client({
    endPoint:
      process.env.MINIO_PUBLIC_ENDPOINT!,
    port:
      Number(process.env.MINIO_PUBLIC_PORT),
    useSSL:
      process.env.MINIO_PUBLIC_USE_SSL === "true",
    accessKey,
    secretKey,
    region: "us-east-1",
  });

export const BUCKET_NAME =
  bucket;
