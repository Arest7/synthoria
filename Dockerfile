# ─────────────────────────────────────────────
# Stage 1: Builder — install deps, generate Prisma client, build Next.js
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Build tools required to compile native modules + OpenSSL for Prisma
RUN apk add --no-cache python3 make g++ gcc libtool autoconf automake openssl openssl-dev

# Install all dependencies (including devDeps needed for the build)
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client with Alpine binary target
COPY prisma ./prisma
RUN npx prisma generate

# Copy remaining sources and build Next.js (standalone output)
COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Production runner — minimal Alpine image
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Runtime dependencies
RUN apk add --no-cache bash postgresql-client openssl

# ── Next.js standalone output ──
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# ── Prisma runtime (query engine) ──
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# ── Prisma CLI + migrations (needed for migrate deploy & db seed) ──
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder /app/prisma ./prisma

# ── TypeScript seed runner ──
COPY --from=builder /app/node_modules/ts-node ./node_modules/ts-node
COPY --from=builder /app/node_modules/typescript ./node_modules/typescript
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# ── bcryptjs (used by seed.ts) ──
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs

RUN cp -r .next/static .next/standalone/.next/static 2>/dev/null || true \
 && cp -r public .next/standalone/public 2>/dev/null || true

# Copy startup script
COPY entrypoint.sh ./entrypoint.sh

# Ensure upload directories exist and script is executable
RUN mkdir -p public/uploads/midis public/uploads/pdfs public/uploads/images \
 && chmod +x entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]