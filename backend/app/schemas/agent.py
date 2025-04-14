
from typing import Optional, List
from pydantic import BaseModel
import uuid
from datetime import datetime

class AgentProfileBase(BaseModel):
    agency: Optional[str] = None
    license_number: Optional[str] = None
    experience_years: Optional[int] = None
    specialization: Optional[str] = None
    regions_of_operation: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    clients_count: Optional[int] = None

class AgentProfileCreate(AgentProfileBase):
    profile_id: uuid.UUID

class AgentProfileUpdate(AgentProfileBase):
    pass

class AgentProfileResponse(AgentProfileBase):
    id: uuid.UUID
    profile_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
