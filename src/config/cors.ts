import cors from "cors";
import { env } from "./env";

export const corsMiddleware = cors({
  origin: env.APP_URL,
  credentials: true,
});
