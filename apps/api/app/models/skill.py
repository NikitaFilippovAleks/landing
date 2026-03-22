import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Skill(Base):
    """Навык (технология)."""

    __tablename__ = "skills"

    name: Mapped[str] = mapped_column(String(100))  # Fallback-значение (ru)
    category: Mapped[str] = mapped_column(String(50))  # frontend, backend, mobile, devops
    icon: Mapped[str] = mapped_column(String(50))  # Имя иконки
    level: Mapped[int] = mapped_column(Integer, default=50)  # 1-100
    order: Mapped[int] = mapped_column(Integer, default=0)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True)

    # Переводы навыка (по записи на каждую локаль)
    translations: Mapped[list["SkillTranslation"]] = relationship(
        back_populates="skill", cascade="all, delete-orphan", lazy="selectin"
    )


class SkillTranslation(Base):
    """Перевод навыка для конкретной локали."""

    __tablename__ = "skill_translations"
    __table_args__ = (
        UniqueConstraint("skill_id", "locale", name="uq_skill_translation_locale"),
    )

    skill_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False
    )
    locale: Mapped[str] = mapped_column(String(5), nullable=False)  # "ru", "en"
    name: Mapped[str] = mapped_column(String(100))

    skill: Mapped["Skill"] = relationship(back_populates="translations")
