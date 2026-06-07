from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from backend.config import Config

router = APIRouter()

# Spotify OAuth Setup
sp_oauth = None
if Config.SPOTIFY_CLIENT_ID and Config.SPOTIFY_CLIENT_SECRET:
    sp_oauth = SpotifyOAuth(
        client_id=Config.SPOTIFY_CLIENT_ID,
        client_secret=Config.SPOTIFY_CLIENT_SECRET,
        redirect_uri=Config.SPOTIFY_REDIRECT_URI,
        scope="user-modify-playback-state user-read-playback-state user-read-currently-playing"
    )

def get_spotify_client():
    if not sp_oauth:
        return None
    token_info = sp_oauth.get_cached_token()
    if token_info:
        return spotipy.Spotify(auth=token_info['access_token'])
    return None

@router.get("/login")
async def spotify_login():
    """Redirects to Spotify login page."""
    if not sp_oauth:
        return {"error": "Spotify integration credentials not configured in backend .env."}
    auth_url = sp_oauth.get_authorize_url()
    return RedirectResponse(auth_url)

@router.get("/callback")
async def spotify_callback(code: str):
    """Callback redirected from Spotify."""
    if not sp_oauth:
        return RedirectResponse("/")
    token_info = sp_oauth.get_access_token(code)
    if token_info:
        print("[Spotify] OAuth authentication completed successfully.")
    return RedirectResponse("/")

class PlaybackRequest(BaseModel):
    track_title: str

@router.post("/play")
async def spotify_play(req: PlaybackRequest):
    """Play a track by title."""
    sp = get_spotify_client()
    if not sp:
        print(f"[Spotify] (Simulated): Playing track: {req.track_title}")
        return {"status": "simulated", "playing": req.track_title}
        
    try:
        results = sp.search(q=req.track_title, limit=1, type="track")
        tracks = results.get("tracks", {}).get("items", [])
        if not tracks:
            raise HTTPException(status_code=404, detail="Track not found on Spotify")
            
        track_uri = tracks[0]["uri"]
        sp.start_playback(uris=[track_uri])
        return {"status": "success", "playing": tracks[0]["name"]}
    except Exception as e:
        print(f"[Warning] Spotify API Error: {e}")
        return {"status": "fallback_simulated", "playing": req.track_title}

@router.post("/pause")
async def spotify_pause():
    """Pause playback."""
    sp = get_spotify_client()
    if not sp:
        return {"status": "simulated", "action": "paused"}
    try:
        sp.pause_playback()
        return {"status": "success"}
    except Exception as e:
        return {"status": "simulated_fallback", "error": str(e)}

@router.post("/volume")
async def spotify_volume(level: int):
    """Adjust playback volume."""
    sp = get_spotify_client()
    if not sp:
        return {"status": "simulated", "volume": level}
    try:
        sp.volume(level)
        return {"status": "success"}
    except Exception as e:
        return {"status": "simulated_fallback", "error": str(e)}
