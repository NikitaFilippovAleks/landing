import uuid

from pydantic import BaseModel


class SettingUpdate(BaseModel):
    value: str


class SettingResponse(BaseModel):
    id: uuid.UUID
    key: str
    value: str

    model_config = {"from_attributes": True}
