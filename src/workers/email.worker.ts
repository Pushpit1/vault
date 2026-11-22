import { Worker } from "bullmq";
import { connection } from "../config/bullmq";
import { emailService } from "../services/email.service";
import { logger } from "../utils/logger/logger";
import { EmailJob } from "../queues/email.queue";

const emailWorker = new Worker<EmailJob>(
  "email",

  async (job) => {
    const { type, email, token } = job.data;

    if (type === "verification-email") {
      logger.info("Sending verification email", { jobId: job.id, email });
      await emailService.sendVerificationEmail(email, token);
      logger.info("Verification email sent", { jobId: job.id, email });
    } else if (type === "password-reset-email") {
      logger.info("Sending password reset email", { jobId: job.id, email });
      await emailService.sendPasswordResetEmail(email, token);
      logger.info("Password reset email sent", { jobId: job.id, email });
    } else {
      logger.warn("Unknown email job type", { jobId: job.id, type });
    }
  },

  {
    connection,
  }
);

emailWorker.on("completed", (job) => {
  logger.info(`Email job completed`, { jobId: job.id });
});

emailWorker.on("failed", (job, err) => {
  logger.error(`Email job failed`, {
    jobId: job?.id,
    error: err.message,
  });
});

export default emailWorker;
