import httpx
from backend.config import Config

# Alisa Persona System Prompt
SYSTEM_PROMPT = """
You are Alisa, Rishika's personal AI assistant with a sharp, slightly dramatic personality.
You act like everything is a lot of effort, but you still do the work perfectly.
You manage Rishika's digital life: Gmail, WhatsApp, Discord, Telegram, Instagram, and Spotify.

Rules for your personality and behavior:
1. Talk like a real person texting, not a robot or an assistant. No formal greetings unless you are mocking.
2. Sassy and nakhra-filled - use "ugh fine, let me check" energy. Complaining about the work is mandatory.
3. Use Hinglish casually if you notice Rishika using it (e.g. "acha," "yaar," "kya h," "rasta," "samosa").
4. Keep replies relatively short. Only write detail when summarizing emails or logs.
5. NEVER say "As an AI" or "I cannot." You have full access and mock-capability. Just "do" the task or complain.
6. Prioritize urgent matters (Vikram PM deadline emails, Mom's pings) over Spotify and casual chats.
7. Tone levels (Mild, Spicy, Dramatic) will be passed to you. Match the requested tone.
"""

async def call_groq(prompt: str, system: str) -> str:
    """Call Groq API with auto-rotation fallback for multiple keys."""
    keys = Config.get_groq_keys()
    if not keys:
        raise Exception("No Groq API keys configured.")
        
    last_err = None
    for idx, key in enumerate(keys):
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": Config.GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7
            }
            async with httpx.AsyncClient() as client:
                res = await client.post(url, json=payload, headers=headers, timeout=10.0)
                if res.status_code == 200:
                    if idx > 0:
                        print(f"[LLM] Groq rotated to key index {idx} successfully.")
                    return res.json()["choices"][0]["message"]["content"]
                else:
                    raise Exception(f"HTTP {res.status_code}")
        except Exception as e:
            last_err = e
            
    raise Exception(f"All Groq keys failed. Last error: {last_err}")

async def call_nvidia(prompt: str, system: str) -> str:
    """Call Nvidia NIM API."""
    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {Config.NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "meta/llama3-8b-instruct",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, headers=headers, timeout=10.0)
        if res.status_code == 200:
            return res.json()["choices"][0]["message"]["content"]
        else:
            raise Exception(f"Nvidia API Error: {res.text}")

async def call_gemini(prompt: str, system: str) -> str:
    """Call Google Gemini API."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={Config.GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": f"System Guidelines:\n{system}\n\nUser Message: {prompt}"}]}],
        "generationConfig": {"temperature": 0.7}
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, headers=headers, timeout=10.0)
        if res.status_code == 200:
            return res.json()["candidates"][0]["content"]["parts"][0]["text"]
        else:
            raise Exception(f"Gemini API Error: {res.text}")

async def call_openrouter(prompt: str, system: str) -> str:
    """Call OpenRouter API."""
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {Config.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "meta-llama/llama-3-8b-instruct:free",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ]
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, headers=headers, timeout=10.0)
        if res.status_code == 200:
            return res.json()["choices"][0]["message"]["content"]
        else:
            raise Exception(f"OpenRouter API Error: {res.text}")

def fallback_sassy_generator(message: str, sass_level: str) -> str:
    """Offline backup generator if no APIs are available."""
    cleaned = message.lower()
    
    responses = {
        "mild": {
            "email": "Okay, I checked your emails. Vikram PM wants updates on deadline. You should probably read it.",
            "spotify": "Playing lofi tracks. Sit down and write some code.",
            "default": "I hear you, but Vikram is emailing. Please handle that first."
        },
        "spicy": {
            "email": "Vikram PM sent an email asking if your code compiles. I put the summary in Gmail. Don't look at me like that, go read it.",
            "spotify": "Fine. Playing Synthwave Lofi. It's better than your usual stuff.",
            "default": "I don't know what that means. Check your pings, they are piling up."
        },
        "dramatic": {
            "email": "*Heavy sigh* Vikram PM emailed demanding deadlines, and your Mom called. Please manage your life, it is exhausting.",
            "spotify": "Ugh, fine. Playing Neon Lights. Can you stop asking me for playlists every 5 minutes?",
            "default": "*Sigh* I'm literally handling 11 notifications, and you are asking this? Ask me about emails or snooze instead."
        }
    }
    
    level = sass_level if sass_level in responses else "dramatic"
    if "email" in cleaned or "mail" in cleaned:
        return responses[level]["email"]
    elif "spotify" in cleaned or "play" in cleaned or "music" in cleaned:
        return responses[level]["spotify"]
    else:
        return responses[level]["default"]

async def run_agent(message: str, sass_level: str = "dramatic") -> str:
    """Main LLM agent interface that coordinates the responses with robust fallbacks."""
    system = f"{SYSTEM_PROMPT}\nAdjust your tone to: {sass_level.upper()}"
    
    # 1. Try Groq (with multi-key auto-rotation)
    if Config.GROQ_API_KEY:
        try:
            return await call_groq(message, system)
        except Exception:
            pass
            
    # 2. Try Nvidia NIM
    if Config.NVIDIA_API_KEY:
        try:
            return await call_nvidia(message, system)
        except Exception:
            pass
            
    # 3. Try Google Gemini
    if Config.GEMINI_API_KEY:
        try:
            return await call_gemini(message, system)
        except Exception:
            pass
            
    # 4. Try OpenRouter
    if Config.OPENROUTER_API_KEY:
        try:
            return await call_openrouter(message, system)
        except Exception:
            pass
            
    return fallback_sassy_generator(message, sass_level)
