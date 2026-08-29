"""
Character-consistent scene image generation using IP-Adapter (no LoRA training, no ComfyUI).

IP-Adapter conditions Stable Diffusion on a reference character image, so every
generated scene keeps the same character identity without training anything.
Reference image: ref_images/characters/<name>/<name>_1.png (already produced by
generate_refs.py). Requires: diffusers, transformers, accelerate, torch, pillow.
"""

import argparse
from pathlib import Path

import torch
from diffusers import StableDiffusionPipeline
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parent.parent

_pipe = None


def load_pipeline():
    """Load SD1.5 + IP-Adapter once and cache it for reuse across calls."""
    global _pipe
    if _pipe is not None:
        return _pipe

    dtype = torch.float16 if torch.cuda.is_available() else torch.float32
    pipe = StableDiffusionPipeline.from_pretrained(
        "runwayml/stable-diffusion-v1-5",
        torch_dtype=dtype,
        safety_checker=None,
    )
    pipe.load_ip_adapter(
        "h94/IP-Adapter",
        subfolder="models",
        weight_name="ip-adapter_sd15.bin",
    )
    pipe.set_ip_adapter_scale(0.6)
    if torch.cuda.is_available():
        pipe = pipe.to("cuda")

    _pipe = pipe
    return pipe


def generate_character_image(
    prompt: str,
    reference_image_path: Path,
    output_path: Path,
    negative_prompt: str = "blurry, low quality, deformed, extra limbs, bad anatomy, different outfit",
    ip_adapter_scale: float = 0.6,
    num_inference_steps: int = 30,
) -> Path:
    """Generate one scene image that keeps the character from reference_image_path consistent."""
    reference_image_path = Path(reference_image_path)
    if not reference_image_path.exists():
        raise FileNotFoundError(
            f"Reference character image not found: {reference_image_path}. "
            f"Run src/generate_refs.py first to create one."
        )

    pipe = load_pipeline()
    pipe.set_ip_adapter_scale(ip_adapter_scale)
    ref_image = Image.open(reference_image_path).convert("RGB")

    result = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        ip_adapter_image=ref_image,
        num_inference_steps=num_inference_steps,
    )
    image = result.images[0]

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path)
    return output_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a character-consistent scene image via IP-Adapter.")
    parser.add_argument("--prompt", required=True, help="Scene visual prompt.")
    parser.add_argument(
        "--reference",
        default=str(REPO_ROOT / "ref_images" / "characters" / "CyberHero" / "CyberHero_1.png"),
        help="Path to the reference character image.",
    )
    parser.add_argument("--output", required=True, help="Where to save the generated image.")
    parser.add_argument("--scale", type=float, default=0.6, help="IP-Adapter identity strength (0-1).")
    args = parser.parse_args()

    out = generate_character_image(
        prompt=args.prompt,
        reference_image_path=Path(args.reference),
        output_path=Path(args.output),
        ip_adapter_scale=args.scale,
    )
    print(f"Saved: {out}")
