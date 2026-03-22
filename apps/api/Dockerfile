# ===== Dev-стадия =====
FROM python:3.13-bookworm AS dev

RUN apt-get update && apt-get install -y \
    git curl libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace/apps/api
ENV PYTHONPATH="/workspace/apps/api"

# Предустановка зависимостей в образ (ускоряет старт контейнера)
COPY apps/api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Исходный код (compose watch перезапишет при sync)
COPY apps/api/ ./

# Entrypoint: pip install → alembic migrate → exec uvicorn
COPY scripts/entrypoint-api.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# ===== Prod-стадия =====
FROM python:3.13-slim AS prod

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/api/ .

RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
