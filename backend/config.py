import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    PORT = int(os.getenv("PORT", 8000))
    
    # LLM Settings
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

    @classmethod
    def get_groq_keys(cls) -> list:
        if not cls.GROQ_API_KEY:
            return []
        return [k.strip() for k in cls.GROQ_API_KEY.split(",") if k.strip()]
    
    # Google Apps Script Gmail Bridge
    GMAIL_BRIDGE_SECRET = os.getenv("GMAIL_BRIDGE_SECRET", "default_secret")
    
    # Telegram Bot Settings
    TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
    
    # Discord Client Settings
    DISCORD_BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")
    
    # WhatsApp Cloud API Settings
    WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
    WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
    WHATSAPP_VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "verify_alisa")
    
    # Spotify API Settings
    SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
    SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI", "http://localhost:8000/api/spotify/callback")

    @classmethod
    def validate(cls):
        """Prints warnings for unset critical tokens."""
        missing = []
        if not cls.GROQ_API_KEY and not cls.GEMINI_API_KEY and not cls.OPENROUTER_API_KEY and not cls.NVIDIA_API_KEY:
            missing.append("At least one LLM API Key (GROQ_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, NVIDIA_API_KEY)")
        if not cls.TELEGRAM_BOT_TOKEN:
            missing.append("TELEGRAM_BOT_TOKEN")
        if not cls.DISCORD_BOT_TOKEN:
            missing.append("DISCORD_BOT_TOKEN")
        if not cls.SPOTIFY_CLIENT_ID or not cls.SPOTIFY_CLIENT_SECRET:
            missing.append("SPOTIFY credentials (SPOTIFY_CLIENT_ID/SECRET)")
            
        if missing:
            print(f"[Warning] Alisa Assistant Warning: Missing configuration values in .env: {', '.join(missing)}")
            print("Assistant will run in simulation mode for these services.")
        else:
            print("[Success] Alisa Assistant: Environment variables verified successfully.")
