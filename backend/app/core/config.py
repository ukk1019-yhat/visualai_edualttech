from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    APP_NAME: str = "NeuralFlow"
    DEBUG: bool = True

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:Ukk%407337580095@qbgjtymjmzzmpmpgyxeg.supabase.co:6543/postgres"
    REDIS_URL: str = "redis://localhost:6379/0"

    # AI Providers
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_SITE_URL: str = "http://localhost:3000"
    OPENROUTER_SITE_NAME: str = "Neural Flow"
    OLLAMA_BASE_URL: str = "http://localhost:11434"

    # Default model
    DEFAULT_MODEL: str = "google/gemma-4-31b-it:free"

    class Config:
        env_file = str(Path(__file__).parent.parent.parent / ".env")
        case_sensitive = True


settings = Settings()
