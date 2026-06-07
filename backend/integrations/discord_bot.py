import asyncio
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import discord
from backend.config import Config

router = APIRouter()

# Discord Client configuration
intents = discord.Intents.default()
intents.message_content = True
client = None

if Config.DISCORD_BOT_TOKEN:
    client = discord.Client(intents=intents)

    @client.event
    async def on_ready():
        print(f"[Discord] Bot logged in as {client.user.name} (ID: {client.user.id})")

    @client.event
    async def on_message(message):
        # Ignore messages from the bot itself
        if message.author == client.user:
            return

        # Respond to Direct Messages sassily
        if isinstance(message.channel, discord.DMChannel):
            from backend.agent import run_agent
            reply = await run_agent(message.content, sass_level="dramatic")
            # Add to pending approvals queue (human-in-the-loop confirmation)
            from backend.approvals_store import add_pending_approval
            add_pending_approval("discord", str(message.channel.id), message.content, reply)

async def start_discord_bot():
    """Background startup loop for the Discord Bot Client."""
    if client and Config.DISCORD_BOT_TOKEN:
        try:
            # Login and start gateway connection
            await client.start(Config.DISCORD_BOT_TOKEN)
        except Exception as e:
            print(f"[Error] Discord Gateway Error: {e}")

class AnnouncementPayload(BaseModel):
    title: str
    content: str
    channel_id: Optional[int] = None



@router.post("/announce")
async def discord_announce(payload: AnnouncementPayload):
    """API endpoint to post announcements via the bot client."""
    if not Config.DISCORD_BOT_TOKEN:
        print(f"[Discord] Bot (Simulated) Broadcast: **{payload.title}** - {payload.content}")
        return {"status": "simulated", "posted": payload.title}
        
    if not client or not client.is_ready():
        raise HTTPException(status_code=503, detail="Discord client is not ready or connected")

    try:
        # Fallback to a default channel or use provided ID
        channel_id = payload.channel_id
        if not channel_id:
            # Find the first text channel the bot has access to
            for guild in client.guilds:
                for channel in guild.text_channels:
                    if channel.permissions_for(guild.me).send_messages:
                        channel_id = channel.id
                        break
                if channel_id:
                    break
        
        if not channel_id:
            raise Exception("No sendable text channels found.")
            
        channel = client.get_channel(channel_id)
        if channel:
            embed = discord.Embed(title=payload.title, description=payload.content, color=0xc343ff)
            embed.set_footer(text="Broadcast via Alisa Command Center")
            await channel.send(embed=embed)
            return {"status": "success", "channel": channel.name}
            
        raise HTTPException(status_code=404, detail="Discord channel not found")
    except Exception as e:
        print(f"[Error] Discord announce error: {e}")
        return {"status": "error", "message": str(e)}
