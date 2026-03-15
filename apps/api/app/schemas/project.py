import uuid

from pydantic import BaseModel


class ProjectBase(BaseModel):
    title: str
    description: str
    short_description: str
    image_url: str | None = None
    demo_url: str | None = None
    github_url: str | None = None
    tags: list[str] = []
    order: int = 0
    is_visible: bool = True
    is_featured: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    short_description: str | None = None
    image_url: str | None = None
    demo_url: str | None = None
    github_url: str | None = None
    tags: list[str] | None = None
    order: int | None = None
    is_visible: bool | None = None
    is_featured: bool | None = None


class ProjectResponse(ProjectBase):
    id: uuid.UUID

    model_config = {"from_attributes": True}
