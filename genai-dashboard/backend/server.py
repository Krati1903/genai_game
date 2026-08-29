#!/usr/bin/env python3
"""
InfiniLife: Nexus - Local Backend
- Groq (langchain_groq) for script generation
- LTX-Video (Lightricks/ltx-video-distilled on Hugging Face) via gradio_client
  for video generation: image-to-video from the CyberHero reference image keeps
  the character consistent in every scene without LoRA training or a local GPU.
"""

import os
import sys
import json
import shutil
from datetime import datetime

# Windows consoles default to cp1252, which can't encode the emoji used in
# log messages below and crashes with UnicodeEncodeError - force UTF-8.
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)
    sys.stderr.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)
from pathlib import Path
from typing import List, Dict, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from dotenv import load_dotenv

# Load env vars (GROQ_API_KEY / HF_TOKEN / HF_HOME) from backend/.env before anything
# below imports huggingface_hub/diffusers/torch, since HF_HOME is read at import time.
load_dotenv(Path(__file__).resolve().parent / ".env")

from langchain_groq import ChatGroq
from gradio_client import Client, handle_file

REPO_ROOT = Path(__file__).resolve().parent.parent.parent

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

STATE_DIR.mkdir(exist_ok=True)
SCENES_DIR.mkdir(exist_ok=True)
VIDEOS_DIR.mkdir(parents=True, exist_ok=True)

# Reference image fed to LTX image-to-video as the first frame of every scene,
# which keeps the main character visually consistent with zero training.
REFERENCE_CHARACTER_IMAGE = REPO_ROOT / "ref_images" / "characters" / "CyberHero" / "CyberHero_1.png"

# Groq keys must be set in the environment (e.g. via .env.local / shell export).
SCRIPT_GROQ_KEY = os.environ.get("GROQ_API_KEY")
OPTIONS_GROQ_KEY = os.environ.get("GROQ_API_KEY")
if not SCRIPT_GROQ_KEY or not OPTIONS_GROQ_KEY:
    raise RuntimeError("GROQ_API_KEY environment variable is not set. Set it before starting the backend.")

MODEL = "openai/gpt-oss-120b"

script_llm = ChatGroq(model=MODEL, temperature=0.7, groq_api_key=SCRIPT_GROQ_KEY)
options_llm = ChatGroq(model=MODEL, temperature=0.7, groq_api_key=OPTIONS_GROQ_KEY)

# LTX-Video distilled Space (free, synchronous, returns the mp4 in seconds).
# Wan-AI/Wan2.1 was abandoned: its async queue reports progress but never
# delivers a video through the API on the free tier.
HF_TOKEN = os.environ.get("HF_TOKEN")
LTX_SPACE = "Lightricks/ltx-video-distilled"
ltx_client = Client(LTX_SPACE, token=HF_TOKEN)

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

def _call_ltx(prompt_text: str, image_path: Optional[Path] = None):
    """
    Call the LTX-Video distilled Space. With an image, uses /image_to_video so the
    character in that image is the video's first frame (visual consistency for
    free); otherwise /text_to_video. Both are synchronous and return
    ({'video': <local mp4 path>, ...}, seed) in seconds.
    """
    common = dict(
        negative_prompt="worst quality, inconsistent motion, blurry, jittery, distorted",
        input_video_filepath="",
        height_ui=512,
        width_ui=512,
        duration_ui=2,
        ui_frames_to_use=9,
        seed_ui=42,
        randomize_seed=True,
        ui_guidance_scale=1,
        improve_texture_flag=True,
    )
    if image_path is not None:
        return ltx_client.predict(
            prompt=prompt_text,
            input_image_filepath=handle_file(str(image_path)),
            mode="image-to-video",
            api_name="/image_to_video",
            **common,
        )
    return ltx_client.predict(
        prompt=prompt_text,
        input_image_filepath="",
        mode="text-to-video",
        api_name="/text_to_video",
        **common,
    )


def _extract_file_path(result) -> str:
    """
    gradio_client results vary by Space: a plain path string, or a tuple/list/dict
    (e.g. (video, seed)) when the endpoint returns multiple outputs. Pull out the
    first item that looks like a real file path.
    """
    items = result if isinstance(result, (list, tuple)) else [result]
    for item in items:
        if isinstance(item, str) and Path(item).exists():
            return item
        if isinstance(item, dict):
            candidate = item.get("video") or item.get("path")
            if isinstance(candidate, str) and Path(candidate).exists():
                return candidate
    raise RuntimeError(f"No usable file path in LTX result: {result!r}")


def generate_video_with_ltx(prompt_text: str) -> str:
    """
    Generate the scene video via LTX-Video, using the CyberHero reference image
    as the first frame (image-to-video) for character consistency. Falls back to
    text-to-video if the image call fails or the reference is missing.
    """
    print(f"🎬 Generating video for: {prompt_text}")
    result = None
    if REFERENCE_CHARACTER_IMAGE.exists():
        try:
            result = _call_ltx(prompt_text, image_path=REFERENCE_CHARACTER_IMAGE)
        except Exception as e:
            print(f"⚠️ Image-to-video call failed ({e}), retrying as text-to-video.")
            result = None
    if result is None:
        result = _call_ltx(prompt_text)
    result_path = _extract_file_path(result)

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
    Simple video-generation endpoint (no game state), using LTX-Video via gradio_client.
    Saves output into the frontend public/videos folder and returns a public URL.
    """
    # Ensure videos directory exists
    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)

    result_path = generate_video_with_ltx(prompt)

    # Move to frontend public/videos as a stable filename
    filename = "latest_scene.mp4"
    dest = VIDEOS_DIR / filename
    shutil.move(result_path, str(dest))

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
    - Take last scene's visual_prompt → call LTX-Video → get video
    - Call Groq again to generate next 4 options
    """
    print("▶ /api/execute: start", flush=True)
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
    print("▶ /api/execute: calling Groq for script...", flush=True)
    try:
        script_scenes = generate_script_from_groq(user_prompt)
    except Exception as e:
        raise HTTPException(500, f"Script generation failed: {e}")
    print("▶ /api/execute: script done", flush=True)

    # Save script to disk like your original script.py
    SCENES_DIR.mkdir(exist_ok=True)
    script_path = SCENES_DIR / "generated_script.json"
    with open(script_path, "w", encoding="utf-8") as f:
        json.dump(script_scenes, f, indent=2, ensure_ascii=False)

    # 3) Choose a scene (e.g. first or last) for video prompt
    scene_for_video = script_scenes[-1]
    visual_prompt = scene_for_video["visual_prompt"]

    # 4) Generate the scene video via LTX image-to-video (character-consistent:
    #    the CyberHero reference image is the video's first frame)
    print("▶ /api/execute: calling LTX video...", flush=True)
    try:
        video_path = generate_video_with_ltx(visual_prompt)
    except Exception as e:
        raise HTTPException(500, f"Video generation failed: {e}")
    print("▶ /api/execute: video done", flush=True)

    # 5) Generate next options from Groq (based on scene description)
    print("▶ /api/execute: calling Groq for options...", flush=True)
    try:
        options = generate_options_from_groq(scene_for_video["description"])
    except Exception as e:
        raise HTTPException(500, f"Options generation failed: {e}")
    print("▶ /api/execute: options done", flush=True)

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

    print("=== InfiniLife Backend (Groq + LTX-Video) ===")
    print(f"Base dir : {BASE_DIR}")
    print(f"State dir: {STATE_DIR}")
    print(f"Videos   : {VIDEOS_DIR}")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)


