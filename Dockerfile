# ============================
# Stage 1 - Builder
# ============================

FROM node:22-alpine AS builder

WORKDIR /app


COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN npx prisma generate

RUN npm run build

RUN npm prune --omit=dev

# ============================
# Stage 2 - Runtime
# ============================

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/src/docs ./src/docs
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x docker-entrypoint.sh
RUN mkdir -p /app/logs && chown -R node:node /app
USER node

EXPOSE 5000

ENTRYPOINT ["./docker-entrypoint.sh"]