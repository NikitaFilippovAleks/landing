"""Создаёт дефолтного админа если в БД нет ни одного пользователя.

Запускается в entrypoint-api.sh после миграций.
Если пользователи уже есть — ничего не делает.
"""

import asyncio

from sqlalchemy import func, select

from app.database import async_session
from app.models.user import User
from app.services.auth import hash_password

DEFAULT_EMAIL = "admin@portfolio.dev"
DEFAULT_PASSWORD = "admin123"


async def ensure_admin():
    async with async_session() as db:
        result = await db.execute(select(func.count()).select_from(User))
        count = result.scalar()

        if count > 0:
            print("  Пользователи уже существуют, пропускаю")
            return

        admin = User(
            email=DEFAULT_EMAIL,
            hashed_password=hash_password(DEFAULT_PASSWORD),
        )
        db.add(admin)
        await db.commit()
        print(f"  Создан админ: {DEFAULT_EMAIL} / {DEFAULT_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(ensure_admin())
