import path from "path";
import crypto from "crypto";

import { fileRepository } from "../../repositories/file.repository";
import { storageService } from "../storage/storage.service";
import { BUCKET_NAME } from "../../config/minio";

export const fileService = {
  async upload(
    file: Express.Multer.File,
    ownerId: string
  ) {
    const extension =
      path.extname(file.originalname);

    const objectKey =
      `${crypto.randomUUID()}${extension}`;

    await storageService.upload(
      objectKey,
      file.buffer,
      file.mimetype
    );

    return fileRepository.create({
      originalName: file.originalname,
      objectKey,
      bucket: BUCKET_NAME,
      mimeType: file.mimetype,
      extension,
      size: BigInt(file.size),
      ownerId,
    });
  },

  async download(id: string, ownerId: string) {
    const file =
      await fileRepository.findById(id);

    if (!file || file.ownerId !== ownerId) {
      throw new Error("File not found");
    }

    const stream =
      await storageService.download(
        file.objectKey
      );

    return {
      file,
      stream,
    };
  },

  async delete(id: string, ownerId: string) {
    const file =
      await fileRepository.findById(id);

    if (!file || file.ownerId !== ownerId) {
      throw new Error("File not found");
    }

    await storageService.delete(
      file.objectKey
    );

    await fileRepository.delete(id);

    return {
      message:
        "File deleted successfully",
    };
  },

  async list(ownerId: string) {
    return fileRepository.findAllByOwner(
      ownerId
    );
  },

  async getPresignedUrl(
    id: string,
    ownerId: string
  ) {
    const file =
      await fileRepository.findById(id);

    if (!file) {
      throw new Error("File not found");
    }

    if (file.ownerId !== ownerId) {
      throw new Error(
        "You do not have permission to access this file"
      );
    }

    const url =
      await storageService.getPresignedUrl(
        file.objectKey,
        900
      );

    return {
      url,
      expiresIn: 900,
    };
  },
};