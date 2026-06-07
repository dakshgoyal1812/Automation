from fastapi import APIRouter, Header, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from backend.config import Config

router = APIRouter()

# In-memory store for emails synced from Google Apps Script
synced_emails = []

class EmailPayload(BaseModel):
    id: str
    sender: str
    subject: str
    body: str
    time: str

class EmailListPayload(BaseModel):
    emails: List[EmailPayload]

# Verification Dependency
def verify_bridge_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    # Header format: Bearer <secret>
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
        
    secret = parts[1]
    if secret != Config.GMAIL_BRIDGE_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid Gmail Bridge Secret")

@router.post("/bridge")
async def gmail_bridge_endpoint(payload: EmailListPayload, authenticated: bool = Depends(verify_bridge_token)):
    """Webhook called by Google Apps Script to push unread emails."""
    global synced_emails
    synced_emails = []
    
    for email in payload.emails:
        synced_emails.append({
            "id": email.id,
            "sender": email.sender,
            "avatar": email.sender[0].upper() if email.sender else "G",
            "subject": email.subject,
            "body": email.body,
            "time": email.time,
            "unread": True
        })
        
    print(f"[Gmail] Gmail Bridge: Received and synced {len(payload.emails)} emails from Google Apps Script.")
    return {"status": "success", "synced": len(payload.emails)}

@router.get("/list")
async def list_emails():
    """Returns the current list of emails (used by the dashboard)."""
    return synced_emails

@router.get("/summarize/{email_id}")
async def summarize_email(email_id: str):
    """Summarizes a specific email using Alisa's LLM agent."""
    email = next((e for e in synced_emails if e["id"] == email_id), None)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
        
    from backend.agent import run_agent
    prompt = f"Summarize this email from {email['sender']} about '{email['subject']}':\n{email['body']}"
    
    # Ask Alisa to summarize
    summary = await run_agent(prompt, sass_level="dramatic")
    return {"summary": summary}
