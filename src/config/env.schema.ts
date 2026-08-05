import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum([
    "development",
    "production",
    "test",
  ]),
});