# Vault

Production-grade distributed object storage platform built with Node.js, TypeScript, Express, PostgreSQL, Prisma, Redis, and MinIO.

---

## Architecture Overview

```text
                        Internet / Client
                               |
                               v
                     Vault API (Express, :5000)
             [Auth, Rate Limiting, Validation, Metrics]
                               |
       +-----------------------+-----------------------+
       |                       |                       |
       v                       v                       v
 PostgreSQL (:5432)       Redis (:6379)           MinIO (:9000)
 [Prisma ORM Metadata]  [Cache, Rate-Limit,    [S3-Compatible Binary
                         BullMQ Queues]          Object Storage]
                               |
                               v
                         Vault Worker
                 [BullMQ Async Processing]
                               |
                               v
                    Transactional Email (Resend)
```

---

## Features

- **Distributed Object Storage:** S3-compatible binary storage powered by MinIO with support for presigned URLs, streaming downloads, and secure deletion.
- **Robust Authentication & Authorization:**
  - JWT access tokens (15-min expiration) & rotating refresh tokens (7-day expiration).
  - Argon2/bcrypt-hashed credentials.
  - Role-based access control (`USER`, `ADMIN`).
  - Object-level ownership enforcement preventing cross-user data access.
- **Admin Dashboard & Queue Management:**
  - Secure `/admin/queues` Bull Board dashboard supporting Bearer JWT, session cookies, and HTTP Basic Auth.
- **Resilient Background Processing:**
  - BullMQ job queues backed by Redis for asynchronous email dispatch.
  - Separate worker process capability.
- **High Performance Caching & Rate Limiting:**
  - Redis-backed rate limiting on auth and sensitive actions.
  - Response caching for profile and user queries.
- **Observability & Metrics:**
  - Prometheus metrics exposed on `/metrics`.
  - Comprehensive structured logging with Winston (daily rotation).
  - Integrated health checks on `/api/v1/health/ready`.
- **API Documentation:**
  - OpenAPI / Swagger documentation served on `/docs`.

---

## Technology Stack

- **Runtime & Language:** Node.js 22 LTS, TypeScript 7
- **Web Framework:** Express 5
- **Database & ORM:** PostgreSQL 17, Prisma 7 with `@prisma/adapter-pg`
- **Cache & Message Broker:** Redis 7, BullMQ, `ioredis` / `redis`
- **Object Storage:** MinIO (S3 compatible)
- **Email:** Resend
- **Validation & Security:** Zod, Helmet, CORS, bcrypt, jsonwebtoken
- **Testing:** Vitest, Supertest
- **Containers & Monitoring:** Docker Compose, Prometheus, Grafana

---

## Project Structure

```text
.
├── .github/workflows/       # CI/CD pipelines (test, build, deploy)
├── monitoring/              # Prometheus configuration
├── prisma/                  # Prisma schema and database migrations
├── src/
│   ├── app.ts               # Express application configuration
│   ├── server.ts            # API server entrypoint & graceful shutdown
│   ├── worker.ts            # Dedicated BullMQ worker entrypoint
│   ├── config/              # Environment, DB, Redis, MinIO, BullMQ configs
│   ├── controllers/         # HTTP request handlers (user, file, health)
│   ├── errors/              # Domain error classes (AppError hierarchy)
│   ├── middlewares/         # Auth, validation, rate limiting, error handling
│   ├── queues/              # BullMQ queue definitions
│   ├── repositories/        # Database access layer
│   ├── routes/v1/           # API v1 routes (files, users, health, cache)
│   ├── services/            # Core business logic & storage providers
│   ├── utils/               # Helpers, token generators, logger, response formatting
│   ├── validators/          # Zod request validation schemas
│   └── workers/             # BullMQ queue consumers
├── tests/
│   ├── fixtures/            # Test data factories
│   ├── helpers/             # DB & auth test helpers
│   ├── integration/         # Integration test suites
│   ├── unit/                # Unit test suites
│   └── setup.ts             # Vitest lifecycle configuration
├── docker-compose.yml       # Local multi-service orchestration
└── Dockerfile               # Multi-stage production container build
```

---

## Local Development Setup

### 1. Prerequisites

- Node.js >= 22.0.0
- Docker and Docker Compose
- npm >= 10.0.0

### 2. Environment Configuration

Copy the example environment file and configure variables:

```bash
cp .env.example .env
```

Ensure the following essential variables are defined:
```env
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:5000
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
DATABASE_URL=postgresql://postgres:password@localhost:5432/vault
REDIS_URL=redis://localhost:6379
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_NAME=vault
MINIO_USE_SSL=false
```

### 3. Start Infrastructure Services

Use Docker Compose to launch PostgreSQL, Redis, and MinIO:

```bash
docker compose up -d postgres redis minio
```

### 4. Database Setup & Migrations

Generate the Prisma Client and apply migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Start the Development Server

```bash
# Start API in watch mode
npm run dev

# Start worker (optional, in separate terminal)
npm run worker
```

The API will be available at `http://localhost:5000`.  
Swagger documentation is available at `http://localhost:5000/docs`.

---

## Running Tests

Vault includes unit tests and integration tests.

```bash
# Run all unit tests
npm test tests/unit

# Run full test suite (requires local Postgres, Redis, and MinIO)
npm test

# Run tests with coverage
npm run test:coverage

# Run TypeScript type check
npm run typecheck
```

---

## Production Deployment

### Docker Deployment

To build and run the entire production stack locally or on a server:

```bash
# Build and start all services
docker compose up -d --build
```

### Continuous Integration & Deployment

- **CI Pipeline (`.github/workflows/ci.yml`):**
  - Type-checks with TypeScript (`tsc --noEmit`).
  - Spins up containerized PostgreSQL, Redis, and MinIO services.
  - Runs database migrations (`prisma migrate deploy`).
  - Verifies MinIO bucket readiness.
  - Builds the TypeScript bundle.
  - Executes all unit and integration tests.
- **CD Pipeline (`.github/workflows/deploy.yml`):**
  - Triggered on push to `main`.
  - Securely deploys containers to production VM using SSH and docker-compose.

---

## API Endpoints Reference

### Authentication & Users (`/api/v1/users`)
- `POST /` — Register a new user account.
- `POST /login` — Login with credentials, returns access token and sets refresh cookie.
- `POST /refresh` — Rotate refresh token and issue new access token.
- `POST /logout` — Invalidate session and clear refresh cookie.
- `POST /forgot-password` — Request password reset email (enumeration-safe).
- `POST /reset-password` — Reset password using token.
- `POST /change-password` — Authenticated password change (revokes all active sessions).
- `GET /me` — Retrieve current user profile (with avatar presigned URL).
- `PATCH /me` — Update user profile details.
- `PATCH /me/avatar` — Upload user avatar image.
- `GET /` — List all users (ADMIN only).
- `GET /admin` — Retrieve admin system statistics (ADMIN only).

### Files & Storage (`/api/v1/files`)
- `POST /upload` — Upload file (multipart/form-data, authenticated).
- `GET /` — List files owned by the authenticated user.
- `GET /:id/download` — Stream download file content (with ownership enforcement).
- `GET /:id/url` — Generate a presigned download URL (valid for 15 minutes).
- `DELETE /:id` — Delete file from MinIO and remove database record.

### System & Health
- `GET /api/v1/health/ready` — Readiness probe (checks PostgreSQL, Redis, MinIO).
- `GET /metrics` — Prometheus metrics.
- `GET /admin/queues` — Bull Board background queue manager (ADMIN only).
