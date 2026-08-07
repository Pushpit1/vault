import prisma from "../db/prisma";
import { Prisma, User } from "../generated/prisma";

export const userRepository = {
  async findAll(
  skip: number,
  take: number,
  where: Prisma.UserWhereInput,
  orderBy: Prisma.UserOrderByWithRelationInput
) {
    const [users, total] =
      await prisma.$transaction([
       prisma.user.findMany({
  skip,
  take,
  where,
  orderBy,
  select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isVerified: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
          },
        }),

        prisma.user.count({
          where,
        }),
      ]);

    return {
      users,
      total,
    };
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
        role: true,
        isVerified: true,
        avatar: true,
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

  async findPublicById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
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

  async updateProfile(
    id: string,
    data: {
      name?: string;
      email?: string;
      isVerified?: boolean;
    }
  ) {
    return prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async updateAvatar(
    userId: string,
    avatar: string
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
};