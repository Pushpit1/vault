import dotenv from "dotenv";
import { envSchema } from "./env.schema";

dotenv.config({
  path: process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env",
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;