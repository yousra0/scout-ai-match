
from typing import Optional
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class MessageBase(BaseModel):
    content: str = Field(..., min_length=1)

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: uuid.UUID
    sender_id: uuid.UUID
    receiver_id: uuid.UUID
    is_read: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ConversationResponse(BaseModel):
    id: uuid.UUID
    other_user_id: uuid.UUID
    full_name: str
    avatar_url: Optional[str] = None
    last_message: str
    last_message_time: datetime
    unread_count: int

    class Config:
        orm_mode = True
