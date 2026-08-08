import { Router } from "express";

import { authenticate } from "../../../middlewares/auth.middleware";
import { upload } from "../../../middlewares/upload.middleware";

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
  downloadFile
);

router.get(
  "/:id/url",
  authenticate,
  getPresignedUrl
);

router.delete(
  "/:id",
  authenticate,
  deleteFile
);

export default router;