from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.setting import SiteSetting
from app.models.user import User
from app.routers.dependencies import get_current_user
from app.schemas.setting import SettingResponse, SettingUpdate

public_router = APIRouter(prefix="/settings", tags=["settings"])
admin_router = APIRouter(prefix="/admin/settings", tags=["admin:settings"])


@public_router.get("", response_model=list[SettingResponse])
async def get_public_settings(db: AsyncSession = Depends(get_db)):
    """Все настройки (для лендинга)."""
    result = await db.execute(select(SiteSetting))
    return result.scalars().all()


@admin_router.get("", response_model=list[SettingResponse])
async def get_all_settings(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(SiteSetting))
    return result.scalars().all()


@admin_router.put("/{key}", response_model=SettingResponse)
async def update_setting(
    key: str,
    data: SettingUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(SiteSetting).where(SiteSetting.key == key))
    setting = result.scalar_one_or_none()
    if not setting:
        raise HTTPException(status_code=404, detail=f"Настройка '{key}' не найдена")

    setting.value = data.value
    await db.commit()
    await db.refresh(setting)
    return setting
