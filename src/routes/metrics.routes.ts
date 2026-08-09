import { Router } from "express";
import { register } from "../config/metrics";

const router = Router();

router.get("/", async (_req, res) => {
  res.setHeader(
    "Content-Type",
    register.contentType
  );

  res.end(await register.metrics());
});

export default router;