import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { userService } from "../services/user.service";

type GetUsersQuery = {
  page?: string;
  limit?: string;
  role?: string;
  isVerified?: string;
  search?: string;
};

export const getUsers = asyncHandler(
  async (
    req: Request<
      {},
      {},
      {},
      GetUsersQuery
    >,
    res: Response
  ) => {
   const users =
  await userService.getAllUsers(
    req.query.page
      ? Number(req.query.page)
      : undefined,

    req.query.limit
      ? Number(req.query.limit)
      : undefined,

    req.query.role,

    req.query.isVerified,

    req.query.search
  );

    res.status(200).json({
      success: true,
      data: users.data,
      meta: users.meta,
    });
  }
);

export const createUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.createUser(
      req.body
    );

    res.status(201).json({
      success: true,
      data: user,
    });
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result =
      await userService.login(
        email,
        password
      );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge:
          7 * 24 * 60 * 60 * 1000,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        accessToken:
          result.accessToken,
        user: result.user,
      },
    });
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token =
      req.cookies.refreshToken;

    const result =
      await userService.refreshAccessToken(
        token
      );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge:
          7 * 24 * 60 * 60 * 1000,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        accessToken:
          result.accessToken,
      },
    });
  }
);

export const logoutUser = asyncHandler(
  async (req: Request, res: Response) => {
    const token =
      req.cookies.refreshToken;

    const result =
      await userService.logout(
        token
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

export const changePassword =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      const result =
        await userService.changePassword(
          req.user.sub!,
          currentPassword,
          newPassword
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  export const forgotPassword =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const { email } =
        req.body;

      const result =
        await userService.forgotPassword(
          email
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  export const generateEmailVerification =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const { email } =
        req.body;

      const result =
        await userService.generateEmailVerification(
          email
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

export const resetPassword =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const {
        token,
        newPassword,
      } = req.body;

      const result =
        await userService.resetPassword(
          token,
          newPassword
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
        req.user.sub!
      );

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

export const updateProfile =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const {
        name,
        email,
      } = req.body;

      const user =
        await userService.updateProfile(
          req.user.sub!,
          name,
          email
        );

      res.status(200).json({
        success: true,
        data: user,
      });
    }
  );

  export const updateAvatar =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Avatar is required",
        });

        return;
      }

      const user =
        await userService.updateAvatar(
          req.user.sub!,
          req.file.filename
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
      message:
        "Welcome Admin!",
    });
  }
);