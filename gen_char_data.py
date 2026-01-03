import json
import urllib.request
import time

def queue_prompt(prompt_struct):
    p = {"prompt": prompt_struct}
    data = json.dumps(p).encode('utf-8')
    req = urllib.request.Request("http://127.0.0.1:8188/prompt", data=data)
    return urllib.request.urlopen(req).read()

with open("/home/saurabhgaikwad/KRATI/genai_game_pipeline/ComfyUI/workflow_api.json", "r") as f:
    workflow = json.load(f)

# SETTINGS: Define your character here
char_description = "a brave knight with glowing blue eyes, silver plate armor, red cape, short blonde hair, game character concept art"

workflow["3"]["inputs"]["text"] = char_description
workflow["1"]["inputs"]["ckpt_name"] = "v1-5-pruned-emaonly.safetensors"
workflow["4"]["inputs"]["model"] = ["1", 0] # Direct connection bypassing LoRA

print("Generating 20 character images...")
for i in range(20):
    workflow["4"]["inputs"]["seed"] = 500 + i # Unique seed for variety
    queue_prompt(workflow)
    print(f"Queued {i+1}/20")
    time.sleep(0.5)
