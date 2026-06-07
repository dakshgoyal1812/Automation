import os
import asyncio
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from backend.config import Config
# Validate configurations on startup
Config.validate()

app = FastAPI(
    title="Alisa Personal AI Assistant Backend",
    description="Railway-deployable API Hub orchestrating Spotify, Gmail, WhatsApp, Discord, Telegram, and Instagram integrations."
)

# API Status Health Check
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "assistant": "Alisa",
        "live_mode": True
    }

# Mock API chat model
class ChatRequest(BaseModel):
    message: str
    sass_level: str

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    # This will route to the agent.py logic. For now, a helper placeholder.
    from backend.agent import run_agent
    reply = await run_agent(req.message, req.sass_level)
    return {"reply": reply}

# Import integration routers
# (We will create these routers in the next steps)
from backend.integrations.gmail import router as gmail_router
from backend.integrations.spotify import router as spotify_router
from backend.integrations.telegram_bot import router as telegram_router
from backend.integrations.whatsapp import router as whatsapp_router
from backend.integrations.instagram import router as instagram_router
from backend.integrations.discord_bot import router as discord_router
from backend.approvals_store import router as approvals_router

app.include_router(gmail_router, prefix="/api/gmail", tags=["Gmail"])
app.include_router(spotify_router, prefix="/api/spotify", tags=["Spotify"])
app.include_router(telegram_router, prefix="/api/telegram", tags=["Telegram"])
app.include_router(whatsapp_router, prefix="/api/whatsapp", tags=["WhatsApp"])
app.include_router(instagram_router, prefix="/api/instagram", tags=["Instagram"])
app.include_router(discord_router, prefix="/api/discord", tags=["Discord"])
app.include_router(approvals_router, prefix="/api/approvals", tags=["Approvals"])

# Serve static dashboard files
# Root path returns index.html
@app.get("/")
async def serve_index():
    index_path = os.path.join("static", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return JSONResponse(
        status_code=404,
        content={"error": "Dashboard files missing from static/ directory. Please run the project setup."}
    )

# Mount static folder
app.mount("/", StaticFiles(directory="static"), name="static")

# Startup hook to launch background services
@app.on_event("startup")
async def startup_event():
    # If Discord token is set, launch Discord bot in background
    if Config.DISCORD_BOT_TOKEN:
        try:
            from backend.integrations.discord_bot import start_discord_bot
            # Launch without blocking the main event loop
            asyncio.create_task(start_discord_bot())
            print("[Discord] Alisa Assistant: Discord bot initialized in background.")
        except Exception as e:
            print(f"[Error] Failed to start Discord bot background task: {e}")
    else:
        print("[Discord] Alisa Assistant: DISCORD_BOT_TOKEN missing. Discord integration will run in simulation mode.")
