import { z } from "zod";

export const fileIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "File ID is required"),
  }),
});
