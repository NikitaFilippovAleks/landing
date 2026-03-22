from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.setting import SiteSetting
from app.models.user import User
from app.routers.dependencies import get_current_user, get_locale
from app.schemas.setting import SettingResponse, SettingUpdate

public_router = APIRouter(prefix="/settings", tags=["settings"])
admin_router = APIRouter(prefix="/admin/settings", tags=["admin:settings"])


@public_router.get("", response_model=list[SettingResponse])
async def get_public_settings(
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
):
    """Настройки для лендинга: переводимые (по локали) + непереводимые (locale=NULL)."""
    result = await db.execute(
        select(SiteSetting).where(
            or_(SiteSetting.locale == locale, SiteSetting.locale.is_(None))
        )
    )
    return result.scalars().all()


@admin_router.get("", response_model=list[SettingResponse])
async def get_all_settings(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Все настройки со всеми локалями (для админки)."""
    result = await db.execute(select(SiteSetting).order_by(SiteSetting.key))
    return result.scalars().all()


@admin_router.put("/{key}", response_model=SettingResponse)
async def update_setting(
    key: str,
    data: SettingUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Обновить настройку. Для переводимых — указать locale в теле запроса."""
    if data.locale:
        # Переводимая настройка — ищем по key + locale
        result = await db.execute(
            select(SiteSetting).where(
                SiteSetting.key == key, SiteSetting.locale == data.locale
            )
        )
    else:
        # Непереводимая — ищем по key + locale IS NULL
        result = await db.execute(
            select(SiteSetting).where(
                SiteSetting.key == key, SiteSetting.locale.is_(None)
            )
        )
    setting = result.scalar_one_or_none()
    if not setting:
        # Upsert: создаём настройку если не найдена
        setting = SiteSetting(key=key, value=data.value, locale=data.locale)
        db.add(setting)
    else:
        setting.value = data.value

    await db.commit()
    await db.refresh(setting)
    return setting
