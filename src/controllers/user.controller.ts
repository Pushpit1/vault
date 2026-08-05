import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { userService } from "../services/user.service";

export const getUsers = asyncHandler(
  async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  }
);

export const createUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await userService.login(email, password);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

export const getProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.sub;

    const user = await userService.getProfile(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

export const getAdminDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin!",
    });
  }
);