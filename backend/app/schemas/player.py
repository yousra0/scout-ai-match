
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import uuid
from datetime import datetime

class PlayerProfileBase(BaseModel):
    position: str
    height: Optional[float] = None
    weight: Optional[float] = None
    preferred_foot: Optional[str] = None
    age: int
    nationality: Optional[str] = None
    current_club: Optional[str] = None
    contract_until: Optional[datetime] = None
    market_value: Optional[int] = None
    skills: Optional[List[str]] = None
    stats: Optional[Dict[str, Any]] = None

class PlayerProfileCreate(PlayerProfileBase):
    profile_id: uuid.UUID

class PlayerProfileUpdate(PlayerProfileBase):
    position: Optional[str] = None
    age: Optional[int] = None

class PlayerProfileResponse(PlayerProfileBase):
    id: uuid.UUID
    profile_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class PlayerExperienceBase(BaseModel):
    club: str
    position: str
    from_date: datetime
    to_date: Optional[datetime] = None
    achievements: Optional[str] = None
    appearances: Optional[int] = None
    goals: Optional[int] = None
    assists: Optional[int] = None

class PlayerExperienceCreate(PlayerExperienceBase):
    player_id: uuid.UUID

class PlayerExperienceUpdate(PlayerExperienceBase):
    club: Optional[str] = None
    position: Optional[str] = None
    from_date: Optional[datetime] = None

class PlayerExperienceResponse(PlayerExperienceBase):
    id: uuid.UUID
    player_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class PlayerHighlightBase(BaseModel):
    title: str
    media_url: str
    media_type: str
    description: Optional[str] = None
    date: Optional[datetime] = None

class PlayerHighlightCreate(PlayerHighlightBase):
    player_id: uuid.UUID

class PlayerHighlightUpdate(PlayerHighlightBase):
    title: Optional[str] = None
    media_url: Optional[str] = None
    media_type: Optional[str] = None

class PlayerHighlightResponse(PlayerHighlightBase):
    id: uuid.UUID
    player_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
