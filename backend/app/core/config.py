
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
        "*",  # Allow all origins during development
    ]
    
    # Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database (Supabase)
    SUPABASE_URL: str = "https://hodhzdfxagnvolvpyeai.supabase.co"
    SUPABASE_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZGh6ZGZ4YWdudm9sdnB5ZWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4Nzc2NDUsImV4cCI6MjA1OTQ1MzY0NX0.TZopZVmzws8uVuAfZyonWSlCwjTTjI2rQj7fjlQIhI8"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@db:5432/scout_ai_match"
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
