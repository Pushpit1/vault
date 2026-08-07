import { Response } from "express";

export function successResponse<T>(
  res: Response,
  data: T,
  status = 200
): void {
  res.status(status).json({
    success: true,
    data,
  });
}

export function paginatedResponse<T>(
  res: Response,
  data: T,
  meta: unknown
): void {
  res.status(200).json({
    success: true,
    data,
    meta,
  });
}

export function messageResponse(
  res: Response,
  message: string,
  status = 200
): void {
  res.status(status).json({
    success: true,
    data: {
      message,
    },
  });
}