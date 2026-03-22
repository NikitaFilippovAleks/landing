import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.project import Project, ProjectTranslation
from app.models.user import User
from app.routers.dependencies import get_current_user, get_locale
from app.schemas.project import (
    ProjectAdminResponse, ProjectCreate, ProjectResponse, ProjectUpdate,
)

public_router = APIRouter(prefix="/projects", tags=["projects"])
admin_router = APIRouter(prefix="/admin/projects", tags=["admin:projects"])


def _localize_project(project: Project, locale: str) -> dict:
    """Подставляет переводимые поля из нужной локали (или fallback)."""
    title = project.title
    description = project.description
    short_description = project.short_description
    tags = project.tags

    for t in project.translations:
        if t.locale == locale:
            title = t.title
            description = t.description
            short_description = t.short_description
            tags = t.tags
            break

    return {
        "id": project.id,
        "title": title,
        "description": description,
        "short_description": short_description,
        "image_url": project.image_url,
        "demo_url": project.demo_url,
        "github_url": project.github_url,
        "tags": tags,
        "order": project.order,
        "is_visible": project.is_visible,
        "is_featured": project.is_featured,
    }


@public_router.get("", response_model=list[ProjectResponse])
async def get_visible_projects(
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
):
    """Все видимые проекты (для лендинга) с переводами для запрошенной локали."""
    result = await db.execute(
        select(Project).where(Project.is_visible == True).order_by(Project.order)
    )
    projects = result.scalars().all()
    return [_localize_project(p, locale) for p in projects]


@admin_router.get("", response_model=list[ProjectAdminResponse])
async def get_all_projects(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Все проекты со всеми переводами (для админки)."""
    result = await db.execute(select(Project).order_by(Project.order))
    return result.scalars().all()


@admin_router.post("", response_model=ProjectAdminResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    # Берём ru-перевод как fallback для основных полей
    ru = data.translations.get("ru", data.translations.get("en"))
    project = Project(
        title=ru.title if ru else "",
        description=ru.description if ru else "",
        short_description=ru.short_description if ru else "",
        tags=ru.tags if ru else [],
        image_url=data.image_url,
        demo_url=data.demo_url,
        github_url=data.github_url,
        order=data.order,
        is_visible=data.is_visible,
        is_featured=data.is_featured,
    )
    for locale, t_data in data.translations.items():
        project.translations.append(ProjectTranslation(
            locale=locale,
            title=t_data.title,
            description=t_data.description,
            short_description=t_data.short_description,
            tags=t_data.tags,
        ))

    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


@admin_router.put("/{project_id}", response_model=ProjectAdminResponse)
async def update_project(
    project_id: uuid.UUID,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    # Обновляем структурные поля
    for field in ("image_url", "demo_url", "github_url", "order", "is_visible", "is_featured"):
        value = getattr(data, field, None)
        if value is not None:
            setattr(project, field, value)

    # Обновляем переводы
    if data.translations:
        existing = {t.locale: t for t in project.translations}
        for locale, t_data in data.translations.items():
            if locale in existing:
                existing[locale].title = t_data.title
                existing[locale].description = t_data.description
                existing[locale].short_description = t_data.short_description
                existing[locale].tags = t_data.tags
            else:
                project.translations.append(ProjectTranslation(
                    locale=locale,
                    title=t_data.title,
                    description=t_data.description,
                    short_description=t_data.short_description,
                    tags=t_data.tags,
                ))
        # Обновляем fallback из ru
        if "ru" in data.translations:
            ru = data.translations["ru"]
            project.title = ru.title
            project.description = ru.description
            project.short_description = ru.short_description
            project.tags = ru.tags

    await db.commit()
    await db.refresh(project)
    return project


@admin_router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    await db.delete(project)
    await db.commit()
