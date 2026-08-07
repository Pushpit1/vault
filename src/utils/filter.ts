import { Prisma } from "../generated/prisma/client";
import { Role } from "../generated/prisma/enums";

export interface UserFilterOptions {
  role?: string;
  isVerified?: string;
  search?: string;
}

export function buildUserFilter(
  options: UserFilterOptions
): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  if (
    options.role &&
    Object.values(Role).includes(
      options.role as Role
    )
  ) {
    where.role = options.role as Role;
  }

  if (
    options.isVerified !== undefined
  ) {
    where.isVerified =
      options.isVerified === "true";
  }

  if (options.search) {
    where.OR = [
      {
        name: {
          contains: options.search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: options.search,
          mode: "insensitive",
        },
      },
    ];
  }

  return where;
}