import { Prisma, User } from "../generated/prisma";
import prisma from "../db/prisma";

export const userRepository = {
  async findAll() {
    return prisma.user.findMany();
  },

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  },
  
  async findByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
},

};