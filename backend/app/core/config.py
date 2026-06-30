from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "NeuralFlow"
    DEBUG: bool = True

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:Ukk%407337580095@qbgjtymjmzzmpmpgyxeg.supabase.co:6543/postgres"
    REDIS_URL: str = "redis://localhost:6379/0"

    # AI Providers
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    OLLAMA_BASE_URL: str = "http://localhost:11434"

    # OpenRouter
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_SITE_URL: str = "http://localhost:3000"
    OPENROUTER_SITE_NAME: str = "NeuralFlow"

    # Default model
    DEFAULT_MODEL: str = "nvidia/nemotron-3-ultra-550b-a55b:free"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
