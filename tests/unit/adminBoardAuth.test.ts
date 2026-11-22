import { describe, expect, it, vi } from "vitest";
import { adminBoardAuth } from "../../src/middlewares/adminBoardAuth.middleware";
import { generateAccessToken } from "../../src/utils/jwt/token";
import { userRepository } from "../../src/repositories/user.repository";
import * as passwordUtils from "../../src/utils/auth/password";

describe("AdminBoardAuth Middleware", () => {
  it("should allow access with valid ADMIN Bearer token", async () => {
    const adminToken = generateAccessToken("admin-1", "admin@test.com", "ADMIN" as any);

    const req: any = {
      headers: { authorization: `Bearer ${adminToken}` },
      cookies: {},
      query: {},
    };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
      send: vi.fn(),
    };
    const next = vi.fn();

    await adminBoardAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.sub).toBe("admin-1");
    expect(req.user.role).toBe("ADMIN");
  });

  it("should reject access (403) with valid USER (non-admin) Bearer token", async () => {
    const userToken = generateAccessToken("user-1", "user@test.com", "USER" as any);

    const req: any = {
      headers: { authorization: `Bearer ${userToken}` },
      cookies: {},
      query: {},
    };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
      send: vi.fn(),
    };
    const next = vi.fn();

    await adminBoardAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should allow access with valid ADMIN token via query param and set cookie", async () => {
    const adminToken = generateAccessToken("admin-2", "admin2@test.com", "ADMIN" as any);

    const req: any = {
      headers: {},
      cookies: {},
      query: { token: adminToken },
    };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
      send: vi.fn(),
      cookie: vi.fn(),
    };
    const next = vi.fn();

    await adminBoardAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith("accessToken", adminToken, expect.any(Object));
  });

  it("should allow access with valid Basic Auth credentials for ADMIN", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValueOnce({
      id: "admin-3",
      email: "admin3@test.com",
      password: "hashedPassword",
      role: "ADMIN",
    } as any);

    vi.spyOn(passwordUtils, "comparePassword").mockResolvedValueOnce(true);

    const credentials = Buffer.from("admin3@test.com:Secret123").toString("base64");

    const req: any = {
      headers: { authorization: `Basic ${credentials}` },
      cookies: {},
      query: {},
    };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
      send: vi.fn(),
    };
    const next = vi.fn();

    await adminBoardAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.email).toBe("admin3@test.com");
    expect(req.user.role).toBe("ADMIN");
  });

  it("should send WWW-Authenticate Basic header when unauthenticated", async () => {
    const req: any = {
      headers: {},
      cookies: {},
      query: {},
    };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
      send: vi.fn(),
    };
    const next = vi.fn();

    await adminBoardAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith("WWW-Authenticate", expect.stringContaining("Basic"));
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
