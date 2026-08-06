import { Resend } from "resend";

import { verificationEmail } from "../templates/verificationEmail";
import { passwordResetEmail } from "../templates/passwordResetEmail";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export const emailService = {
  async sendVerificationEmail(
    email: string,
    token: string
  ) {
    const link =
      `${process.env.APP_URL}/api/v1/users/verify-email?token=${token}`;

    const response =
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Verify your Vault Account",
    html: verificationEmail(link),
  });

console.log(response);
  },

  async sendPasswordResetEmail(
    email: string,
    token: string
  ) {
    const link =
      `${process.env.APP_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Reset Your Vault Password",
      html: passwordResetEmail(link),
    });
  },
};