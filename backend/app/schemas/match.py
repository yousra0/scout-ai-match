
from typing import Optional, Dict, List, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class MatchBase(BaseModel):
    user_id: uuid.UUID
    target_id: uuid.UUID
    score: float = Field(..., ge=0.0, le=1.0)
    match_data: Optional[Dict[str, Any]] = None

class MatchCreate(MatchBase):
    pass

class Match(MatchBase):
    id: uuid.UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class MatchList(BaseModel):
    matches: List[Match]
    total: int
