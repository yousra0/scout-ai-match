
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import uuid
from datetime import datetime

class CoachProfileBase(BaseModel):
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    coaching_style: Optional[str] = None
    achievements: Optional[Dict[str, Any]] = None
    certifications: Optional[List[str]] = None
    preferred_formations: Optional[List[str]] = None
    current_team: Optional[str] = None

class CoachProfileCreate(CoachProfileBase):
    profile_id: uuid.UUID

class CoachProfileUpdate(CoachProfileBase):
    pass

class CoachProfileResponse(CoachProfileBase):
    id: uuid.UUID
    profile_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
