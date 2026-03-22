# === Dev (Docker, bind mounts) ===

# Запустить все сервисы
dev:
	docker compose -f docker-compose.dev.yml up --build

# Запуск в фоне (без watch)
dev-up:
	docker compose -f docker-compose.dev.yml up -d --build

# Остановить dev-среду
dev-down:
	docker compose -f docker-compose.dev.yml down

# Логи
dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

dev-logs-api:
	docker compose -f docker-compose.dev.yml logs -f api

dev-logs-web:
	docker compose -f docker-compose.dev.yml logs -f web

dev-logs-admin:
	docker compose -f docker-compose.dev.yml logs -f admin

# Шелл в контейнер
dev-shell-api:
	docker compose -f docker-compose.dev.yml exec api bash

dev-shell-web:
	docker compose -f docker-compose.dev.yml exec web bash

dev-shell-admin:
	docker compose -f docker-compose.dev.yml exec admin bash

# === БД ===
db-seed:
	docker compose -f docker-compose.dev.yml exec api python -m seed

db-migrate:
	docker compose -f docker-compose.dev.yml exec api alembic upgrade head

db-migration:
	@read -p "Название миграции: " name; \
	docker compose -f docker-compose.dev.yml exec api alembic revision --autogenerate -m "$$name"

# === Prod (локальная сборка) ===
prod-build:
	docker compose build

prod-up:
	docker compose up -d

prod-down:
	docker compose down

# === Утилиты ===
clean:
	docker compose -f docker-compose.dev.yml down -v --rmi local

.PHONY: dev dev-up dev-down dev-logs dev-logs-api dev-logs-web dev-logs-admin \
        dev-shell-api dev-shell-web dev-shell-admin \
        db-seed db-migrate db-migration prod-build prod-up prod-down clean
