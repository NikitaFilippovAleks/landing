from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # База данных
    database_url: str = "postgresql+asyncpg://portfolio:portfolio@db:5432/portfolio"

    # JWT
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # Приложение
    app_name: str = "Portfolio API"
    debug: bool = True

    # Next.js webhook для ISR-ревалидации
    nextjs_revalidate_url: str = "http://web:3000/api/revalidate"
    revalidate_secret: str = "dev-revalidate-secret"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
