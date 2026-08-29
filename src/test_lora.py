import torch
from diffusers import StableDiffusionPipeline
import os
from pathlib import Path

# 1. Define Paths
REPO_ROOT = Path(__file__).resolve().parent.parent
# Set to the local HF cache snapshot dir for runwayml/stable-diffusion-v1-5,
# or a local model directory/HF repo id.
model_path = os.environ.get("SD_MODEL_PATH", "runwayml/stable-diffusion-v1-5")
lora_dir = str(REPO_ROOT / "lora_train" / "model")
lora_name = "CyberHero_LoRA.safetensors"
output_path = str(REPO_ROOT / "test_output.png")

# 2. Create the 'pipe' object (This must come FIRST)
print("🚀 Loading Base Model...")
pipe = StableDiffusionPipeline.from_pretrained(
    model_path,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    local_files_only=True
)
pipe = pipe.to("cuda") if torch.cuda.is_available() else pipe

# 3. Inject the LoRA (Now 'pipe' exists, so this will work)
print(f"🔌 Injecting {lora_name}...")
pipe.load_lora_weights(lora_dir, weight_name=lora_name)

# 4. Generate the Image
print("🎨 Generating Image...")
prompt = "A cinematic shot of CyberHero standing in a rainy neon-lit alleyway, futuristic armor glowing blue, 8k, masterpiece"
negative_prompt = "blurry, low quality, distorted, face markings, bad anatomy"

image = pipe(prompt, negative_prompt=negative_prompt, num_inference_steps=30, guidance_scale=7.5).images[0]

image.save(output_path)
print(f"✅ Success! Test image saved to: {output_path}")

