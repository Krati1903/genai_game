import json
import requests
import os
from pathlib import Path

# --- CONFIGURATION ---
REPO_ROOT = Path(__file__).resolve().parent.parent
SCRIPT_JSON = REPO_ROOT / "scenes" / "generated_script.json"
WORKFLOW_JSON = REPO_ROOT / "ComfyUI" / "workflow_api.json"
COMFY_API_URL = "http://127.0.0.1:8188/prompt"
PROMPT_NODE_ID = "3"
SAVE_NODE_ID = "10"

# --- THE BRIDGE LOGIC ---
def queue_prompt(prompt):
    p = {"prompt": prompt}
    data = json.dumps(p).encode('utf-8')
    requests.post(COMFY_API_URL, data=data)

with open(SCRIPT_JSON, 'r') as f:
    scenes = json.load(f)

with open(WORKFLOW_JSON, 'r') as f:
    workflow = json.load(f)

print(f"🚀 Found {len(scenes)} scenes. Sending to ComfyUI...")

for scene in scenes:
    # Update the prompt text
    workflow[PROMPT_NODE_ID]["inputs"]["text"] = f"CyberHero, {scene['visual_prompt']}"
    # Update filename
    workflow[SAVE_NODE_ID]["inputs"]["filename_prefix"] = f"Scene_{scene['scene_id']}"
    # Ensure the new required fields exist
    workflow[SAVE_NODE_ID]["inputs"]["pingpong"] = False
    workflow[SAVE_NODE_ID]["inputs"]["save_output"] = True
    
    queue_prompt(workflow)
    print(f"✅ Scene {scene['scene_id']} Queued!")
    
COMFY_API_URL = "http://127.0.0.1:8188/prompt"
