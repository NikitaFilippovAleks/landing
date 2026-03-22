#!/usr/bin/env bash
set -euo pipefail

# PYTHONPATH нужен чтобы alembic и uvicorn находили модуль app
export PYTHONPATH="/workspace/apps/api:${PYTHONPATH:-}"

echo "=== API: Проверка зависимостей ==="
pip install -q --root-user-action=ignore -r requirements.txt

echo "=== API: Применение миграций Alembic ==="
# Пропускаем если нет миграций (папка versions пуста)
if ls alembic/versions/*.py 1>/dev/null 2>&1; then
    alembic upgrade head
else
    echo "    Миграций нет, пропускаю"
fi

echo "=== API: Проверка админ-пользователя ==="
python -m ensure_admin

echo "=== API: Запуск uvicorn (reload) ==="
exec uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
