import torch
from diffusers import StableDiffusionPipeline
import os

# 1. Define Paths
model_path = "/home/saurabhgaikwad/.cache/huggingface/hub/models--runwayml--stable-diffusion-v1-5/snapshots/451f4fe16113bff5a5d2269ed5ad43b0592e9a14"
lora_dir = "/home/saurabhgaikwad/KRATI/genai_game_pipeline/lora_train/model"
lora_name = "CyberHero_LoRA.safetensors"
output_path = "/home/saurabhgaikwad/KRATI/genai_game_pipeline/test_output.png"

# 2. Create the 'pipe' object (This must come FIRST)
print("🚀 Loading Base Model...")
pipe = StableDiffusionPipeline.from_pretrained(
    model_path, 
    torch_dtype=torch.float16, 
    local_files_only=True
).to("cuda")

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

