<div align="center">

# ⚡ AI Automation Hub — FastAPI Agent Orchestration & Workflow Automation

**Autonomous Agents. Human-in-the-Loop. Cloud Integration.**  
*A powerful Python & FastAPI backend system coordinating autonomous AI agent execution, Discord bot integrations, Spotify automation, and Google Workspace automations.*

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dakshgoyal1812/Automation)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_|_Uvicorn-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](Dockerfile)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br/>

> **AI Automation Hub** acts as a central control plane for executing autonomous multi-step agent tasks with human approval mechanisms, Spotify playlist controls, Discord notifications, and Google Apps Script triggers.

<br/>

</div>

---

## ✨ Features

- 🤖 **Autonomous AI Agent Core**: Intelligent task decomposition, function calling, and self-executing workflows (`agent.py`).
- 🛡️ **Human-in-the-Loop Approvals**: Sensitive actions (e.g. sending emails or file modifications) trigger approval requests (`approvals_store.py`).
- 🎵 **Spotify API Automation**: Control playback, search songs, and manage playlists programmatically (`spotipy`).
- 🎮 **Discord Bot Gateway**: Interactive command dispatch and real-time execution alerts via `discord.py`.
- 📊 **Google Apps Script Bridge**: Automated data ingestion and synchronization with Google Sheets & Docs.
- 🐳 **Cloud-Ready**: Includes `Dockerfile` and `render.yaml` for instant cloud deployment on Render.

---

## 🛠️ Tech Stack

- **Backend Framework**: Python 3.11+, FastAPI, Uvicorn (ASGI)
- **HTTP Client**: HTTPX (Asynchronous HTTP)
- **Integrations**: `discord.py`, `spotipy` (Spotify Web API), Google Apps Script (GAS)
- **Environment & Security**: `python-dotenv`, CORS middleware
- **Deployment**: Docker, Render (`render.yaml`)

---

## 🗂️ Project Structure

```bash
Automation/
├── backend/
│   ├── main.py             # FastAPI entry point & API routes
│   ├── agent.py            # AI agent logic & tool executors
│   ├── config.py           # Environment variables & system configuration
│   ├── approvals_store.py  # Pending human-in-the-loop approval state
│   └── integrations/       # Discord, Spotify & 3rd party modules
├── google-apps-script/     # Google Sheets/Docs automation scripts
├── static/                 # Frontend dashboard assets
├── .env.example            # Template for environment configuration
├── Dockerfile              # Docker container build script
├── render.yaml             # Render cloud infrastructure blueprint
├── requirements.txt        # Python package dependencies
└── README.md               # Documentation
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/dakshgoyal1812/Automation.git
cd Automation
```

### 2. Create a virtual environment & install dependencies
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env` and fill in your API credentials:
```bash
cp .env.example .env
```

### 4. Run the FastAPI Server
```bash
uvicorn backend.main:app --reload --port 8000
```
Open **`http://localhost:8000/docs`** for interactive Swagger API documentation.

---

## 👨‍💻 Author

**Daksh Goyal**  
* GitHub: [@dakshgoyal1812](https://github.com/dakshgoyal1812)  
* Portfolio: [my-cv-rosy-psi.vercel.app](https://my-cv-rosy-psi.vercel.app)
