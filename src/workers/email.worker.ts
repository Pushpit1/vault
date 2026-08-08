import { Worker } from "bullmq";
import { connection } from "../config/bullmq";
import { emailService } from "../services/email.service";
import { emailQueue } from "../queues/email.queue";
const emailWorker = new Worker(
  "email",

  async (job) => {
    console.log("📧 Sending verification email...");

    await emailService.sendVerificationEmail(
      job.data.email,
      job.data.token
    );

    console.log("✅ Email sent");
  },

  {
    connection,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`);

  console.error(err.message);
});

export default emailWorker;