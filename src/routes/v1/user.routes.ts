import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { createUserSchema } from "../../validators/user.validator";
import { loginSchema } from "../../validators/auth.validator";
import {
  getUsers,
  createUser,
  loginUser,
} from "../../controllers/user.controller";

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  validate(createUserSchema),
  createUser
);

router.post(
  "/login",
  validate(loginSchema),
  loginUser
);

export default router;