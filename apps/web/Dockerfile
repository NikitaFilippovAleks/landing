# ===== Dev-стадия =====
FROM node:24-bookworm AS dev

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

WORKDIR /workspace

# Монорепо-контекст для pnpm install
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/
COPY packages/shared-types/package.json packages/shared-types/

# Предустановка зависимостей в образ
RUN pnpm install --frozen-lockfile

# Исходный код (compose watch перезапишет при sync)
COPY apps/web/ apps/web/
COPY packages/shared-types/ packages/shared-types/

# Entrypoint: pnpm install → exec next dev
COPY scripts/entrypoint-web.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# ===== Prod: установка зависимостей =====
FROM node:24-alpine AS deps

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/
COPY packages/shared-types/package.json packages/shared-types/

RUN pnpm install --frozen-lockfile

# ===== Prod: сборка =====
FROM deps AS builder

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @portfolio/web build

# ===== Prod: финальный образ =====
FROM node:24-alpine AS prod

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/messages ./apps/web/messages

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
