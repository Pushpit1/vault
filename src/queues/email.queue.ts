import { Queue } from "bullmq";
import { connection } from "../config/bullmq";

export interface VerificationEmailJob {
  email: string;
  token: string;
}

export const emailQueue = new Queue<VerificationEmailJob>(
  "email",
  {
    connection,
    defaultJobOptions: {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 2000,
      },

      removeOnComplete: 100,

      removeOnFail: 50,
    },
  }
);