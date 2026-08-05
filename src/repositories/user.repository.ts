import prisma from "../db/prisma";

export const userRepository = {
  async findAll() {
    return prisma.user.findMany();
  },
};