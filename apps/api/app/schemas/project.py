import uuid

from pydantic import BaseModel


# --- Публичный ответ (плоский, с подставленным переводом) ---

class ProjectResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    short_description: str
    image_url: str | None = None
    demo_url: str | None = None
    github_url: str | None = None
    tags: list[str] = []
    order: int
    is_visible: bool
    is_featured: bool

    model_config = {"from_attributes": True}


# --- Переводы ---

class ProjectTranslationSchema(BaseModel):
    locale: str
    title: str
    description: str
    short_description: str
    tags: list[str] = []


# --- Админские схемы (со всеми переводами) ---

class ProjectAdminResponse(BaseModel):
    id: uuid.UUID
    title: str  # fallback
    description: str
    short_description: str
    image_url: str | None = None
    demo_url: str | None = None
    github_url: str | None = None
    tags: list[str] = []
    order: int
    is_visible: bool
    is_featured: bool
    translations: list[ProjectTranslationSchema] = []

    model_config = {"from_attributes": True}


class ProjectTranslationInput(BaseModel):
    title: str
    description: str
    short_description: str
    tags: list[str] = []


class ProjectCreate(BaseModel):
    image_url: str | None = None
    demo_url: str | None = None
    github_url: str | None = None
    order: int = 0
    is_visible: bool = True
    is_featured: bool = False
    translations: dict[str, ProjectTranslationInput]  # {"ru": {...}, "en": {...}}


class ProjectUpdate(BaseModel):
    image_url: str | None = None
    demo_url: str | None = None
    github_url: str | None = None
    order: int | None = None
    is_visible: bool | None = None
    is_featured: bool | None = None
    translations: dict[str, ProjectTranslationInput] | None = None
