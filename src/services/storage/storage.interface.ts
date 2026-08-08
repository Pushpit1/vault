export interface StorageProvider {
  initialize(): Promise<void>;

  upload(
    objectName: string,
    file: Buffer,
    mimeType: string
  ): Promise<void>;

  download(
    objectName: string
  ): Promise<NodeJS.ReadableStream>;

  delete(
    objectName: string
  ): Promise<void>;

  exists(
    objectName: string
  ): Promise<boolean>;

  getPresignedUrl(
    objectName: string,
    expirySeconds?: number
  ): Promise<string>;
}