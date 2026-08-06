import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(
  process.cwd(),
  "uploads"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage =
  multer.diskStorage({
    destination: (
      _req,
      _file,
      cb
    ) => {
      cb(null, uploadDir);
    },

    filename: (
      _req,
      file,
      cb
    ) => {
      const uniqueName =
        Date.now() +
        "-" +
        Math.round(
          Math.random() * 1e9
        );

      cb(
        null,
        uniqueName +
          path.extname(
            file.originalname
          )
      );
    },
  });

const fileFilter: multer.Options["fileFilter"] =
  (
    _req,
    file,
    cb
  ) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed."
        )
      );
    }
  };

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize:
      2 * 1024 * 1024,
  },
});