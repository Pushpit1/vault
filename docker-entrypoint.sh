#!/bin/sh

set -e

echo "DATABASE_URL=$DATABASE_URL"

# Run migrations only for API container
if [ "$1" = "npm" ] && [ "$2" = "start" ]; then
  echo "Applying Prisma migrations..."
  npx prisma migrate deploy
fi

echo "Starting: $@"

exec "$@"