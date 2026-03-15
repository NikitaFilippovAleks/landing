"""Seed-скрипт: заполняет БД начальными данными.

Запуск: python -m seed
"""

import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session, engine
from app.models import Base, Project, SiteSetting, Skill, User
from app.services.auth import hash_password


async def seed():
    # Создаём таблицы (для первого запуска без миграций)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Проверяем, есть ли уже данные
        result = await db.execute(select(User))
        if result.scalar_one_or_none():
            print("БД уже содержит данные, пропускаем seed")
            return

        await seed_user(db)
        await seed_skills(db)
        await seed_projects(db)
        await seed_settings(db)
        await db.commit()
        print("Seed завершён успешно!")


async def seed_user(db: AsyncSession):
    admin = User(
        email="admin@portfolio.dev",
        hashed_password=hash_password("admin123"),
    )
    db.add(admin)
    print("  Создан админ: admin@portfolio.dev / admin123")


async def seed_skills(db: AsyncSession):
    skills = [
        Skill(name="React", category="frontend", icon="react", level=95, order=0),
        Skill(name="Next.js", category="frontend", icon="nextjs", level=90, order=1),
        Skill(name="TypeScript", category="frontend", icon="typescript", level=90, order=2),
        Skill(name="Tailwind CSS", category="frontend", icon="tailwindcss", level=85, order=3),
        Skill(name="Flutter", category="mobile", icon="flutter", level=85, order=4),
        Skill(name="React Native", category="mobile", icon="reactnative", level=80, order=5),
        Skill(name="Node.js", category="backend", icon="nodejs", level=75, order=6),
        Skill(name="NestJS", category="backend", icon="nestjs", level=70, order=7),
        Skill(name="Python", category="backend", icon="python", level=40, order=8),
        Skill(name="Docker", category="devops", icon="docker", level=70, order=9),
    ]
    db.add_all(skills)
    print(f"  Создано {len(skills)} навыков")


async def seed_projects(db: AsyncSession):
    projects = [
        Project(
            title="Portfolio Landing",
            description="Портфолио-лендинг с 3D-элементами, scroll-анимациями и кастомной админкой. Стек: Next.js, React Three Fiber, FastAPI, PostgreSQL.",
            short_description="Портфолио-лендинг с 3D и анимациями",
            tags=["Next.js", "React Three Fiber", "FastAPI", "PostgreSQL", "Docker"],
            order=0,
            is_featured=True,
        ),
        Project(
            title="Mobile App",
            description="Мобильное приложение на Flutter с красивым UI и интеграцией с REST API.",
            short_description="Мобильное приложение на Flutter",
            tags=["Flutter", "Dart", "REST API"],
            order=1,
        ),
    ]
    db.add_all(projects)
    print(f"  Создано {len(projects)} проектов")


async def seed_settings(db: AsyncSession):
    settings = [
        SiteSetting(key="hero_title", value="Frontend & Mobile Developer"),
        SiteSetting(key="hero_subtitle", value="Создаю современные веб и мобильные приложения"),
        SiteSetting(key="about_text", value="Я программист-инженер, специализирующийся на фронтенд и мобильной разработке. Создаю быстрые, красивые и удобные интерфейсы."),
        SiteSetting(key="email", value="contact@example.com"),
        SiteSetting(key="github_url", value="https://github.com/NikitaFilippovAleks"),
        SiteSetting(key="telegram_url", value=""),
        SiteSetting(key="linkedin_url", value=""),
    ]
    db.add_all(settings)
    print(f"  Создано {len(settings)} настроек")


if __name__ == "__main__":
    asyncio.run(seed())
