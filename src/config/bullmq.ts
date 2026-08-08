import { Queue, Worker } from "bullmq";
import { env } from "./env";

export const connection = {
  url: env.REDIS_URL,
};

export { Queue, Worker };