import json
import urllib.request

def queue_prompt(prompt_struct):
    p = {"prompt": prompt_struct}
    data = json.dumps(p).encode('utf-8')
    req = urllib.request.Request("http://127.0.0.1:8188/prompt", data=data)
    return urllib.request.urlopen(req).read()

# Load the API workflow
with open("/home/saurabhgaikwad/KRATI/genai_game_pipeline/ComfyUI/workflow_api.json", "r") as f:
    workflow = json.load(f)

# Update values based on your specific JSON IDs
# Node 3 is your Prompt, Node 2 is your LoRA
workflow["3"]["inputs"]["text"] = "a beautiful game character, cinematic lighting, high quality"
workflow["2"]["inputs"]["lora_name"] = "your_trained_lora_v1.safetensors"

print("Sending calibrated workflow to ComfyUI...")
try:
    response = queue_prompt(workflow)
    print("SUCCESS! Prompt accepted.")
    print("Wait ~60 seconds for the image to appear in ComfyUI/output/")
except Exception as e:
    print(f"Failed to queue: {e}")
