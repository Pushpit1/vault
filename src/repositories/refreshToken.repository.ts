import { prisma } from "../config/prisma";
import { hashRefreshToken } from "../utils/jwt/refresh-token-hash";

export const refreshTokenRepository = {
  async create(
    token: string,
    userId: string,
    expiresAt: Date
  ) {
    return prisma.refreshToken.create({
      data: {
        token: hashRefreshToken(token),
        userId,
        expiresAt,
      },
    });
  },

  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: {
        token: hashRefreshToken(token),
      },
      include: {
        user: true,
      },
    });
  },

  async delete(token: string) {
    return prisma.refreshToken.delete({
      where: {
        token: hashRefreshToken(token),
      },
    });
  },

  async deleteAllByUser(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  },

  async exists(token: string) {
    const refreshToken =
      await prisma.refreshToken.findUnique({
        where: {
          token: hashRefreshToken(token),
        },
      });

    return !!refreshToken;
  },
};
