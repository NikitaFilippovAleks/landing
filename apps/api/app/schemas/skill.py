import uuid

from pydantic import BaseModel


# --- Публичный ответ (плоский, с подставленным переводом) ---

class SkillResponse(BaseModel):
    id: uuid.UUID
    name: str
    category: str
    icon: str
    level: int
    order: int
    is_visible: bool

    model_config = {"from_attributes": True}


# --- Переводы ---

class SkillTranslationSchema(BaseModel):
    locale: str
    name: str


# --- Админские схемы (со всеми переводами) ---

class SkillAdminResponse(BaseModel):
    id: uuid.UUID
    name: str  # fallback
    category: str
    icon: str
    level: int
    order: int
    is_visible: bool
    translations: list[SkillTranslationSchema] = []

    model_config = {"from_attributes": True}


class SkillTranslationInput(BaseModel):
    name: str


class SkillCreate(BaseModel):
    category: str
    icon: str
    level: int = 50
    order: int = 0
    is_visible: bool = True
    translations: dict[str, SkillTranslationInput]  # {"ru": {"name": "..."}, "en": {"name": "..."}}


class SkillUpdate(BaseModel):
    category: str | None = None
    icon: str | None = None
    level: int | None = None
    order: int | None = None
    is_visible: bool | None = None
    translations: dict[str, SkillTranslationInput] | None = None


class SkillReorder(BaseModel):
    """Список ID навыков в новом порядке."""
    ids: list[uuid.UUID]
