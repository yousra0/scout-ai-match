
import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class PlayerHighlight(Base):
    __tablename__ = "player_highlights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    player_id = Column(UUID(as_uuid=True), ForeignKey("player_profiles.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    media_url = Column(String, nullable=False)
    media_type = Column(String, nullable=False)
    description = Column(String, nullable=True)
    date = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    player = relationship("PlayerProfile", back_populates="highlights")
