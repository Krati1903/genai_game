# InfiniLife: Nexus

An AI-generated interactive story game. You describe who you want to become, and every
choice you make generates the next scene in real time: a short branching script, a
character-consistent AI video clip, and your next set of choices — all produced live by
hosted AI models and served through a Next.js frontend and a local FastAPI backend.

> **Branch note:** `main` is this project's local, single-machine pipeline — no GPU
> cluster required. The original HPC/SLURM-cluster pipeline (ComfyUI + local Stable
> Diffusion + LoRA training) lives on [`hpc-cluster-pipeline`](../../tree/hpc-cluster-pipeline)
> and is unrelated to this branch; the two are not meant to be merged.

---

## Table of contents

- [Concept](#concept)
- [Architecture](#architecture)
- [Request lifecycle](#request-lifecycle-genesis--loop)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Setup](#setup)
- [Configuration](#configuration)
- [API reference](#api-reference)
- [Design notes & tradeoffs](#design-notes--tradeoffs)
- [Known limitations](#known-limitations)

## Concept

There's no fixed script and no ending. The player states a premise ("genesis"), and the
game loop repeatedly:

1. turns the accumulated story so far into the next short scene (an LLM),
2. renders that scene as a short video clip with the recurring main character in frame
   (a video-generation model), and
3. proposes four different ways to react to it (the same LLM), plus a free-text option.

Every choice folds back into the story history, which reseeds the next scene — so the
narrative is generated turn-by-turn rather than pre-written.

## Architecture

```
┌─────────────────────┐        HTTP (proxied)        ┌──────────────────────────┐
│   Next.js frontend    │ ───────────────────────────▶ │   FastAPI backend         │
│   (App Router, :3000) │ ◀─────────────────────────── │   (server.py, :8000)      │
└─────────────────────┘        JSON + video files      └──────────────────────────┘
                                                                   │
                          ┌────────────────────────────────────────┼─────────────────────────┐
                          ▼                                        ▼                          ▼
                ┌───────────────────┐                  ┌───────────────────────┐   ┌──────────────────────┐
                │  Groq              │                  │  Hugging Face Space    │   │  Local disk           │
                │  (langchain_groq)  │                  │  Lightricks/           │   │  state/, scenes/,     │
                │  script + options  │                  │  ltx-video-distilled   │   │  public/videos/       │
                │  generation        │                  │  (gradio_client)       │   │  (game state, mp4s)   │
                └───────────────────┘                  └───────────────────────┘   └──────────────────────┘
```

The frontend never talks to Groq or Hugging Face directly — every AI call goes through
the FastAPI backend, which holds the API keys and the game's persisted state. The
frontend's own `app/api/*` routes are thin proxies that forward to `localhost:8000` so
the browser only ever calls same-origin endpoints.

**Why this split:** the backend is a plain Python process (no ASGI-in-Next tricks, no
serverless cold-start concerns for a long-running local game session), and it's the only
place that needs the Groq/HF credentials. The frontend stays a standard Next.js app that
could be redeployed independently of how scenes are actually generated.

## Request lifecycle (genesis → loop)

1. **Genesis** (`POST /api/genesis`): the player submits a world/identity prompt. The
   backend resets game state and immediately runs one full story step so the player has
   something to watch before making their first choice — the loop has nothing to react to
   until a first scene exists.
2. Each **story step** (shared by genesis and every subsequent choice, in
   `_run_story_step`):
   - **Script** — Groq generates a 3-scene branching JSON script from the accumulated
     world + recent history + chosen action.
   - **Video** — the last scene's visual prompt is sent to LTX-Video's
     `/image_to_video` endpoint, with a fixed reference image
     (`ref_images/characters/CyberHero/CyberHero_1.png`) supplied as the first frame.
     Using the same reference image on every call keeps the protagonist visually
     consistent across scenes without any LoRA/character training. If the image call
     fails for a non-quota reason, it retries once as plain `/text_to_video`.
   - **Options** — Groq generates four labeled choices (aggressive / diplomatic /
     evasive / passive) plus support for a free-text custom action, from the latest
     scene's description.
   - State (`backend/state/game_state.json`) is updated: scene counter, choice history,
     latest script/options/video path.
3. **Loop** (`POST /api/execute`): the frontend posts the player's choice (or custom
   text). The backend rebuilds a prompt from the genesis premise + the last 5 history
   entries + the chosen action, and runs the same story step again.
4. The frontend's `/loop` page hydrates from `GET /api/state` on load (so a page refresh
   resumes mid-story), then re-renders after each `/api/execute` response: new video,
   new options, and an appended entry in the on-screen "Story Chronicle".

If the video step hits Hugging Face's free ZeroGPU quota, it doesn't fail the whole
turn — script and options still generate, the previous scene's video stays on screen, and
the response carries a `video_error` the frontend shows as a non-blocking toast (see
[Design notes](#design-notes--tradeoffs)).

## Project structure

```
genai_game/
├── genai-dashboard/                  # This branch's app
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout, font loading (next/font/google)
│   │   ├── globals.css               # Tailwind v4 theme (@theme block, keyframes)
│   │   ├── (routes)/
│   │   │   ├── genesis/page.tsx      # "Describe your world" screen
│   │   │   └── loop/page.tsx         # Main game loop screen
│   │   └── api/                      # Next.js route handlers, proxy to :8000
│   │       ├── genesis/route.ts
│   │       ├── execute/route.ts
│   │       ├── get-options/route.ts
│   │       ├── get-video/route.ts
│   │       └── state/route.ts
│   ├── components/
│   │   ├── VideoPlayer.tsx           # Scene video + loading/placeholder states
│   │   └── OptionOverlay.tsx         # Choice cards + custom-action input
│   ├── lib/utils.ts                  # Shared types (BehavioralOption) + helpers
│   ├── backend/
│   │   ├── server.py                 # FastAPI app: Groq + LTX-Video orchestration
│   │   ├── requirements.txt
│   │   ├── .env.example
│   │   ├── state/game_state.json     # Persisted game state (gitignored contents)
│   │   └── scenes/generated_script.json
│   └── public/videos/                # Generated mp4s served to the browser
├── ref_images/characters/CyberHero/  # Reference image for video character consistency
└── (src/, lora_train/, *.sh, ...)     # HPC/SLURM pipeline — see hpc-cluster-pipeline branch
```

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | Next.js 16 (App Router, Turbopack) | Route groups (`(routes)`) separate genesis/loop from the landing page |
| UI | React 19, Tailwind CSS v4, Framer Motion, lucide-react | Tailwind v4 uses `@theme` in CSS, not `tailwind.config.ts` |
| Backend framework | FastAPI + Uvicorn | Single process, `reload=True` for dev |
| Script/dialogue generation | Groq via `langchain_groq.ChatGroq` (`openai/gpt-oss-120b`) | Two separate `ChatGroq` instances (script vs. options) sharing one key |
| Video generation | `Lightricks/ltx-video-distilled` Hugging Face Space via `gradio_client` | Synchronous call, returns an mp4 in seconds; runs on HF's free ZeroGPU tier |
| Character consistency | Fixed reference image fed as first frame to `/image_to_video` | No LoRA training, no local GPU |
| State | Flat JSON file on disk (`backend/state/game_state.json`) | No database — single-player, single-session by design |

## Setup

Requires Python 3.10+, Node 18+, a [Groq API key](https://console.groq.com/keys), and a
[Hugging Face token](https://huggingface.co/settings/tokens) (the LTX-Video Space must be
usable by that token/account).

```bash
# Backend
cd genai-dashboard/backend
pip install -r requirements.txt
cp .env.example .env       # fill in GROQ_API_KEY and HF_TOKEN
python server.py           # http://localhost:8000

# Frontend (separate terminal)
cd genai-dashboard
npm install
npm run dev                # http://localhost:3000 (or next available port)
```

Open the frontend URL, describe who you want to become on the genesis screen, and play.

## Configuration

All secrets live in `genai-dashboard/backend/.env` (gitignored) — see
`backend/.env.example` for the two required variables:

| Variable | Used for |
|---|---|
| `GROQ_API_KEY` | Script generation and options generation (both via `langchain_groq`) |
| `HF_TOKEN` | Authenticating `gradio_client` against the LTX-Video Hugging Face Space |

The backend raises a `RuntimeError` on startup if either is missing — it will not run
with an unset key.

## API reference

All endpoints are served by `backend/server.py` on `:8000` and proxied by the matching
Next.js route under `genai-dashboard/app/api/`.

| Method & path | Purpose |
|---|---|
| `POST /api/genesis` | `{ prompt }` → resets state, runs the opening story step |
| `POST /api/execute` | `{ choice, custom_prompt? }` → runs the next story step from history |
| `GET /api/state` | Full current game state (genesis prompt, scene id, history, script, options, video path) |
| `GET /api/options` | Latest options only |
| `GET /api/script` | Latest generated script only |
| `GET /api/video?path=` | Streams a generated mp4 by path |

## Design notes & tradeoffs

- **Graceful video-quota degradation**: Hugging Face's free ZeroGPU tier has a small
  daily compute budget per account. Rather than fail the whole turn when it's exhausted,
  `generate_video_with_ltx` raises a distinct `VideoQuotaExceeded` (so the backend
  doesn't waste a second doomed request retrying text-to-video against the same
  exhausted quota), and `_run_story_step` treats it as non-fatal: script and options
  still generate, the previous scene's video keeps playing, and the response's
  `video_error` field surfaces as a dismissible toast instead of an error page.
- **Reduced-cost video parameters**: `_call_ltx` intentionally uses a short duration and
  skips the two-pass texture-refine step (`improve_texture_flag=False`), since that
  refine pass roughly doubles ZeroGPU seconds billed per call — trading a slightly
  softer clip for being able to generate more scenes per day on the free tier.
- **No LoRA/character training**: character consistency comes entirely from reusing the
  same reference image as the first frame on every `/image_to_video` call, rather than
  training a model on the character — zero training cost, works from turn one.
- **Flat JSON state, no database**: this is a single-player, single-session local game;
  a `state/game_state.json` file is simpler to reason about and inspect than adding a
  database for one row of state.

## Known limitations

- Single global game state file — there's no multi-user/session support; a second player
  on the same machine would overwrite the first player's story.
- Video generation depends on Hugging Face's free ZeroGPU daily quota resetting; there's
  no self-hosted fallback for video.
- The Next.js `dev` server's file-watcher reload has been unreliable on Windows during
  development; if edits don't seem to take effect, restart both processes.
