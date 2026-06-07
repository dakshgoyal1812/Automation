import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# In-memory approvals queue
pending_approvals = []

router = APIRouter()

class ApprovalItem(BaseModel):
    id: str
    platform: str
    recipient: str
    original_message: str
    proposed_reply: str

def add_pending_approval(platform: str, recipient: str, original_message: str, proposed_reply: str):
    approval_id = str(uuid.uuid4())
    pending_approvals.append({
        "id": approval_id,
        "platform": platform,
        "recipient": recipient,
        "original_message": original_message,
        "proposed_reply": proposed_reply
    })
    print(f"[Approval] Added pending message to approvals queue (ID: {approval_id}, Platform: {platform})")
    return approval_id

@router.get("/list")
async def list_approvals():
    return pending_approvals

@router.post("/{approval_id}/approve")
async def approve_message(approval_id: str):
    global pending_approvals
    item = next((x for x in pending_approvals if x["id"] == approval_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Approval request not found")

    platform = item["platform"]
    recipient = item["recipient"]
    reply_text = item["proposed_reply"]

    success = False
    try:
        if platform == "telegram":
            from backend.integrations.telegram_bot import send_telegram_message
            success = await send_telegram_message(int(recipient), reply_text)
        elif platform == "whatsapp":
            from backend.integrations.whatsapp import send_whatsapp_message
            success = await send_whatsapp_message(recipient, reply_text)
        elif platform == "instagram":
            from backend.integrations.instagram import send_instagram_dm
            success = await send_instagram_dm(recipient, reply_text)
        elif platform == "discord":
            from backend.integrations.discord_bot import client
            if client and client.is_ready():
                # recipient for discord is the channel ID
                channel = client.get_channel(int(recipient))
                if channel:
                    await channel.send(reply_text)
                    success = True
                else:
                    # try to fetch if not cached
                    channel = await client.fetch_channel(int(recipient))
                    if channel:
                        await channel.send(reply_text)
                        success = True
            else:
                # Simulated mode or client not connected
                print(f"[Discord] (Simulated Approval Send) -> Channel {recipient}: {reply_text}")
                success = True
    except Exception as e:
        print(f"[Error] Failed to send approved message: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to dispatch message: {str(e)}")

    # Remove from queue
    pending_approvals = [x for x in pending_approvals if x["id"] != approval_id]
    return {"status": "success", "sent": success}

@router.post("/{approval_id}/reject")
async def reject_message(approval_id: str):
    global pending_approvals
    item = next((x for x in pending_approvals if x["id"] == approval_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Approval request not found")

    # Simply remove from queue
    pending_approvals = [x for x in pending_approvals if x["id"] != approval_id]
    print(f"[Approval] Rejected and discarded message ID: {approval_id}")
    return {"status": "rejected"}
