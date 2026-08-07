import {
  describe,
  expect,
  it,
} from "vitest";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../src/utils/jwt/token";

describe("JWT Utilities", () => {
  it("should generate an access token", () => {
    const token = generateAccessToken(
      "user123",
      "user@test.com",
      "USER" as any
    );

    expect(token).toBeTypeOf("string");
    expect(token.length).toBeGreaterThan(50);
  });

  it("should generate a refresh token", () => {
    const token = generateRefreshToken("user123");

    expect(token).toBeTypeOf("string");
    expect(token.length).toBeGreaterThan(50);
  });

  it("should verify a refresh token", () => {
    const token = generateRefreshToken("user123");

    const payload = verifyRefreshToken(token);

    expect(payload.sub).toBe("user123");
  });

  it("should throw for an invalid token", () => {
    expect(() =>
      verifyRefreshToken("invalid.token")
    ).toThrow();
  });
});