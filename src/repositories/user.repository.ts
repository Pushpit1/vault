import prisma from "../db/prisma";
import { Prisma, User } from "../generated/prisma";

export const userRepository = {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async findByEmail(
    email: string
  ): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  async create(
    data: Prisma.UserCreateInput
  ) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  },

  async updatePassword(
    userId: string,
    password: string
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });
  },
};