import { Resend } from "resend";

import { verificationEmail } from "../templates/verificationEmail";
import { passwordResetEmail } from "../templates/passwordResetEmail";
import { logger } from "../utils/logger/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
  async sendVerificationEmail(
    email: string,
    token: string
  ) {
    const link =
      `${process.env.APP_URL}/api/v1/users/verify-email?token=${token}`;

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Verify your Vault Account",
      html: verificationEmail(link),
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    logger.info("Verification email sent", {
      email,
      id: response.data?.id,
    });

    return response;
  },

  async sendPasswordResetEmail(
    email: string,
    token: string
  ) {
    const link =
      `${process.env.APP_URL}/reset-password?token=${token}`;

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Reset Your Vault Password",
      html: passwordResetEmail(link),
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    logger.info("Password reset email sent", {
      email,
      id: response.data?.id,
    });

    return response;
  },
};