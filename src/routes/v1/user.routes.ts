import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { createUserSchema } from "../../validators/user.validator";
import {
  getUsers,
  createUser,
} from "../../controllers/user.controller";


const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  validate(createUserSchema),
  createUser
);

export default router;