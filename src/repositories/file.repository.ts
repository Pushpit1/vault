import { prisma } from "../config/prisma";

export const fileRepository = {
  async create(data: {
    originalName: string;
    objectKey: string;
    bucket: string;
    mimeType: string;
    extension: string;
    size: bigint;
    provider?: string;
    isPublic?: boolean;
    ownerId: string;
  }) {
    return prisma.file.create({
      data: {
        originalName: data.originalName,
        objectKey: data.objectKey,
        bucket: data.bucket,
        mimeType: data.mimeType,
        extension: data.extension,
        size: data.size,
        provider: data.provider ?? "minio",
        isPublic: data.isPublic ?? false,
        ownerId: data.ownerId,
      },
    });
  },

  async findById(id: string) {
    return prisma.file.findUnique({
      where: {
        id,
      },
    });
  },

  async findByObjectKey(objectKey: string) {
    return prisma.file.findUnique({
      where: {
        objectKey,
      },
    });
  },

  async findAllByOwner(ownerId: string) {
    return prisma.file.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async delete(id: string) {
    return prisma.file.delete({
      where: {
        id,
      },
    });
  },
};