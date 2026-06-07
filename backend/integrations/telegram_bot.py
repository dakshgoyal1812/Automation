from fastapi import APIRouter, Request, HTTPException
import httpx
from backend.config import Config
from backend.agent import run_agent

router = APIRouter()

async def send_telegram_message(chat_id: int, text: str):
    """Utility to send messages to a Telegram Chat."""
    if not Config.TELEGRAM_BOT_TOKEN:
        print(f"[Telegram] Bot (Simulated) -> To Chat {chat_id}: {text}")
        return False
        
    url = f"https://api.telegram.org/bot{Config.TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload)
        return res.status_code == 200

@router.post("/webhook")
async def telegram_webhook(req: Request):
    """Webhook endpoint registered with Telegram Bot API."""
    if not Config.TELEGRAM_BOT_TOKEN:
        raise HTTPException(status_code=400, detail="Telegram Bot Token is not configured.")
        
    try:
        data = await req.json()
        message = data.get("message", {})
        chat = message.get("chat", {})
        chat_id = chat.get("id")
        text = message.get("text", "")
        
        if chat_id and text:
            # Process with our sassy assistant Alisa
            reply = await run_agent(text, sass_level="dramatic")
            # Reply back to Telegram chat
            await send_telegram_message(chat_id, reply)
            
        return {"status": "ok"}
    except Exception as e:
        print(f"[Error] Telegram Webhook error: {e}")
        return {"status": "error", "detail": str(e)}
