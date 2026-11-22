# VAULT — Repository Audit Report

**Audit Date:** 2026-11-22  
**Auditor:** Autonomous Engineering System  
**Branch:** main (commit: 45c8774)

---

## 1. What Vault Is

**Vault** is a **production-grade distributed object storage platform** — a self-hosted, secure backend service for uploading, managing, and retrieving files. It is a backend-only API (no frontend UI) built with Node.js / TypeScript / Express, using:

- **PostgreSQL** (via Prisma ORM) for persistent metadata
- **MinIO** (S3-compatible) for binary file storage  
- **Redis** for caching and job queuing
- **BullMQ** for background email dispatch
- **Resend** for transactional email
- **Prometheus + Grafana** for observability
- **Docker Compose** for local/production containerization
- **GitHub Actions** + **GCP VM** for CI/CD

### Intended Users
Developers who need a self-hosted file storage API with authentication, user management, and presigned URL generation — similar in concept to a simplified AWS S3 + IAM combo.

---

## 2. Architecture

```
Internet → Vault API (Express, port 5000)
              ├── PostgreSQL (Prisma) → user/file/token metadata
              ├── Redis (ioredis) → caching + rate-limiting + BullMQ queues
              ├── MinIO → binary object storage
              └── BullMQ Worker → async email dispatch via Resend
```

### Source Tree
```
src/
├── app.ts                    # Express app setup
├── server.ts                 # HTTP server bootstrap
├── worker.ts                 # BullMQ worker process entry point
├── config/                   # env, redis, minio, prisma, cors, swagger, bullmq, metrics, bull-board
├── constants/                # App-wide constants
├── controllers/              # Request handlers (user, file, cache, queue, health)
├── db/                       # Prisma singleton
├── docs/                     # Swagger JSDoc YAML fragments
├── errors/                   # AppError hierarchy
├── generated/prisma/         # Prisma generated client (gitignored)
├── middlewares/              # auth, authorize, cache, cacheResponse, error, logger, metrics,
│                             # notFound, rateLimit, requestId, upload, validate
├── queues/                   # email.queue (BullMQ)
├── repositories/             # DB access (user, file, refreshToken, passwordResetToken, emailVerificationToken)
├── routes/v1/                # Express routers (health, users, files, cache, queue)
├── scripts/                  # Manual test scripts
├── services/                 # Business logic (user, email, file, storage, cache, health)
│   └── storage/providers/    # MinioProvider (implements StorageProvider interface)
├── templates/                # HTML email templates
├── types/                    # Express augmentation (req.user, req.requestId)
├── utils/                    # asyncHandler, filter, pagination, response, shutdown, sorting
│   ├── auth/                 # password hashing, reset token generation
│   ├── jwt/                  # token generation/verification
│   └── logger/               # Winston logger
├── validators/               # Zod schemas (auth, user, health, logout, refresh)
└── workers/                  # email.worker.ts (BullMQ processor)
```

---

## 3. Data Models

| Model | Key Fields |
|---|---|
| `User` | id, email, password (hashed), name, role (USER/ADMIN), isVerified, avatar |
| `File` | id, originalName, objectKey, bucket, mimeType, extension, size (BigInt), provider, isPublic, ownerId |
| `RefreshToken` | id, token, userId, expiresAt |
| `PasswordResetToken` | id, token, userId, expiresAt |
| `EmailVerificationToken` | id, token, userId, expiresAt |

---

## 4. API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/health/ready` | None | Readiness probe (DB, Redis, MinIO) |
| GET | `/api/v1/users/` | None | List users (paginated, filtered, sorted) |
| POST | `/api/v1/users/` | None | Register new user |
| POST | `/api/v1/users/login` | None | Login → access + refresh token |
| POST | `/api/v1/users/refresh` | Cookie | Rotate refresh token |
| POST | `/api/v1/users/logout` | Cookie | Invalidate refresh token |
| POST | `/api/v1/users/forgot-password` | None | Generate password reset token |
| POST | `/api/v1/users/reset-password` | None | Reset password with token |
| POST | `/api/v1/users/verify-email` | None | Request email verification |
| POST | `/api/v1/users/change-password` | Bearer | Change own password |
| GET | `/api/v1/users/me` | Bearer | Get own profile |
| PATCH | `/api/v1/users/me` | Bearer | Update profile (name/email) |
| PATCH | `/api/v1/users/me/avatar` | Bearer | Upload avatar (multer to disk) |
| GET | `/api/v1/users/admin` | Bearer+ADMIN | Admin dashboard stub |
| POST | `/api/v1/files/upload` | Bearer | Upload file to MinIO |
| GET | `/api/v1/files/` | Bearer | List own files |
| GET | `/api/v1/files/:id/download` | Bearer | Stream file download |
| GET | `/api/v1/files/:id/url` | Bearer | Get presigned URL (15 min) |
| DELETE | `/api/v1/files/:id` | Bearer | Delete file |
| GET | `/api/v1/cache/` | None | List cache keys |
| DELETE | `/api/v1/cache/:key` | None | Evict a cache key |
| GET | `/api/v1/queue/` | None | Queue stats |
| GET | `/api/v1/queue/health` | None | Queue health |
| GET | `/metrics` | None | Prometheus metrics |
| GET/ANY | `/admin/queues` | None | Bull Board UI |
| GET | `/docs` | None | Swagger UI |

---

## 5. Existing Features — Assessment

| Feature | Status | Notes |
|---|---|---|
| User registration | ✅ Working | Password hashing, email duplicate check |
| Login + JWT | ✅ Working | Access (15m) + Refresh (7d) tokens, rotation |
| Token refresh | ✅ Working | Rotate-on-use pattern |
| Logout | ✅ Working | Token invalidation in DB |
| Change password | ✅ Working | Invalidates all refresh tokens |
| Forgot password | ⚠️ Partial | Returns raw token in response (should email it) |
| Reset password | ✅ Working | Token expiry, hashing, cleanup |
| Email verification | ⚠️ Partial | Only sends email, no verification endpoint |
| Profile CRUD | ✅ Working | With cache invalidation |
| Avatar upload | ⚠️ Bug | Saves local filename, not MinIO URL |
| File upload to MinIO | ✅ Working | With owner enforcement |
| File list | ✅ Working | Owner-scoped |
| File download (stream) | ✅ Working | |
| Presigned URL | ✅ Working | 15-min expiry |
| File delete | ✅ Working | MinIO + DB cleanup |
| Rate limiting | ✅ Working | Redis-backed, skipped in test mode |
| Redis caching | ✅ Working | With TTL and invalidation |
| Prometheus metrics | ✅ Working | Request count, latency histograms |
| BullMQ email worker | ✅ Working | Separated worker process |
| Health check | ✅ Working | DB + Redis + MinIO |
| Swagger docs | ✅ Working | Auto-generated |
| Docker Compose | ✅ Working | Multi-service |
| CI/CD (GCP VM) | ✅ Working | GitHub Actions + SSH deploy |
| Admin dashboard | ⚠️ Stub | Returns static "Welcome Admin!" |
| File visibility (isPublic) | ❌ Incomplete | Field exists in schema but unused |
| Rate limiting on auth routes | ❌ Not applied | `authRateLimit` imported but not used on login/register |
| `GET /api/v1/users/` auth | ❌ Security | Returns all user list with no authentication |
| `GET /api/v1/cache/` auth | ❌ Security | Cache key listing exposed without auth |
| `DELETE /api/v1/cache/:key` auth | ❌ Security | Cache eviction exposed without auth |
| `GET /api/v1/queue/` auth | ❌ Security | Queue info without auth |
| `/admin/queues` (Bull Board) auth | ❌ Security | Bull Board accessible without auth |
| Test email route | ❌ Security | `/users/test-email` sends to hardcoded address |
| `console.log` in routes | ⚠️ Noise | "User routes loaded" printed on startup |
| `cacheResponse` vs `cache` | ⚠️ Duplication | Two cache middleware with different logic |
| Cookie `secure: false` | ⚠️ Security | Should be `true` in production |
| Email verification token | ❌ Bug | Uses `generatePasswordResetToken()` for email verification (OK functionally but misleading) |
| `forgotPassword` returns token | ❌ Security | Raw reset token returned in API response instead of emailing |
| `emailVerificationToken` unused | ❌ Bug | Token created in DB but `verifyEmail` endpoint (`GET ?token=`) doesn't exist |

---

## 6. Issues Found

### CRITICAL — Security

| # | Issue | Location | Impact |
|---|---|---|---|
| S1 | `GET /users` returns full user list without any authentication | `user.routes.ts:46-50` | Any anonymous user can enumerate all users |
| S2 | `forgotPassword` returns raw reset token in API response | `user.service.ts:354` | Anyone who intercepted response gets password reset token |
| S3 | Bull Board `/admin/queues` has zero authentication | `app.ts:48-51` | Anyone can view/manage job queues |
| S4 | `/api/v1/cache/` and `/api/v1/queue/` routes have no auth | `cache.routes.ts`, `queue.routes.ts` | Internal infrastructure management exposed |
| S5 | `authRateLimit` / `sensitiveActionRateLimit` imported but not applied to auth endpoints | `user.routes.ts` | No effective rate limiting on login/register |
| S6 | Cookie `secure: false` hardcoded | `user.controller.ts:79, 109, 135` | Cookies transmitted over HTTP in all environments |
| S7 | `/users/test-email` route sends email to hardcoded address | `user.routes.ts:136-148` | Development-only route left in production code |

### HIGH — Broken Functionality

| # | Issue | Location | Impact |
|---|---|---|---|
| B1 | Email verification token created but no verification endpoint exists | `user.service.ts`, `user.routes.ts` | Users can never verify their email |
| B2 | Avatar upload saves local filename, not MinIO-stored URL | `user.controller.ts:294`, `user.service.ts:522` | Avatar field is set to multer temp filename, broken in production |
| B3 | `forgotPassword` creates token but never emails it | `user.service.ts:321-356` | Password reset emails are never sent |
| B4 | `fileService.download` throws generic `Error` not `NotFoundError` | `file.service.ts:41` | Generic 500 instead of proper 404 |
| B5 | `cacheResponse` middleware uses raw URL as cache key (not user-scoped) | `cacheResponse.middleware.ts:12` | Different users could get each other's cached data |

### MEDIUM — Code Quality

| # | Issue | Description |
|---|---|---|
| Q1 | Two duplicate cache middlewares | `cache.middleware.ts` and `cacheResponse.middleware.ts` do the same thing with different implementations |
| Q2 | `console.log` in route files | `user.routes.ts:45` — "User routes loaded" noise |
| Q3 | `console.log` in email worker | Should use logger |
| Q4 | File controller uses `(req as any).user.sub` | Should use typed `req.user.sub` from augmented types |
| Q5 | Cache middleware uses `req.user?.id` but JWT payload stores userId in `.sub` | Cache key may be wrong for authenticated users |
| Q6 | `authRateLimit`/`sensitiveActionRateLimit` imported but unused | Dead imports |
| Q7 | `emailQueue` imported in `user.routes.ts` via `emailService` but `emailService` unused there | Minor dead import |
| Q8 | `verifyEmail` route uses `generatePasswordResetToken` function name | Confusing naming; functionally OK |
| Q9 | `forgotPassword` returns `{ resetToken: token }` — exposes token in response body | Should be replaced with queue-based email dispatch |
| Q10 | No file type validation on upload | Any file type accepted |
| Q11 | No file size reporting on list (BigInt serialized inconsistently) | List stringifies, upload stringifies, but types are mixed |

### LOW — Gaps / Improvements

| # | Issue | Description |
|---|---|---|
| G1 | `File.isPublic` field exists but logic to serve public files is absent | Schema has it, no routes use it |
| G2 | Admin dashboard returns `{ message: "Welcome Admin!" }` only | No actual admin data |
| G3 | No CI workflow file for running tests | Only CD (`deploy.yml`) exists |
| G4 | No `.env.example` with all required variables | Only partial (PORT, NODE_ENV, MinIO public) |
| G5 | `tsconfig.json` - worth verifying strict settings |
| G6 | No request body size limit beyond multer on file upload routes |
| G7 | No explicit token expiry check on email verification |

---

## 7. Test Coverage

Existing integration tests:
- `health.test.ts` ✅
- `register.test.ts` ✅ 
- `login.test.ts` ✅
- `refresh.test.ts` ✅
- `logout.test.ts` ✅
- `change-password.test.ts` ✅
- `forgot-password.test.ts` ✅
- `reset-password.test.ts` ✅
- `email-verification.test.ts` ✅
- `profile.test.ts` ✅
- `update-profile.test.ts` ✅
- `users-query.test.ts` ✅
- `admin.test.ts` ✅
- `rate-limit.test.ts` ✅

Unit tests:
- `auth.validator.test.ts` ✅
- `jwt.test.ts` ✅
- `password.test.ts` ✅

**Missing tests:**
- File upload/download/delete/list
- Presigned URL generation
- Cache middleware
- Security boundary tests (unauthenticated access to protected routes)

---

## 8. Deployment Architecture

- **Local dev:** `npm run dev` (tsx watch)
- **Production:** Docker Compose on GCP VM via GitHub Actions CD
- **Worker:** Separate `vault-worker` Docker container
- **Monitoring:** Prometheus + Grafana (internal only)
- **Secrets:** `.env.docker` file on VM (gitignored)

---

## 9. Git Status

- **Remote:** `https://github.com/Pushpit1/vault.git`
- **Branch:** `main`
- **Uncommitted changes:** `.env.test`, `deploy.yml`, `minio.ts`, `user.routes.ts`, `tests/setup.ts`, log files
- **Git branch creation:** Requires permission fix (OneDrive sync lock on `.git/refs/heads`)
