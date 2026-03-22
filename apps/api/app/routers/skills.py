import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.skill import Skill, SkillTranslation
from app.models.user import User
from app.routers.dependencies import get_current_user, get_locale
from app.schemas.skill import (
    SkillAdminResponse, SkillCreate, SkillReorder,
    SkillResponse, SkillUpdate,
)

# Публичный роутер — без авторизации
public_router = APIRouter(prefix="/skills", tags=["skills"])

# Админский роутер — требует JWT
admin_router = APIRouter(prefix="/admin/skills", tags=["admin:skills"])


def _localize_skill(skill: Skill, locale: str) -> dict:
    """Подставляет name из перевода нужной локали (или fallback)."""
    name = skill.name  # fallback
    for t in skill.translations:
        if t.locale == locale:
            name = t.name
            break
    return {
        "id": skill.id,
        "name": name,
        "category": skill.category,
        "icon": skill.icon,
        "level": skill.level,
        "order": skill.order,
        "is_visible": skill.is_visible,
    }


@public_router.get("", response_model=list[SkillResponse])
async def get_visible_skills(
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
):
    """Все видимые навыки (для лендинга) с переводами для запрошенной локали."""
    result = await db.execute(
        select(Skill).where(Skill.is_visible == True).order_by(Skill.order)
    )
    skills = result.scalars().all()
    return [_localize_skill(s, locale) for s in skills]


@admin_router.get("", response_model=list[SkillAdminResponse])
async def get_all_skills(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Все навыки со всеми переводами (для админки)."""
    result = await db.execute(select(Skill).order_by(Skill.order))
    return result.scalars().all()


@admin_router.post("", response_model=SkillAdminResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    data: SkillCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    # Берём ru-перевод как fallback для основного поля name
    ru_name = data.translations.get("ru", data.translations.get("en"))
    skill = Skill(
        name=ru_name.name if ru_name else "",
        category=data.category,
        icon=data.icon,
        level=data.level,
        order=data.order,
        is_visible=data.is_visible,
    )
    for locale, t_data in data.translations.items():
        skill.translations.append(SkillTranslation(locale=locale, name=t_data.name))

    db.add(skill)
    await db.commit()
    await db.refresh(skill)
    return skill


@admin_router.put("/{skill_id}", response_model=SkillAdminResponse)
async def update_skill(
    skill_id: uuid.UUID,
    data: SkillUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    skill = result.scalar_one_or_none()
    if not skill:
        raise HTTPException(status_code=404, detail="Навык не найден")

    # Обновляем структурные поля
    for field in ("category", "icon", "level", "order", "is_visible"):
        value = getattr(data, field, None)
        if value is not None:
            setattr(skill, field, value)

    # Обновляем переводы
    if data.translations:
        existing = {t.locale: t for t in skill.translations}
        for locale, t_data in data.translations.items():
            if locale in existing:
                existing[locale].name = t_data.name
            else:
                skill.translations.append(SkillTranslation(locale=locale, name=t_data.name))
        # Обновляем fallback-поле name из ru
        if "ru" in data.translations:
            skill.name = data.translations["ru"].name

    await db.commit()
    await db.refresh(skill)
    return skill


@admin_router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    skill = result.scalar_one_or_none()
    if not skill:
        raise HTTPException(status_code=404, detail="Навык не найден")

    await db.delete(skill)
    await db.commit()


@admin_router.patch("/reorder", response_model=list[SkillAdminResponse])
async def reorder_skills(
    data: SkillReorder,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Изменить порядок навыков (drag-and-drop)."""
    for index, skill_id in enumerate(data.ids):
        await db.execute(
            update(Skill).where(Skill.id == skill_id).values(order=index)
        )
    await db.commit()

    result = await db.execute(select(Skill).order_by(Skill.order))
    return result.scalars().all()
