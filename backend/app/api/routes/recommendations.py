
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import uuid

from app.api.dependencies import get_current_active_user, get_db
from app.models.user import User, UserRole
from app.ml.model_loader import model_registry
from app.schemas.recommendation import RecommendationResponse, RecommendationItem
from app.db.supabase_client import get_supabase_client

router = APIRouter()

@router.get("/", response_model=RecommendationResponse)
async def get_recommendations(
    recommendation_type: str = Query(..., description="Type of recommendations: players, clubs, agents, coaches"),
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    supabase = Depends(get_supabase_client),
) -> Any:
    """
    Get AI-powered recommendations for the current user
    """
    if recommendation_type not in ["players", "clubs", "agents", "coaches"]:
        raise HTTPException(status_code=400, detail="Invalid recommendation type")
    
    # Get user profile and type
    user_profile = supabase.table("profiles").select("*").eq("id", str(current_user.id)).execute()
    
    if len(user_profile.data) == 0:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    user_type = user_profile.data[0]["user_type"]
    
    # Determine the corresponding details table based on recommendation_type
    details_table = f"{recommendation_type[:-1]}_details"  # e.g., "player_details" for "players"
    
    # Get recommendations from Supabase
    recommended_profiles = supabase.table("profiles").select(
        "*, " + details_table + "(*)"
    ).eq("user_type", recommendation_type[:-1]).neq("id", str(current_user.id)).limit(limit).execute()
    
    # Convert to RecommendationItem objects
    items = []
    for profile in recommended_profiles.data:
        # Calculate a simple recommendation score (in a real app, this would be more sophisticated)
        # In a complete implementation, you would use the ML models here
        score = 0.85  # placeholder score
        
        # Create metadata object based on user type
        metadata = profile.get(f"{recommendation_type[:-1]}_details", {})
        if metadata is None:
            metadata = {}
            
        # Create recommendation item
        item = RecommendationItem(
            id=uuid.UUID(profile["id"]),
            title=profile.get("full_name", "Unknown"),
            description=metadata.get("description", None),
            score=score,
            metadata=metadata
        )
        items.append(item)
    
    return {
        "items": items,
        "total": len(items)
    }
