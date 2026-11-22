import { Queue } from "bullmq";
import { connection } from "../config/bullmq";

export interface VerificationEmailJob {
  type: "verification-email";
  email: string;
  token: string;
}

export interface PasswordResetEmailJob {
  type: "password-reset-email";
  email: string;
  token: string;
}

export type EmailJob = VerificationEmailJob | PasswordResetEmailJob;

export const emailQueue = new Queue<EmailJob>(
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
