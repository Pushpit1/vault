import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../common/apiResponse";

export const getHealth = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(
    successResponse("Vault service is healthy", {
      status: "UP",
    })
  );
});