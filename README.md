@'
# Vault

Production-inspired distributed object storage platform built with Node.js, TypeScript, and Express.

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma
- Redis
- MinIO
- Docker / Docker Compose
- Prometheus
- Grafana
- GitHub Actions
- GCP VM

## Architecture

```text
Internet
    |
    v
Vault API :5000
    |
    +----------+----------+
    |          |          |
    v          v          v
PostgreSQL   Redis      MinIO
 :5432       :6379      :9000

Vault Worker
    |
    v
Internal Services

Prometheus --> Grafana


## Current Capabilities

- REST API built with Express and TypeScript
- PostgreSQL persistence through Prisma
- Redis integration
- Object storage through MinIO
- Background worker service
- Database, Redis, and MinIO readiness checks
- Prometheus metrics
- Grafana monitoring
- Dockerized production deployment
- Automated CI/CD deployment to a GCP VM

## Production Engineering

- Multi-container Docker deployment
- Prisma database migrations during deployment
- API readiness verification after deployment
- Automatic deployment through GitHub Actions
- Production environment excluded from Git
- Infrastructure services restricted to the internal Docker network
- SSH password authentication disabled
- Production health monitoring
- Container restart and health checks

## Production Deployment

Production uses a local `.env.docker` file containing environment-specific configuration and secrets.

The production environment file is intentionally:

- ignored by Git
- removed from repository history
- never required to be committed

Deployment is performed through the GitHub Actions CD workflow.

The deployment process:

1. Fetches the latest `main`
2. Preserves the production environment
3. Builds the API image
4. Starts the API and worker
5. Waits for the readiness endpoint
6. Fails the deployment if the API does not become ready

## Health Check

The service exposes:

GET /api/v1/health/ready

The readiness check verifies:

- Database
- Redis
- MinIO

## Monitoring

Prometheus collects application metrics and Grafana provides monitoring and visualization.

Monitoring services remain internal to the deployment environment.

## Project Status

### Production Backend Foundation — Completed

The current system includes:

- Backend API
- Database layer
- Redis infrastructure
- Object storage
- Worker service
- Observability
- Docker deployment
- CI/CD
- Production health checks
- Security hardening

