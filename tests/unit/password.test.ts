import {
  describe,
  expect,
  it,
} from "vitest";

import {
  hashPassword,
  comparePassword,
} from "../../src/utils/auth/password";

describe("Password Utilities", () => {
  it("should hash a password", async () => {
    const password = "Password@123";

    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(hashed.length).toBeGreaterThan(20);
  });

  it("should compare the correct password", async () => {
    const password = "Password@123";

    const hashed = await hashPassword(password);

    const result = await comparePassword(
      password,
      hashed
    );

    expect(result).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "Password@123";

    const hashed = await hashPassword(password);

    const result = await comparePassword(
      "WrongPassword",
      hashed
    );

    expect(result).toBe(false);
  });
});