import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .email("Invalid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
});

export const updateProfileSchema =
  z.object({
    body: z.object({
      name: z
        .string()
        .min(
          2,
          "Name must be at least 2 characters"
        )
        .optional(),

      email: z
        .string()
        .email("Invalid email")
        .optional(),
    }),
  });