# InfiniLife: Nexus

An AI-generated interactive story game. You describe who you want to become, and every
choice you make generates the next scene in real time — a short branching script (Groq),
a character-consistent AI video clip (LTX-Video), and your next set of choices — served
through a Next.js frontend and a local FastAPI backend.

> **Branch note:** this is the `local-only-setup` branch. It runs entirely on a single
> Windows machine with no GPU cluster required — Groq and LTX-Video both run remotely
> on their own hosted infrastructure. The original HPC/SLURM-cluster pipeline (ComfyUI +
> local Stable Diffusion + LoRA training) lives on `main` and is unrelated to this branch;
> the two are not meant to be merged.

## How it works

1. **Genesis** — you describe an identity/world. The backend immediately generates the
   opening scene: a 3-scene branching script (Groq), a video for it (LTX-Video, using
   `ref_images/characters/CyberHero/CyberHero_1.png` as the first frame so the main
   character stays visually consistent across every scene with zero LoRA training), and
   your first 4 choices (Groq).
2. **Loop** — you pick a choice (or write your own). The backend repeats the same
   script → video → options cycle based on your story so far, and the frontend shows the
   new scene.
3. This repeats indefinitely — there's no fixed ending, just an ongoing branching story.

Everything Groq and LTX-Video need runs on their own hosted infrastructure (Groq API,
a Hugging Face Space), so no local GPU is required to play.

## Project structure

```
genai_game/
├── genai-dashboard/          # The actual app for this branch
│   ├── app/                  # Next.js pages + API routes (proxy to the backend)
│   ├── components/           # VideoPlayer, OptionOverlay, etc.
│   └── backend/              # FastAPI backend (Groq + LTX-Video via gradio_client)
├── ref_images/                # Reference character image used for video consistency
├── src/, lora_train/, scenes/,
│   *.sh, requirements.txt     # Original HPC/SLURM pipeline (ComfyUI, local SD, LoRA
│                              # training) - main branch's approach, not used here
```

For setup, environment variables, and troubleshooting specific to the app, see
[`genai-dashboard/README.md`](genai-dashboard/README.md).

## Quick start

```bash
# Backend
cd genai-dashboard/backend
pip install -r requirements.txt
cp .env.example .env   # fill in GROQ_API_KEY and HF_TOKEN
python server.py       # http://localhost:8000

# Frontend (separate terminal)
cd genai-dashboard
npm install
npm run dev             # http://localhost:3000 (or next available port)
```

Open the frontend URL, describe who you want to become, and play.

## Notes

- **Video generation** runs on Hugging Face's free ZeroGPU tier, which has a small daily
  quota per account. If it's exhausted, the game keeps going — script and choices still
  generate, the previous scene's video stays on screen, and a banner explains video will
  resume once the quota resets (see `genai-dashboard/README.md` for details).
- **Character consistency** comes from feeding the same reference image into LTX-Video's
  image-to-video call as the first frame of every scene — no model training involved.
