import { StorageProvider } from "./storage.interface";
import { MinioProvider } from "./providers/minio.provider";

class StorageService {
  private provider: StorageProvider;

  constructor() {
    this.provider =
      new MinioProvider();
  }

  async initialize(): Promise<void> {
    await this.provider.initialize();
  }

  async upload(
    objectName: string,
    file: Buffer,
    mimeType: string
  ): Promise<void> {
    await this.provider.upload(
      objectName,
      file,
      mimeType
    );
  }

  async download(
    objectName: string
  ): Promise<NodeJS.ReadableStream> {
    return this.provider.download(
      objectName
    );
  }

  async delete(
    objectName: string
  ): Promise<void> {
    await this.provider.delete(
      objectName
    );
  }

  async exists(
    objectName: string
  ): Promise<boolean> {
    return this.provider.exists(
      objectName
    );
  }

  async getPresignedUrl(
    objectName: string,
    expirySeconds = 900
  ): Promise<string> {
    return this.provider.getPresignedUrl(
      objectName,
      expirySeconds
    );
  }
}

export const storageService =
  new StorageService();