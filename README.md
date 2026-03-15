# Portfolio Landing

Портфолио-лендинг с 3D-элементами, scroll-анимациями и кастомной админкой.

## Стек

- **Лендинг**: Next.js 16, Tailwind CSS 4, React Three Fiber, Framer Motion 12
- **Админка**: Vite, React, shadcn/ui
- **Бэкенд**: FastAPI, SQLAlchemy, PostgreSQL 18
- **Инфраструктура**: Docker Compose, Dev Containers, Turborepo

## Быстрый старт

### Dev Container (рекомендуется)

1. Установи [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Открой проект в Cursor
3. Нажми `Ctrl+Shift+P` → "Dev Containers: Reopen in Container"
4. Дождись сборки контейнера
5. Запусти:

```bash
# Бэкенд
cd apps/api && python -m seed  # Заполнить БД тестовыми данными
pnpm dev:api                    # FastAPI на :8000

# Фронтенд
pnpm dev:web                    # Next.js на :3000
pnpm dev:admin                  # Vite админка на :3001
```

### Standalone Docker Compose

```bash
docker compose -f docker-compose.dev.yml up
```

## Структура

```
apps/
├── web/        — Next.js лендинг
├── admin/      — React админка (shadcn/ui)
└── api/        — FastAPI бэкенд
packages/
└── shared-types/ — Общие TypeScript типы
```
