#!/usr/bin/env bash
set -euo pipefail

echo "=== Web: Проверка зависимостей ==="
cd /workspace
pnpm install --frozen-lockfile

echo "=== Web: Запуск Next.js dev ==="
exec pnpm --filter @portfolio/web dev
