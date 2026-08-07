export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  skip: number;
}

export function getPagination(
  options: PaginationOptions
): PaginationMeta {
  const page = Math.max(
    1,
    Number(options.page) || 1
  );

  const limit = Math.min(
    100,
    Math.max(
      1,
      Number(options.limit) || 10
    )
  );

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
}