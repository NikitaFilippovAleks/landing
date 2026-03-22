"""Seed-скрипт: заполняет БД начальными данными.

Запуск: python -m seed
"""

import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session
from app.models import (
    Project, ProjectTranslation, SiteSetting,
    Skill, SkillTranslation, User,
)
from app.services.auth import hash_password


async def seed():
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
    # Данные навыков: структурные поля + переводы
    skills_data = [
        {"category": "frontend", "icon": "react", "level": 95, "order": 0,
         "ru": "React", "en": "React"},
        {"category": "frontend", "icon": "nextjs", "level": 90, "order": 1,
         "ru": "Next.js", "en": "Next.js"},
        {"category": "frontend", "icon": "typescript", "level": 90, "order": 2,
         "ru": "TypeScript", "en": "TypeScript"},
        {"category": "frontend", "icon": "tailwindcss", "level": 85, "order": 3,
         "ru": "Tailwind CSS", "en": "Tailwind CSS"},
        {"category": "mobile", "icon": "flutter", "level": 85, "order": 4,
         "ru": "Flutter", "en": "Flutter"},
        {"category": "mobile", "icon": "reactnative", "level": 80, "order": 5,
         "ru": "React Native", "en": "React Native"},
        {"category": "backend", "icon": "nodejs", "level": 75, "order": 6,
         "ru": "Node.js", "en": "Node.js"},
        {"category": "backend", "icon": "nestjs", "level": 70, "order": 7,
         "ru": "NestJS", "en": "NestJS"},
        {"category": "backend", "icon": "python", "level": 40, "order": 8,
         "ru": "Python", "en": "Python"},
        {"category": "devops", "icon": "docker", "level": 70, "order": 9,
         "ru": "Docker", "en": "Docker"},
    ]

    for data in skills_data:
        skill = Skill(
            name=data["ru"],  # fallback
            category=data["category"],
            icon=data["icon"],
            level=data["level"],
            order=data["order"],
        )
        skill.translations = [
            SkillTranslation(locale="ru", name=data["ru"]),
            SkillTranslation(locale="en", name=data["en"]),
        ]
        db.add(skill)

    print(f"  Создано {len(skills_data)} навыков с переводами (ru/en)")


async def seed_projects(db: AsyncSession):
    projects_data = [
        {
            "image_url": None, "demo_url": None, "github_url": None,
            "order": 0, "is_featured": True,
            "ru": {
                "title": "Portfolio Landing",
                "description": "Портфолио-лендинг с 3D-элементами, scroll-анимациями и кастомной админкой. Стек: Next.js, React Three Fiber, FastAPI, PostgreSQL.",
                "short_description": "Портфолио-лендинг с 3D и анимациями",
                "tags": ["Next.js", "React Three Fiber", "FastAPI", "PostgreSQL", "Docker"],
            },
            "en": {
                "title": "Portfolio Landing",
                "description": "Portfolio landing page with 3D elements, scroll animations, and a custom admin panel. Stack: Next.js, React Three Fiber, FastAPI, PostgreSQL.",
                "short_description": "Portfolio landing with 3D and animations",
                "tags": ["Next.js", "React Three Fiber", "FastAPI", "PostgreSQL", "Docker"],
            },
        },
        {
            "image_url": None, "demo_url": None, "github_url": None,
            "order": 1, "is_featured": False,
            "ru": {
                "title": "Mobile App",
                "description": "Мобильное приложение на Flutter с красивым UI и интеграцией с REST API.",
                "short_description": "Мобильное приложение на Flutter",
                "tags": ["Flutter", "Dart", "REST API"],
            },
            "en": {
                "title": "Mobile App",
                "description": "Mobile application built with Flutter featuring beautiful UI and REST API integration.",
                "short_description": "Mobile app built with Flutter",
                "tags": ["Flutter", "Dart", "REST API"],
            },
        },
    ]

    for data in projects_data:
        ru = data["ru"]
        project = Project(
            title=ru["title"],  # fallback
            description=ru["description"],
            short_description=ru["short_description"],
            tags=ru["tags"],
            image_url=data["image_url"],
            demo_url=data["demo_url"],
            github_url=data["github_url"],
            order=data["order"],
            is_featured=data["is_featured"],
        )
        for locale in ("ru", "en"):
            t = data[locale]
            project.translations.append(ProjectTranslation(
                locale=locale,
                title=t["title"],
                description=t["description"],
                short_description=t["short_description"],
                tags=t["tags"],
            ))
        db.add(project)

    print(f"  Создано {len(projects_data)} проектов с переводами (ru/en)")


async def seed_settings(db: AsyncSession):
    settings = [
        # Переводимые настройки — по записи на каждую локаль
        SiteSetting(key="hero_title", value="Frontend & Mobile Developer", locale="ru"),
        SiteSetting(key="hero_title", value="Frontend & Mobile Developer", locale="en"),
        SiteSetting(key="hero_subtitle", value="Создаю современные веб и мобильные приложения", locale="ru"),
        SiteSetting(key="hero_subtitle", value="Building modern web and mobile applications", locale="en"),
        SiteSetting(key="about_text", locale="ru",
                    value="Я программист-инженер, специализирующийся на фронтенд и мобильной разработке. Создаю быстрые, красивые и удобные интерфейсы."),
        SiteSetting(key="about_text", locale="en",
                    value="I am a software engineer specializing in frontend and mobile development. I build fast, beautiful, and user-friendly interfaces."),
        # Непереводимые настройки — locale=NULL
        SiteSetting(key="email", value="contact@example.com", locale=None),
        SiteSetting(key="github_url", value="https://github.com/NikitaFilippovAleks", locale=None),
        SiteSetting(key="telegram_url", value="", locale=None),
        SiteSetting(key="linkedin_url", value="", locale=None),
    ]
    db.add_all(settings)
    print(f"  Создано {len(settings)} настроек (с переводами)")


if __name__ == "__main__":
    asyncio.run(seed())
