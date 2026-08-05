import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../common/apiResponse";
import { APP_STATUS } from "../constants/app.constants";

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json(
    successResponse("Vault service is healthy", {
      status: APP_STATUS.UP,
    })
  );
});