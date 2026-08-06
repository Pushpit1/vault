import prisma from "../db/prisma";

export const emailVerificationTokenRepository = {
  async create(
    token: string,
    userId: string,
    expiresAt: Date
  ) {
    return prisma.emailVerificationToken.create({
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
    return prisma.emailVerificationToken.findUnique({
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
    return prisma.emailVerificationToken.delete({
      where: {
        token,
      },
    });
  },

  async deleteAllByUser(
    userId: string
  ) {
    return prisma.emailVerificationToken.deleteMany({
      where: {
        userId,
      },
    });
  },
};