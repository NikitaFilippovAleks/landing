import uuid

from pydantic import BaseModel


class SkillBase(BaseModel):
    name: str
    category: str
    icon: str
    level: int = 50
    order: int = 0
    is_visible: bool = True


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    icon: str | None = None
    level: int | None = None
    order: int | None = None
    is_visible: bool | None = None


class SkillResponse(SkillBase):
    id: uuid.UUID

    model_config = {"from_attributes": True}


class SkillReorder(BaseModel):
    """Список ID навыков в новом порядке."""
    ids: list[uuid.UUID]
