import { Prisma } from "../generated/prisma";

export interface SortOptions {
  sort?: string;
  order?: string;
}

const allowedFields = [
  "name",
  "email",
  "role",
  "createdAt",
  "updatedAt",
] as const;

type SortField =
  (typeof allowedFields)[number];

export function buildUserSorting(
  options: SortOptions
): Prisma.UserOrderByWithRelationInput {
  const field = allowedFields.includes(
    options.sort as SortField
  )
    ? (options.sort as SortField)
    : "createdAt";

  const direction =
    options.order === "asc"
      ? "asc"
      : "desc";

  return {
    [field]: direction,
  };
}