
import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class ClubProfile(Base):
    __tablename__ = "club_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), unique=True)
    club_name = Column(String, nullable=False)
    league = Column(String, nullable=True)
    country = Column(String, nullable=True)
    stadium = Column(String, nullable=True)
    founded = Column(Integer, nullable=True)
    budget = Column(JSON, nullable=True)
    squad_size = Column(Integer, nullable=True)
    philosophy = Column(String, nullable=True)
    requirements = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    profile = relationship("Profile", back_populates="club")
