
import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class AgentProfile(Base):
    __tablename__ = "agent_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), unique=True)
    agency = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    experience_years = Column(Integer, nullable=True)
    specialization = Column(String, nullable=True)
    regions_of_operation = Column(ARRAY(String), nullable=True)
    languages = Column(ARRAY(String), nullable=True)
    clients_count = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    profile = relationship("Profile", back_populates="agent")
