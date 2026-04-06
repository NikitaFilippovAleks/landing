# ===== Dev-стадия =====
FROM node:24-bookworm AS dev

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

WORKDIR /workspace

# Монорепо-контекст для pnpm install
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/admin/package.json apps/admin/
COPY packages/shared-types/package.json packages/shared-types/

# Предустановка зависимостей в образ
RUN pnpm install --frozen-lockfile

# Исходный код (compose watch перезапишет при sync)
COPY apps/admin/ apps/admin/
COPY packages/shared-types/ packages/shared-types/

# Entrypoint: pnpm install → exec vite dev
COPY scripts/entrypoint-admin.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# ===== Prod: установка зависимостей =====
FROM node:24-alpine AS deps

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/admin/package.json apps/admin/
COPY packages/shared-types/package.json packages/shared-types/

RUN pnpm install --frozen-lockfile

# ===== Prod: сборка =====
FROM deps AS builder

COPY . .

# Пересоздаём workspace-ссылки после COPY (симлинки не сохраняются при копировании)
RUN pnpm install --frozen-lockfile

RUN pnpm --filter @portfolio/admin build

# ===== Prod: финальный образ (nginx) =====
FROM nginx:alpine AS prod

COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
