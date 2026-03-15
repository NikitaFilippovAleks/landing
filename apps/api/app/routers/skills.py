import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.skill import Skill
from app.models.user import User
from app.routers.dependencies import get_current_user
from app.schemas.skill import SkillCreate, SkillReorder, SkillResponse, SkillUpdate

# Публичный роутер — без авторизации
public_router = APIRouter(prefix="/skills", tags=["skills"])

# Админский роутер — требует JWT
admin_router = APIRouter(prefix="/admin/skills", tags=["admin:skills"])


@public_router.get("", response_model=list[SkillResponse])
async def get_visible_skills(db: AsyncSession = Depends(get_db)):
    """Все видимые навыки (для лендинга)."""
    result = await db.execute(
        select(Skill).where(Skill.is_visible == True).order_by(Skill.order)
    )
    return result.scalars().all()


@admin_router.get("", response_model=list[SkillResponse])
async def get_all_skills(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Все навыки, включая скрытые (для админки)."""
    result = await db.execute(select(Skill).order_by(Skill.order))
    return result.scalars().all()


@admin_router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    data: SkillCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    skill = Skill(**data.model_dump())
    db.add(skill)
    await db.commit()
    await db.refresh(skill)
    return skill


@admin_router.put("/{skill_id}", response_model=SkillResponse)
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

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(skill, field, value)

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


@admin_router.patch("/reorder", response_model=list[SkillResponse])
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
