from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Skill(Base):
    """Навык (технология)."""

    __tablename__ = "skills"

    name: Mapped[str] = mapped_column(String(100))
    category: Mapped[str] = mapped_column(String(50))  # frontend, backend, mobile, devops
    icon: Mapped[str] = mapped_column(String(50))  # Имя иконки
    level: Mapped[int] = mapped_column(Integer, default=50)  # 1-100
    order: Mapped[int] = mapped_column(Integer, default=0)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True)
