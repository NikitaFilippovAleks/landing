import uuid

from pydantic import BaseModel


class SettingUpdate(BaseModel):
    value: str
    locale: str | None = None  # Для переводимых настроек — указать локаль


class SettingResponse(BaseModel):
    id: uuid.UUID
    key: str
    value: str
    locale: str | None = None

    model_config = {"from_attributes": True}
