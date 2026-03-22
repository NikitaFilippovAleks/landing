from sqlalchemy import String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class SiteSetting(Base):
    """Key-value настройки сайта (тексты, ссылки и т.д.).

    Переводимые настройки (hero_title, hero_subtitle, about_text) хранятся
    с locale="ru"/"en". Непереводимые (email, urls) — с locale=NULL.
    """

    __tablename__ = "site_settings"
    __table_args__ = (
        UniqueConstraint("key", "locale", name="uq_setting_key_locale"),
    )

    key: Mapped[str] = mapped_column(String(100))
    value: Mapped[str] = mapped_column(Text)
    locale: Mapped[str | None] = mapped_column(String(5), nullable=True)
