
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Path
from sqlalchemy.orm import Session
import uuid
import json

from app.api.dependencies import get_current_active_user, get_db
from app.models.user import User
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageResponse, ConversationResponse

router = APIRouter()

# Store active WebSocket connections
active_connections = {}

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get all conversations for the current user
    """
    # Call the stored procedure to get user conversations
    result = db.execute(
        "SELECT * FROM get_user_conversations(:user_id)",
        {"user_id": current_user.id}
    ).fetchall()
    
    # Convert to ConversationResponse objects
    conversations = []
    for row in result:
        conversations.append(
            ConversationResponse(
                id=row.id,
                other_user_id=row.other_user_id,
                full_name=row.full_name,
                avatar_url=row.avatar_url,
                last_message=row.last_message,
                last_message_time=row.last_message_time,
                unread_count=row.unread_count
            )
        )
    
    return conversations

@router.get("/{recipient_id}", response_model=List[MessageResponse])
async def get_messages(
    recipient_id: uuid.UUID = Path(...),
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get messages between current user and recipient
    """
    # Get the messages
    messages = db.query(Message).filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == recipient_id)) |
        ((Message.sender_id == recipient_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
    
    # Mark unread messages as read
    db.query(Message).filter(
        (Message.sender_id == recipient_id) &
        (Message.receiver_id == current_user.id) &
        (Message.is_read == False)
    ).update({"is_read": True})
    db.commit()
    
    # Return messages in ascending order
    return sorted(messages, key=lambda m: m.created_at)

@router.post("/{recipient_id}", response_model=MessageResponse)
async def send_message(
    recipient_id: uuid.UUID = Path(...),
    message: MessageCreate = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Send a message to a recipient
    """
    # Check if recipient exists
    recipient = db.query(User).filter(User.id == recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    # Create message
    db_message = Message(
        sender_id=current_user.id,
        receiver_id=recipient_id,
        content=message.content,
        is_read=False
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Send notification through WebSocket if recipient is connected
    if str(recipient_id) in active_connections:
        await active_connections[str(recipient_id)].send_text(
            json.dumps({
                "type": "new_message",
                "sender_id": str(current_user.id),
                "content": message.content
            })
        )
    
    return db_message

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint for real-time messaging
    """
    await websocket.accept()
    active_connections[user_id] = websocket
    
    try:
        while True:
            data = await websocket.receive_text()
            # Process received message
            # In a real implementation, you might want to validate the message
            # and save it to the database
            
            # Echo the message back (for testing)
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        if user_id in active_connections:
            del active_connections[user_id]
