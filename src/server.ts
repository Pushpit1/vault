import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "./routes/v1";
import { env } from "./config/env";

import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1", routes);

app.use(notFound);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(
    `🚀 Vault Server running on http://localhost:${env.PORT}`
  );
});