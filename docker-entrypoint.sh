#!/bin/sh

set -e

echo "DATABASE_URL=$DATABASE_URL"

echo "Applying Prisma migrations..."

npx prisma migrate deploy

echo "Starting Vault API..."

exec npm start