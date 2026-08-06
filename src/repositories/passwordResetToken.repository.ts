import prisma from "../db/prisma";

export const passwordResetTokenRepository = {
  async create(
    token: string,
    userId: string,
    expiresAt: Date
  ) {
    return prisma.passwordResetToken.create({
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
    return prisma.passwordResetToken.findUnique({
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
    return prisma.passwordResetToken.delete({
      where: {
        token,
      },
    });
  },

  async deleteAllByUser(
    userId: string
  ) {
    return prisma.passwordResetToken.deleteMany({
      where: {
        userId,
      },
    });
  },
};