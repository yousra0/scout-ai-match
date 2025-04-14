
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
import uuid
from datetime import datetime

class ClubProfileBase(BaseModel):
    club_name: str
    league: Optional[str] = None
    country: Optional[str] = None
    stadium: Optional[str] = None
    founded: Optional[int] = None
    budget: Optional[Dict[str, Any]] = None
    squad_size: Optional[int] = None
    philosophy: Optional[str] = None
    requirements: Optional[Dict[str, Any]] = None

class ClubProfileCreate(ClubProfileBase):
    profile_id: uuid.UUID

class ClubProfileUpdate(ClubProfileBase):
    club_name: Optional[str] = None

class ClubProfileResponse(ClubProfileBase):
    id: uuid.UUID
    profile_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
