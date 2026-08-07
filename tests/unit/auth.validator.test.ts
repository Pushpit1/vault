import {
  describe,
  expect,
  it,
} from "vitest";

import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  emailVerificationSchema,
} from "../../src/validators/auth.validator";

describe("Auth Validators", () => {
  it("should validate a valid login request", () => {
    const result = loginSchema.safeParse({
      body: {
        email: "user@test.com",
        password: "Password123",
      },
    });

    expect(result.success).toBe(true);
  });

  it("should reject an invalid login email", () => {
    const result = loginSchema.safeParse({
      body: {
        email: "invalid-email",
        password: "Password123",
      },
    });

    expect(result.success).toBe(false);
  });

  it("should validate forgot password request", () => {
    const result = forgotPasswordSchema.safeParse({
      body: {
        email: "user@test.com",
      },
    });

    expect(result.success).toBe(true);
  });

  it("should validate reset password request", () => {
    const result = resetPasswordSchema.safeParse({
      body: {
        token: "reset-token",
        newPassword: "Password123",
      },
    });

    expect(result.success).toBe(true);
  });

  it("should reject a short new password", () => {
    const result = resetPasswordSchema.safeParse({
      body: {
        token: "reset-token",
        newPassword: "123",
      },
    });

    expect(result.success).toBe(false);
  });

  it("should validate change password request", () => {
    const result = changePasswordSchema.safeParse({
      body: {
        currentPassword: "OldPassword123",
        newPassword: "NewPassword123",
      },
    });

    expect(result.success).toBe(true);
  });

  it("should validate email verification request", () => {
    const result = emailVerificationSchema.safeParse({
      body: {
        email: "user@test.com",
      },
    });

    expect(result.success).toBe(true);
  });
});