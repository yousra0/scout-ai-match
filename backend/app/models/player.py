
import uuid
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, ARRAY, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class PlayerProfile(Base):
    __tablename__ = "player_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), unique=True)
    position = Column(String, nullable=False)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    preferred_foot = Column(String, nullable=True)
    age = Column(Integer, nullable=False)
    nationality = Column(String, nullable=True)
    current_club = Column(String, nullable=True)
    contract_until = Column(DateTime, nullable=True)
    market_value = Column(Integer, nullable=True)
    skills = Column(ARRAY(String), nullable=True)
    stats = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    profile = relationship("Profile", back_populates="player")
    experiences = relationship("PlayerExperience", back_populates="player")
    highlights = relationship("PlayerHighlight", back_populates="player")
