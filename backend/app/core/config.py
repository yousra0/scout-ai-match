
import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Scout AI Match"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",  # For development
        "https://scout-ai-match.com",  # Add your production domain
    ]
    
    # Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/scout_ai_match"
    )
    
    # Redis
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", 6379))
    
    # ML Model paths
    KNN_MODEL_PATH: str = os.getenv("KNN_MODEL_PATH", "app/ml/models/knn_model.pkl")
    SIMILARITY_MODEL_PATH: str = os.getenv("SIMILARITY_MODEL_PATH", "app/ml/models/similarity_model.pkl")
    
    class Config:
        env_file = ".env"

settings = Settings()
