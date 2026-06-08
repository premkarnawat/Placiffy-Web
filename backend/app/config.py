from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    app_name: str = "Placify API"
    environment: str = "development"
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_key: str = ""
    database_url: str = ""
    groq_api_key: str = ""
    jwt_secret_key: str = "placify-dev-secret-change-in-production-32chars"
    supabase_jwt_secret: str = ""
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440
    frontend_url: str = "https://ruby-galaxy.vercel.app"
    rate_limit_per_minute: int = 60

    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    return Settings()
