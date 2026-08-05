import { z } from "zod";

export const healthQuerySchema = z.object({
  ping: z.string().optional(),
});