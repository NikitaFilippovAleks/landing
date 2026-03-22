#!/usr/bin/env bash
set -euo pipefail

echo "=== Admin: Проверка зависимостей ==="
cd /workspace
pnpm install --frozen-lockfile

echo "=== Admin: Запуск Vite dev ==="
exec pnpm --filter @portfolio/admin dev
