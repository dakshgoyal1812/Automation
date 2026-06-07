from fastapi import APIRouter, Request, HTTPException, Query
from fastapi.responses import Response
import httpx
from backend.config import Config
from backend.agent import run_agent

router = APIRouter()

async def send_instagram_dm(recipient_id: str, text: str):
    """Utility to send Instagram DMs via Graph API."""
    if not Config.WHATSAPP_TOKEN: # Reusing Meta Graph API Token (Instagram uses same credentials system)
        print(f"[Instagram] (Simulated) -> To {recipient_id}: {text}")
        return False

    url = "https://graph.facebook.com/v18.0/me/messages"
    headers = {
        "Authorization": f"Bearer {Config.WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "recipient": {"id": recipient_id},
        "message": {"text": text}
    }
    
    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, headers=headers)
        return res.status_code == 200

@router.get("/webhook")
async def instagram_webhook_verification(
    mode: str = Query(None, alias="hub.mode"),
    token: str = Query(None, alias="hub.verify_token"),
    challenge: str = Query(None, alias="hub.challenge")
):
    """GET endpoint for Meta Webhook setup verification (Instagram DMs)."""
    if mode and token:
        if mode == "subscribe" and token == Config.WHATSAPP_VERIFY_TOKEN:
            print("[Instagram] Webhook verified successfully.")
            return Response(content=challenge, media_type="text/plain")
        else:
            raise HTTPException(status_code=403, detail="Verification token mismatch")
    raise HTTPException(status_code=400, detail="Missing parameters")

@router.post("/webhook")
async def instagram_webhook_event(req: Request):
    """POST endpoint to process Meta messaging updates for Instagram."""
    try:
        data = await req.json()
        entry = data.get("entry", [])
        if not entry:
            return {"status": "empty"}

        messaging = entry[0].get("messaging", [])
        if not messaging:
            return {"status": "empty"}

        msg_event = messaging[0]
        sender_id = msg_event.get("sender", {}).get("id")
        text_body = msg_event.get("message", {}).get("text", "")
        
        if sender_id and text_body:
            # Process with LLM agent
            reply = await run_agent(text_body, sass_level="dramatic")
            # Send the response back
            await send_instagram_dm(sender_id, reply)
            
        return {"status": "success"}
    except Exception as e:
        print(f"[Error] Instagram Webhook error: {e}")
        return {"status": "error", "message": str(e)}
