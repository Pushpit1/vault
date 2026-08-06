import { prisma } from "../config/prisma";

export const refreshTokenRepository = {
  async create(
    token: string,
    userId: string,
    expiresAt: Date
  ) {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  },

  async findByToken(
    token: string
  ) {
    return prisma.refreshToken.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
  },

  async delete(
    token: string
  ) {
    return prisma.refreshToken.delete({
      where: {
        token,
      },
    });
  },

  async deleteAllByUser(
    userId: string
  ) {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  },

  async exists(
    token: string
  ) {
    const refreshToken =
      await prisma.refreshToken.findUnique({
        where: {
          token,
        },
      });

    return !!refreshToken;
  }
};