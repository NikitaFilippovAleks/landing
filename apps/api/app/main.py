from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, health, projects, settings as settings_router, skills

app = FastAPI(
    title=settings.app_name,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

# CORS — разрешаем запросы с фронтенда и админки
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js лендинг
        "http://localhost:3001",  # Vite админка
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Публичные роутеры (без авторизации)
app.include_router(health.router, prefix="/api/v1")
app.include_router(skills.public_router, prefix="/api/v1")
app.include_router(projects.public_router, prefix="/api/v1")
app.include_router(settings_router.public_router, prefix="/api/v1")

# Авторизация
app.include_router(auth.router, prefix="/api/v1")

# Админские роутеры (JWT)
app.include_router(skills.admin_router, prefix="/api/v1")
app.include_router(projects.admin_router, prefix="/api/v1")
app.include_router(settings_router.admin_router, prefix="/api/v1")
