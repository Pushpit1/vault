import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    success: true,
    data: users,
  });
});