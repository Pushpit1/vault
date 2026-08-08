import { StorageProvider } from "../storage.interface";

import {
  minioClient,
  minioPublicClient,
  BUCKET_NAME,
} from "../../../config/minio";

export class MinioProvider
  implements StorageProvider
{
  async initialize(): Promise<void> {
    const exists =
      await minioClient.bucketExists(
        BUCKET_NAME
      );

    if (!exists) {
      await minioClient.makeBucket(
        BUCKET_NAME,
        "us-east-1"
      );
    }
  }

  async upload(
    objectName: string,
    file: Buffer,
    mimeType: string
  ): Promise<void> {
    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      file,
      file.length,
      {
        "Content-Type": mimeType,
      }
    );
  }

  async download(
    objectName: string
  ): Promise<NodeJS.ReadableStream> {
    return minioClient.getObject(
      BUCKET_NAME,
      objectName
    );
  }

  async delete(
    objectName: string
  ): Promise<void> {
    await minioClient.removeObject(
      BUCKET_NAME,
      objectName
    );
  }

  async exists(
    objectName: string
  ): Promise<boolean> {
    try {
      await minioClient.statObject(
        BUCKET_NAME,
        objectName
      );

      return true;
    } catch {
      return false;
    }
  }

  async getPresignedUrl(
    objectName: string,
    expirySeconds = 900
  ): Promise<string> {
    return minioPublicClient.presignedGetObject(
      BUCKET_NAME,
      objectName,
      expirySeconds
    );
  }
}