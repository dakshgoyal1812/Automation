from fastapi import APIRouter, Request, HTTPException, Query
from fastapi.responses import Response
import httpx
from backend.config import Config
from backend.agent import run_agent

router = APIRouter()

async def send_whatsapp_message(to_number: str, text: str):
    """Utility to send WhatsApp Business messages via Cloud API."""
    if not Config.WHATSAPP_TOKEN or not Config.WHATSAPP_PHONE_NUMBER_ID:
        print(f"[WhatsApp] (Simulated) -> To {to_number}: {text}")
        return False

    url = f"https://graph.facebook.com/v18.0/{Config.WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {Config.WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "text",
        "text": {
            "body": text
        }
    }
    
    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, headers=headers)
        return res.status_code == 200

@router.get("/webhook")
async def whatsapp_webhook_verification(
    mode: str = Query(None, alias="hub.mode"),
    token: str = Query(None, alias="hub.verify_token"),
    challenge: str = Query(None, alias="hub.challenge")
):
    """GET endpoint for Meta Webhook setup verification."""
    if mode and token:
        if mode == "subscribe" and token == Config.WHATSAPP_VERIFY_TOKEN:
            print("[WhatsApp] Webhook verified successfully.")
            return Response(content=challenge, media_type="text/plain")
        else:
            raise HTTPException(status_code=403, detail="Verification token mismatch")
    raise HTTPException(status_code=400, detail="Missing parameters")

@router.post("/webhook")
async def whatsapp_webhook_event(req: Request):
    """POST endpoint to process Meta messaging updates."""
    try:
        data = await req.json()
        entry = data.get("entry", [])
        if not entry:
            return {"status": "empty"}

        changes = entry[0].get("changes", [])
        if not changes:
            return {"status": "empty"}

        value = changes[0].get("value", {})
        messages = value.get("messages", [])
        
        if messages:
            msg = messages[0]
            from_number = msg.get("from")
            text_body = msg.get("text", {}).get("body", "")
            
            if from_number and text_body:
                # Process with LLM agent
                reply = await run_agent(text_body, sass_level="dramatic")
                # Add to pending approvals queue (human-in-the-loop confirmation)
                from backend.approvals_store import add_pending_approval
                add_pending_approval("whatsapp", from_number, text_body, reply)
                
        return {"status": "success"}
    except Exception as e:
        print(f"[Error] WhatsApp Webhook error: {e}")
        return {"status": "error", "message": str(e)}
