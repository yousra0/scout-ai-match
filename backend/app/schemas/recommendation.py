
from typing import Any, Dict, List, Optional
from pydantic import BaseModel
import uuid

class RecommendationItem(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    score: float
    metadata: Optional[Dict[str, Any]] = None

class RecommendationResponse(BaseModel):
    items: List[RecommendationItem]
    total: int
