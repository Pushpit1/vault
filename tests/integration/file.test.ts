import request from "supertest";
import {
  beforeAll,
  afterAll,
  describe,
  expect,
  it,
} from "vitest";

import app from "../../src/app";
import { storageService } from "../../src/services/storage/storage.service";
import { createTestUser } from "../fixtures/user.factory";
import { cleanupUser } from "../helpers/db.helper";
import { registerUser } from "../helpers/user.helper";
import { loginUser } from "../helpers/auth.helper";

describe("File Operations Integration Tests", () => {
  const userA = createTestUser();
  const userB = createTestUser();

  let tokenA: string;
  let tokenB: string;
  let uploadedFileId: string;

  beforeAll(async () => {
    await cleanupUser(userA.email);
    await cleanupUser(userB.email);

    await storageService.initialize().catch(() => {});

    await registerUser(userA);
    const loginA = await loginUser(userA);
    tokenA = loginA.body.data.accessToken;

    await registerUser(userB);
    const loginB = await loginUser(userB);
    tokenB = loginB.body.data.accessToken;
  });

  afterAll(async () => {
    if (uploadedFileId) {
      await request(app)
        .delete(`/api/v1/files/${uploadedFileId}`)
        .set("Authorization", `Bearer ${tokenA}`);
    }
    await cleanupUser(userA.email);
    await cleanupUser(userB.email);
  });

  describe("POST /api/v1/files/upload", () => {
    it("should reject upload without authentication", async () => {
      const response = await request(app)
        .post("/api/v1/files/upload")
        .attach("file", Buffer.from("test content"), "test.txt");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should reject upload when no file is provided", async () => {
      const response = await request(app)
        .post("/api/v1/files/upload")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should successfully upload a valid file for authenticated user", async () => {
      const fileBuffer = Buffer.from("Hello Vault distributed storage!");

      const response = await request(app)
        .post("/api/v1/files/upload")
        .set("Authorization", `Bearer ${tokenA}`)
        .attach("file", fileBuffer, {
          filename: "sample-doc.txt",
          contentType: "text/plain",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.originalName).toBe("sample-doc.txt");
      expect(response.body.data.mimeType).toBe("text/plain");
      expect(response.body.data.size).toBe(fileBuffer.length.toString());

      uploadedFileId = response.body.data.id;
    });
  });

  describe("GET /api/v1/files", () => {
    it("should reject unauthenticated file listing", async () => {
      const response = await request(app).get("/api/v1/files");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should return uploaded files for owner", async () => {
      const response = await request(app)
        .get("/api/v1/files")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      const found = response.body.data.find(
        (f: { id: string }) => f.id === uploadedFileId
      );
      expect(found).toBeDefined();
      expect(found.originalName).toBe("sample-doc.txt");
    });

    it("enforces cross-user isolation: User B should not see User A's files", async () => {
      const response = await request(app)
        .get("/api/v1/files")
        .set("Authorization", `Bearer ${tokenB}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const found = response.body.data.find(
        (f: { id: string }) => f.id === uploadedFileId
      );
      expect(found).toBeUndefined();
    });
  });

  describe("GET /api/v1/files/:id/url (Presigned URL)", () => {
    it("should return a presigned URL for the file owner", async () => {
      const response = await request(app)
        .get(`/api/v1/files/${uploadedFileId}/url`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.url).toBeDefined();
      expect(response.body.data.expiresIn).toBe(900);
    });

    it("enforces object-level authorization: User B cannot access User A's file URL", async () => {
      const response = await request(app)
        .get(`/api/v1/files/${uploadedFileId}/url`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it("should return 404 for a non-existent file ID", async () => {
      const response = await request(app)
        .get("/api/v1/files/nonexistentfileid1234/url")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/files/:id/download", () => {
    it("should download the file content for the file owner", async () => {
      const response = await request(app)
        .get(`/api/v1/files/${uploadedFileId}/download`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("text/plain");
      expect(response.headers["content-disposition"]).toContain("sample-doc.txt");
      expect(response.text).toBe("Hello Vault distributed storage!");
    });

    it("enforces object-level authorization: User B cannot download User A's file", async () => {
      const response = await request(app)
        .get(`/api/v1/files/${uploadedFileId}/download`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it("should return 404 for downloading a non-existent file", async () => {
      const response = await request(app)
        .get("/api/v1/files/nonexistentfileid1234/download")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/v1/files/:id", () => {
    it("enforces object-level authorization: User B cannot delete User A's file", async () => {
      const response = await request(app)
        .delete(`/api/v1/files/${uploadedFileId}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it("should allow owner to delete their file", async () => {
      const response = await request(app)
        .delete(`/api/v1/files/${uploadedFileId}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe("File deleted successfully");
    });

    it("should return 404 when attempting to delete an already deleted file", async () => {
      const response = await request(app)
        .delete(`/api/v1/files/${uploadedFileId}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
