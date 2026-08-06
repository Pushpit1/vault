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

    const result = await userService.login(
      email,
      password
    );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies.refreshToken;

    const result =
      await userService.refreshAccessToken(
        refreshToken
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

export const logoutUser = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies.refreshToken;

    const result =
      await userService.logout(
        refreshToken
      );

    res.clearCookie(
      "refreshToken",
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      }
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

export const getProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user =
      await userService.getProfile(
        req.user.sub
      );

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