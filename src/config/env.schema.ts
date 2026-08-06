import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(5000),

  NODE_ENV: z.enum([
    "development",
    "production",
    "test",
  ]),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),

  DATABASE_URL: z.url("Invalid DATABASE_URL"),
});