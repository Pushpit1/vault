import { Router } from "express";

import { authenticate } from "../../../middlewares/auth.middleware";
import { upload } from "../../../middlewares/upload.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { fileIdParamSchema } from "../../../validators/file.validator";

import {
  uploadFile,
  downloadFile,
  deleteFile,
  listFiles,
  getPresignedUrl,
} from "../../../controllers/file/file.controller";

const router = Router();

router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  uploadFile
);

router.get(
  "/",
  authenticate,
  listFiles
);

router.get(
  "/:id/download",
  authenticate,
  validate(fileIdParamSchema),
  downloadFile
);

router.get(
  "/:id/url",
  authenticate,
  validate(fileIdParamSchema),
  getPresignedUrl
);

router.delete(
  "/:id",
  authenticate,
  validate(fileIdParamSchema),
  deleteFile
);

export default router;