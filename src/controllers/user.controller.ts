import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { userService } from "../services/user.service";
import {
  successResponse,
  paginatedResponse,
} from "../utils/response";
import { cacheService } from "../services/cache/cache.service";
type GetUsersQuery = {
  page?: string;
  limit?: string;
  role?: string;
  isVerified?: string;
  search?: string;
  sort?: string;
  order?: string;
};

export const getUsers = asyncHandler(
  async (
    req: Request<{}, {}, {}, GetUsersQuery>,
    res: Response
  ) => {
    console.log("🚀 getUsers controller called");

    const users = await userService.getAllUsers(
      req.query.page
        ? Number(req.query.page)
        : undefined,

      req.query.limit
        ? Number(req.query.limit)
        : undefined,

      req.query.role,
      req.query.isVerified,
      req.query.search,
      req.query.sort,
      req.query.order
    );

    paginatedResponse(
      res,
      users.data,
      users.meta
    );
  }
);
export const createUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.createUser(
      req.body
    );

    successResponse(
  res,
  user,
  201
);
await cacheService.delByPattern("users:*");
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

    successResponse(res, {
      accessToken: result.accessToken,
      user: result.user,
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
successResponse(res, {
  accessToken: result.accessToken,
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
 successResponse(
  res,
  result
);
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

      successResponse(
  res,
  result
);
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

      successResponse(
  res,
  result
);
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

      successResponse(
  res,
  result
);
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

    successResponse(
  res,
  result
);
    }
  );

export const getProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user =
      await userService.getProfile(
        req.user.sub!
      );

  successResponse(
  res,
  user
);
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
         successResponse(
  res,
  user
);
await cacheService.delByPattern("users:*");

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

    successResponse(
  res,
  user
);
    }
  );
export const getAdminDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
   successResponse(res, {
      message: "Welcome Admin!",
    });
  }
);