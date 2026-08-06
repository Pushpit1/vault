import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required"),
  }),
});

export const changePasswordSchema =
  z.object({
    body: z.object({
      currentPassword: z
        .string()
        .min(
          8,
          "Current password must be at least 8 characters"
        ),

      newPassword: z
        .string()
        .min(
          8,
          "New password must be at least 8 characters"
        ),
    }),
  });

export const forgotPasswordSchema =
  z.object({
    body: z.object({
      email: z
        .string()
        .email("Invalid email"),
    }),
  });

export const resetPasswordSchema =
  z.object({
    body: z.object({
      token: z
        .string()
        .min(1, "Token is required"),

      newPassword: z
        .string()
        .min(
          8,
          "New password must be at least 8 characters"
        ),
    }),
  });

  export const emailVerificationSchema =
  z.object({
    body: z.object({
      email: z
        .string()
        .email("Invalid email"),
    }),
  });