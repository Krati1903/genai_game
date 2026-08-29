#!/usr/bin/env python3
"""
InfiniLife: Nexus - Local Backend
- Groq (langchain_groq) for script generation
- Wan 2.1 (Hugging Face) via gradio_client for video generation
"""

import os
import sys
import json
import shutil
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from gradio_client import Client

# repo_root/src holds generate_scene_image.py (IP-Adapter character-consistent images)
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))
from generate_scene_image import generate_character_image  # noqa: E402

# Load GROQ_API_KEY / HF_TOKEN from backend/.env if present (copy backend/.env.example).
load_dotenv(Path(__file__).resolve().parent / ".env")

# Hugging Face token must be set in the environment (e.g. via .env.local / shell export).
# Never hardcode real tokens in source.
if not os.environ.get("HF_TOKEN"):
    raise RuntimeError("HF_TOKEN environment variable is not set. Set it before starting the backend.")

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════════════════════

BASE_DIR = Path(__file__).resolve().parent
STATE_DIR = BASE_DIR / "state"
SCENES_DIR = BASE_DIR / "scenes"
# Store generated videos directly in the frontend public/videos folder
VIDEOS_DIR = BASE_DIR.parent / "public" / "videos"
SCENE_IMAGES_DIR = STATE_DIR / "scene_images"

STATE_DIR.mkdir(exist_ok=True)
SCENES_DIR.mkdir(exist_ok=True)
VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
SCENE_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Reference image used by IP-Adapter to keep the main character visually consistent
# across scenes (produced once by src/generate_refs.py, no training required).
REFERENCE_CHARACTER_IMAGE = REPO_ROOT / "ref_images" / "characters" / "CyberHero" / "CyberHero_1.png"

# Groq keys must be set in the environment (e.g. via .env.local / shell export).
SCRIPT_GROQ_KEY = os.environ.get("GROQ_API_KEY")
OPTIONS_GROQ_KEY = os.environ.get("GROQ_API_KEY")
if not SCRIPT_GROQ_KEY or not OPTIONS_GROQ_KEY:
    raise RuntimeError("GROQ_API_KEY environment variable is not set. Set it before starting the backend.")

MODEL = "llama-3.3-70b-versatile"

script_llm = ChatGroq(model=MODEL, temperature=0.7, groq_api_key=SCRIPT_GROQ_KEY)
options_llm = ChatGroq(model=MODEL, temperature=0.7, groq_api_key=OPTIONS_GROQ_KEY)

# Wan 2.1 client (Hugging Face) - use official space + HF token from env
HF_TOKEN = os.environ.get("HF_TOKEN")
# Use 'token' instead of 'hf_token' for older Gradio Client versions
wan_client = Client("Wan-AI/Wan2.1", token=HF_TOKEN)

# ═══════════════════════════════════════════════════════════════════════════════
# PROMPTS (based on your script.py)
# ═══════════════════════════════════════════════════════════════════════════════

SCRIPT_PROMPT = """
You are a cinematic game director. Generate a branching 3-scene story based on the user prompt.
Output ONLY a JSON array of objects.
Each object MUST have:
  "scene_id": (int),
  "description": (short summary),
  "visual_prompt": (Detailed SD prompt, MUST include the word 'CyberHero'),
  "camera": (angle),
  "action": (what happens)

User prompt: {user_prompt}
"""

OPTIONS_PROMPT = """
You are a narrative designer for an interactive story game.
Based on the current scene, generate 4 distinct choices for the player.

Scene description: {scene_description}

Generate 4 choices:
- A: Aggressive/Confrontational
- B: Diplomatic/Negotiating
- C: Evasive/Stealthy
- D: Passive/Observant

Output ONLY JSON:
{{
  "scene_summary": "What just happened",
  "options": [
    {{ "id": "A", "label": "Short title", "description": "Action", "hint": "Consequence hint" }},
    {{ "id": "B", "label": "Short title", "description": "Action", "hint": "Consequence hint" }},
    {{ "id": "C", "label": "Short title", "description": "Action", "hint": "Consequence hint" }},
    {{ "id": "D", "label": "Short title", "description": "Action", "hint": "Consequence hint" }}
  ]
}}
"""

# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class GenesisRequest(BaseModel):
    prompt: str

class ChoiceRequest(BaseModel):
    choice: str  # "A" | "B" | "C" | "D" | "Custom"
    custom_prompt: Optional[str] = None

# ═══════════════════════════════════════════════════════════════════════════════
# STATE HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

STATE_FILE = STATE_DIR / "game_state.json"

def load_state() -> Dict:
    if STATE_FILE.exists():
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "genesis_prompt": "",
        "current_scene": 0,
        "history": [],
        "current_script": None,
        "current_options": None,
        "current_video": None,
    }

def save_state(state: Dict) -> None:
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def get_choice_label(choice: str) -> str:
    return {
        "A": "Aggressive / Confrontational",
        "B": "Diplomatic / Negotiating",
        "C": "Evasive / Stealthy",
        "D": "Passive / Observant",
        "Custom": "Custom Action",
    }.get(choice, "Unknown")

# ═══════════════════════════════════════════════════════════════════════════════
# CORE LOGIC
# ═══════════════════════════════════════════════════════════════════════════════

def generate_script_from_groq(user_prompt: str) -> List[Dict]:
    """Your original script.py logic, wrapped for API."""
    formatted_prompt = SCRIPT_PROMPT.format(user_prompt=user_prompt)
    resp = script_llm.invoke(formatted_prompt)
    text = resp.content

    try:
        start = text.find('[')
        end = text.rfind(']') + 1
        json_text = text[start:end]
        return json.loads(json_text)
    except Exception as e:
        print(f"❌ JSON parsing failed. Raw output: {text}")
        raise e

def generate_options_from_groq(scene_description: str) -> Dict:
    formatted_prompt = OPTIONS_PROMPT.format(scene_description=scene_description)
    resp = options_llm.invoke(formatted_prompt)
    text = resp.content
    try:
        start = text.find('{')
        end = text.rfind('}') + 1
        json_text = text[start:end]
        return json.loads(json_text)
    except Exception as e:
        print(f"❌ Options JSON parsing failed. Raw output: {text}")
        raise e

def generate_scene_image(prompt_text: str, scene_id: int) -> Optional[Path]:
    """
    Generate a character-consistent scene image via IP-Adapter (no LoRA/ComfyUI needed).
    Returns None (and lets the caller fall back to text-only video) if this fails —
    e.g. no GPU, model not downloaded yet, or reference image missing.
    """
    if not REFERENCE_CHARACTER_IMAGE.exists():
        print(f"⚠️ No reference character image at {REFERENCE_CHARACTER_IMAGE}, skipping image-conditioning.")
        return None
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = SCENE_IMAGES_DIR / f"scene_{scene_id}_{ts}.png"
    try:
        return generate_character_image(
            prompt=prompt_text,
            reference_image_path=REFERENCE_CHARACTER_IMAGE,
            output_path=output_path,
        )
    except Exception as e:
        print(f"⚠️ Scene image generation failed, falling back to text-only video: {e}")
        return None


def generate_video_with_wan(prompt_text: str, scene_image_path: Optional[Path] = None) -> str:
    """
    Call Wan 2.1 via Hugging Face to generate video; return local path.
    If scene_image_path is given, try image-to-video first (keeps the character from
    the image); if the Space's /predict endpoint doesn't accept an image, fall back
    to plain text-to-video so this never hard-fails.
    """
    print(f"🎬 Generating video for: {prompt_text}")
    result_path = None
    if scene_image_path is not None:
        try:
            result_path = wan_client.predict(
                prompt=prompt_text,
                negative_prompt="blurry, low quality",
                image=str(scene_image_path),
                api_name="/predict",
            )
        except Exception as e:
            print(f"⚠️ Image-to-video call failed ({e}), retrying as text-to-video.")
            result_path = None

    if result_path is None:
        result_path = wan_client.predict(
            prompt=prompt_text,
            negative_prompt="blurry, low quality",
            api_name="/predict",
        )

    # result_path is local file path from gradio_client; move into VIDEOS_DIR
    src = Path(result_path)
    if not src.exists():
        return result_path  # fallback, maybe still accessible
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest = VIDEOS_DIR / f"scene_{ts}.mp4"
    shutil.move(str(src), str(dest))
    print(f"✅ Video moved to: {dest}")
    return str(dest)

# ═══════════════════════════════════════════════════════════════════════════════
# FASTAPI APP
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(title="InfiniLife: Nexus Local Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/generate-video")
async def generate_video(prompt: str):
    """
    Simple video-generation endpoint (no game state), using Wan 2.1 via gradio_client.
    Saves output into the frontend public/videos folder and returns a public URL.
    """
    # Ensure videos directory exists
    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)

    # Generate a character-consistent image first (IP-Adapter), then try image-to-video
    scene_image_path = generate_scene_image(prompt, scene_id=0)
    result = None
    if scene_image_path is not None:
        try:
            result = wan_client.predict(
                prompt=prompt,
                negative_prompt="blurry, low quality",
                image=str(scene_image_path),
                api_name="/predict",
            )
        except Exception as e:
            print(f"⚠️ Image-to-video call failed ({e}), retrying as text-to-video.")
            result = None
    if result is None:
        result = wan_client.predict(
            prompt=prompt,
            negative_prompt="blurry, low quality",
            api_name="/predict",
        )

    # Move to frontend public/videos as a stable filename
    filename = "latest_scene.mp4"
    dest = VIDEOS_DIR / filename
    shutil.move(result, str(dest))

    # Frontend can serve this from /videos/latest_scene.mp4
    return {"url": f"/videos/{filename}"}


@app.get("/")
def root():
    return {"status": "ok", "message": "InfiniLife backend running"}

@app.post("/api/genesis")
def api_genesis(body: GenesisRequest):
    """Set the initial world / genesis prompt and generate first options."""
    state = load_state()
    state["genesis_prompt"] = body.prompt
    state["current_scene"] = 0
    state["history"] = []
    state["current_script"] = None
    state["current_options"] = None
    state["current_video"] = None
    save_state(state)
    return {"success": True, "message": "Genesis set", "genesis_prompt": body.prompt}

@app.post("/api/execute")
def api_execute(body: ChoiceRequest):
    """
    Main loop step:
    - Take user choice (+ optional custom prompt)
    - Build a story prompt (using genesis + history)
    - Call Groq to generate script array
    - Take last scene's visual_prompt → call Wan 2.1 → get video
    - Call Groq again to generate next 4 options
    """
    state = load_state()
    if not state["genesis_prompt"]:
        raise HTTPException(400, "Genesis prompt not set. Call /api/genesis first.")

    # 1) Build high-level user_prompt for Groq based on genesis + history + choice
    history_text = " → ".join(
        f"Scene {h['scene_id']}: {h.get('choice_label','')}"
        for h in state["history"][-5:]
    ) or "Beginning of story"

    choice_label = get_choice_label(body.choice)
    user_prompt = (
        f"World: {state['genesis_prompt']}. "
        f"Recent events: {history_text}. "
        f"Next action: {choice_label}."
    )
    if body.custom_prompt:
        user_prompt += f" Custom player instruction: {body.custom_prompt}"

    # 2) Generate script scenes from Groq
    try:
        script_scenes = generate_script_from_groq(user_prompt)
    except Exception as e:
        raise HTTPException(500, f"Script generation failed: {e}")

    # Save script to disk like your original script.py
    SCENES_DIR.mkdir(exist_ok=True)
    script_path = SCENES_DIR / "generated_script.json"
    with open(script_path, "w", encoding="utf-8") as f:
        json.dump(script_scenes, f, indent=2, ensure_ascii=False)

    # 3) Choose a scene (e.g. first or last) for video prompt
    scene_for_video = script_scenes[-1]
    visual_prompt = scene_for_video["visual_prompt"]

    # 4) Generate a character-consistent scene image (IP-Adapter), then the video via Wan 2.1
    scene_image_path = generate_scene_image(visual_prompt, state["current_scene"] + 1)
    try:
        video_path = generate_video_with_wan(visual_prompt, scene_image_path)
    except Exception as e:
        raise HTTPException(500, f"Video generation failed: {e}")

    # 5) Generate next options from Groq (based on scene description)
    try:
        options = generate_options_from_groq(scene_for_video["description"])
    except Exception as e:
        raise HTTPException(500, f"Options generation failed: {e}")

    # 6) Update state
    state["current_scene"] += 1
    state["history"].append(
        {
            "scene_id": state["current_scene"],
            "timestamp": datetime.now().isoformat(),
            "choice": body.choice,
            "choice_label": choice_label,
        }
    )
    state["current_script"] = script_scenes
    state["current_options"] = options
    state["current_video"] = video_path
    save_state(state)

    # Return everything frontend needs
    return {
        "success": True,
        "scene_id": state["current_scene"],
        "script": script_scenes,
        "options": options,
        "video_path": video_path,  # local path, use /api/video?path=...
    }

@app.get("/api/options")
def api_options():
    state = load_state()
    return state.get("current_options") or {"options": [], "scene_summary": "No scene yet."}

@app.get("/api/script")
def api_script():
    state = load_state()
    return {"script": state.get("current_script") or []}

@app.get("/api/video")
def api_video(path: str = Query(..., description="Local video path returned by /api/execute")):
    p = Path(path)
    if not p.is_absolute():
        p = VIDEOS_DIR / p.name
    if not p.exists():
        raise HTTPException(404, "Video not found")
    return FileResponse(p, media_type="video/mp4")

@app.get("/api/state")
def api_state():
    return load_state()

if __name__ == "__main__":
    import uvicorn

    print("=== InfiniLife Backend (Groq + Wan2.1) ===")
    print(f"Base dir : {BASE_DIR}")
    print(f"State dir: {STATE_DIR}")
    print(f"Videos   : {VIDEOS_DIR}")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)


