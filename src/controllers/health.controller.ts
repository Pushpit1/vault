import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../common/apiResponse";
import { APP_STATUS } from "../constants/app.constants";
import { healthService } from "../services/health.service";

export const getHealth = asyncHandler(
  async (_req: Request, res: Response) => {
    res.status(200).json(
      successResponse(
        "Vault service is healthy",
        {
          status: APP_STATUS.UP,
        }
      )
    );
  }
);

export const getLiveness = asyncHandler(
  async (_req: Request, res: Response) => {
    res.status(200).json(
      successResponse(
        "Vault process is alive",
        {
          status: APP_STATUS.UP,
        }
      )
    );
  }
);

export const getReadiness = asyncHandler(
  async (_req: Request, res: Response) => {
    const result =
      await healthService.checkReadiness();

    const statusCode =
      result.ready ? 200 : 503;

    res.status(statusCode).json(
      successResponse(
        result.ready
          ? "Vault service is ready"
          : "Vault service is not ready",
        {
          status: result.ready
            ? APP_STATUS.UP
            : "DOWN",
          checks: result.checks,
        }
      )
    );
  }
);