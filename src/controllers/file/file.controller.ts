import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/response";

import { fileService } from "../../services/file/file.service";

export const uploadFile = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    if (!req.file) {
      throw new Error(
        "No file uploaded"
      );
    }

    const ownerId =
      (req as any).user.sub;

    const file =
      await fileService.upload(
        req.file,
        ownerId
      );

    successResponse(
      res,
      {
        ...file,
        size:
          file.size.toString(),
      },
      201
    );
  }
);

export const downloadFile =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const id =
        req.params.id as string;

      const result =
        await fileService.download(id, (req as any).user.sub);

      res.setHeader(
        "Content-Type",
        result.file.mimeType
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${result.file.originalName}"`
      );

      result.stream.pipe(res);
    }
  );

export const deleteFile =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const id =
        req.params.id as string;

      const result =
        await fileService.delete(id, (req as any).user.sub);

      successResponse(
        res,
        result
      );
    }
  );

export const listFiles =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const ownerId =
        (req as any).user.sub;

      const files =
        await fileService.list(
          ownerId
        );

      const response =
        files.map(
          (file) => ({
            ...file,
            size:
              file.size.toString(),
          })
        );

      successResponse(
        res,
        response
      );
    }
  );

export const getPresignedUrl =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const id =
        req.params.id as string;

      const ownerId =
        (req as any).user.sub;

      const result =
        await fileService.getPresignedUrl(
          id,
          ownerId
        );

      successResponse(
        res,
        result
      );
    }
  );

