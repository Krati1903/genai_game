import os
import json
from pathlib import Path
import torch
from diffusers import StableDiffusionPipeline
from prompt_templates import character_prompt, environment_prompt

def load_sd_model():
    print("Loading Stable Diffusion model from local cache...")
    model_id = "runwayml/stable-diffusion-v1-5"
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id,
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        local_files_only=True
    )
    if torch.cuda.is_available():
        pipe = pipe.to("cuda")
    return pipe

def generate_images(pipe, name, description, base_dir, count=20):
    folder = os.path.join(base_dir, f"ref_images/characters/{name}")
    os.makedirs(folder, exist_ok=True)
    print(f"\n🚀 FORCING GENERATION: {name}")
    
    # We use a direct prompt to avoid any template errors
    prompt = f"A high-quality 3D game character, {name}, {description}, cinematic lighting, masterpiece, 8k"
    
    for i in range(count):
        image = pipe(prompt, num_inference_steps=30).images[0]
        image.save(f"{folder}/{name}_{i+1}.png")
        print(f"✅ Saved image {i+1}/20 to {folder}")

if __name__ == "__main__":
    BASE_PATH = str(Path(__file__).resolve().parent.parent)
    
    # HARDCODED CHARACTER TO BYPASS PARSER ERRORS
    char_name = "CyberHero"
    char_desc = "futuristic warrior in sleek carbon fiber armor, glowing blue neon accents"
    
    pipe = load_sd_model()
    generate_images(pipe, char_name, char_desc, BASE_PATH, count=20)

    print("\n✔ Generation complete! Check the ref_images folder now.")
