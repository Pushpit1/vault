# VAULT — Implementation Plan

**Created:** 2026-11-22  
**Branch:** `feature/vault-production-upgrade` (working on `main` pending Git permission fix)

---

## Priority Order

```
P0 — Critical security fixes (must ship before anything else)
P1 — Broken functionality (core features that don't work)
P2 — Architecture improvements (quality and maintainability)
P3 — Feature completions (incomplete workflows)
P4 — Testing (coverage for all fixed/new functionality)
P5 — Documentation (accurate README + API docs)
```

---

## P0 — Critical Security Fixes

### S1: Authenticate `GET /users` endpoint
**File:** `src/routes/v1/user.routes.ts`  
**Fix:** Add `authenticate` + `authorize("ADMIN")` middleware to `GET /users`

### S2: Fix `forgotPassword` — email token, don't return it
**Files:** `src/services/user.service.ts`, `src/queues/email.queue.ts`  
**Fix:** Queue email dispatch instead of returning raw token; remove `resetToken` from response

### S3: Protect Bull Board admin UI
**File:** `src/app.ts`  
**Fix:** Add `authenticate` + `authorize("ADMIN")` to `/admin/queues` route

### S4: Protect cache and queue management endpoints
**Files:** `src/routes/v1/cache/cache.routes.ts`, `src/routes/v1/queue/queue.routes.ts`  
**Fix:** Add `authenticate` + `authorize("ADMIN")` to all internal management routes

### S5: Apply rate limiting to auth endpoints
**File:** `src/routes/v1/user.routes.ts`  
**Fix:** Apply `authRateLimit` to login, register; `sensitiveActionRateLimit` to forgot/reset/change-password

### S6: Fix cookie `secure` flag
**File:** `src/controllers/user.controller.ts`  
**Fix:** Set `secure: env.NODE_ENV === "production"` on all cookie operations

### S7: Remove test-email route
**File:** `src/routes/v1/user.routes.ts`  
**Fix:** Remove `/test-email` and `/test` development routes entirely

---

## P1 — Broken Functionality Fixes

### B1: Implement email verification endpoint
**Files:** `src/routes/v1/user.routes.ts`, `src/controllers/user.controller.ts`, `src/services/user.service.ts`  
**Fix:** Add `GET /users/verify-email?token=<token>` endpoint that:
1. Looks up `EmailVerificationToken` by token value
2. Checks expiry
3. Sets `user.isVerified = true`
4. Deletes the token
5. Returns success response

### B2: Fix avatar upload — store in MinIO, not disk
**Files:** `src/controllers/user.controller.ts`, `src/services/user.service.ts`, `src/repositories/user.repository.ts`  
**Fix:** 
1. Upload avatar buffer to MinIO via `storageService.upload()`
2. Store the MinIO objectKey (or presigned URL) in `user.avatar`
3. If user has a previous avatar, delete old MinIO object

### B3: Queue password reset email in `forgotPassword`
**File:** `src/services/user.service.ts`  
**Fix:** After creating `PasswordResetToken`, enqueue email via BullMQ:
```ts
await emailQueue.add("password-reset-email", { email: user.email, token });
```
Return generic `{ message: "If your email exists, you will receive a reset link" }` (don't leak user existence)

### B4: Fix file not-found error handling
**File:** `src/services/file/file.service.ts`  
**Fix:** Replace `throw new Error("File not found")` with `throw new NotFoundError("File not found")`

### B5: Fix cache key for user-scoped data
**File:** `src/middlewares/cacheResponse.middleware.ts`, `src/middlewares/cache.middleware.ts`  
**Fix:** User-authenticated routes must scope cache keys by user ID (use `req.user?.sub`)

---

## P2 — Architecture Improvements

### A1: Consolidate duplicate cache middlewares
**Files:** `src/middlewares/cache.middleware.ts`, `src/middlewares/cacheResponse.middleware.ts`  
**Fix:** Remove `cacheResponse.middleware.ts`, use `cache.middleware.ts` for `GET /users` as well (the logger-based version is better). Update `user.routes.ts`.

### A2: Type-safe req.user in file controller
**File:** `src/controllers/file/file.controller.ts`  
**Fix:** Replace `(req as any).user.sub` with `req.user.sub` throughout (augmented types already set up)

### A3: Replace `console.log` with logger in workers and routes
**Files:** `src/workers/email.worker.ts`, `src/routes/v1/user.routes.ts`  
**Fix:** Import and use Winston logger; remove debug console.logs from route files

### A4: Add password-reset email job type to worker
**File:** `src/workers/email.worker.ts`  
**Fix:** Handle both `verification-email` and `password-reset-email` job names in worker

### A5: Add file type validation to upload middleware
**File:** `src/middlewares/upload.middleware.ts`  
**Fix:** Add `fileFilter` to multer config to restrict MIME types (images, PDFs, documents, etc.)

### A6: Improve `forgotPassword` to not reveal user existence
**File:** `src/services/user.service.ts`  
**Fix:** Change to return generic success even when user email not found (security best practice)

### A7: Add missing CI workflow
**File:** `.github/workflows/ci.yml`  
**Fix:** Create CI workflow that runs: `npm install`, `npx tsc --noEmit`, `npm test`

---

## P3 — Feature Completions

### F1: Implement actual admin dashboard
**File:** `src/controllers/user.controller.ts`, `src/services/user.service.ts`  
**Fix:** Admin dashboard returns real stats: total users, verified users, total files, total storage used

### F2: Implement public file serving
**Files:** `src/services/file/file.service.ts`, `src/routes/v1/file/file.routes.ts`  
**Fix:** Add endpoint to toggle `File.isPublic`, add unauthenticated public download route

### F3: Improve password validation
**File:** `src/validators/auth.validator.ts`, `src/validators/user.validator.ts`  
**Fix:** Add password strength requirements (uppercase, number, special char) with Zod `.regex()`

### F4: Add file search/filter to list endpoint
**File:** `src/services/file/file.service.ts`, `src/controllers/file/file.controller.ts`  
**Fix:** Support filtering by mimeType, date range, name search with pagination

### F5: Improve `.env.example`
**File:** `.env.example`  
**Fix:** Document all required environment variables with comments

---

## P4 — Tests

### T1: File operation tests
**File:** `tests/integration/file.test.ts`  
**Tests:** Upload, list, download, delete, presigned URL, ownership enforcement

### T2: Email verification flow test
**File:** `tests/integration/email-verification.test.ts` (extend existing)  
**Tests:** Verify token verification endpoint works end-to-end

### T3: Security boundary tests
**File:** `tests/integration/security.test.ts`  
**Tests:** Verify unauthenticated access to protected routes returns 401/403

---

## P5 — Documentation

### D1: Complete README.md
**Fix:** Full setup guide, all env variables, local dev, Docker, API endpoints, security notes

### D2: Update `.env.example`  
**Fix:** All variables documented

### D3: Swagger/OpenAPI completeness
**Fix:** Ensure all endpoints have proper JSDoc annotations for Swagger

---

## Implementation Order

1. P0: S7 (remove test routes) → S1 (auth GET /users) → S2 (fix forgotPassword) → S3-S4 (protect admin/cache/queue) → S5 (rate limits) → S6 (cookies)
2. P1: B4 (error types) → B1 (verify-email endpoint) → B3 (queue password reset email) → B2 (avatar→MinIO) → B5 (cache keys)
3. P2: A4 (worker handles both email types) → A1 (consolidate cache) → A2 (type safety) → A3 (logger) → A5 (file type filter) → A6 (forgotPassword privacy) → A7 (CI workflow)
4. P3: F1 (admin dashboard) → F5 (env.example)
5. P4: T1, T2, T3
6. P5: D1 (README), D2 (env.example)
