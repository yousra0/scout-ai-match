
import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class CoachProfile(Base):
    __tablename__ = "coach_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), unique=True)
    specialization = Column(String, nullable=True)
    experience_years = Column(Integer, nullable=True)
    coaching_style = Column(String, nullable=True)
    achievements = Column(JSON, nullable=True)
    certifications = Column(ARRAY(String), nullable=True)
    preferred_formations = Column(ARRAY(String), nullable=True)
    current_team = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    profile = relationship("Profile", back_populates="coach")
