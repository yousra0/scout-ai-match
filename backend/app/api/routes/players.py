
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.orm import Session
import uuid

from app.api.dependencies import get_current_active_user, get_db
from app.models.user import User
from app.models.player import PlayerProfile
from app.schemas.player import PlayerProfileCreate, PlayerProfileResponse, PlayerProfileUpdate

router = APIRouter()

@router.get("/", response_model=List[PlayerProfileResponse])
async def get_players(
    skip: int = 0,
    limit: int = 100,
    position: Optional[str] = None,
    age_min: Optional[int] = None,
    age_max: Optional[int] = None,
    db: Session = Depends(get_db),
) -> Any:
    """
    Get all player profiles with optional filtering
    """
    query = db.query(PlayerProfile)
    
    # Apply filters if provided
    if position:
        query = query.filter(PlayerProfile.position == position)
    if age_min is not None:
        query = query.filter(PlayerProfile.age >= age_min)
    if age_max is not None:
        query = query.filter(PlayerProfile.age <= age_max)
    
    players = query.offset(skip).limit(limit).all()
    return players

@router.get("/{player_id}", response_model=PlayerProfileResponse)
async def get_player(
    player_id: uuid.UUID = Path(...),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific player profile
    """
    player = db.query(PlayerProfile).filter(PlayerProfile.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@router.post("/", response_model=PlayerProfileResponse)
async def create_player_profile(
    player_in: PlayerProfileCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Create a new player profile for the current user
    """
    # Check if user already has a player profile
    existing_profile = db.query(PlayerProfile).join(PlayerProfile.profile).filter(
        Profile.user_id == current_user.id
    ).first()
    
    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="User already has a player profile"
        )
    
    # Create new profile
    # This is a simplified version, in real application you would create a Profile first
    # if it doesn't exist, then create the PlayerProfile
    
    return {}

@router.put("/{player_id}", response_model=PlayerProfileResponse)
async def update_player_profile(
    player_id: uuid.UUID = Path(...),
    player_in: PlayerProfileUpdate = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update a player profile
    """
    # In a real implementation, check if the user owns this profile
    
    return {}
