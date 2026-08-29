# InfiniLife: Nexus - Complete Setup Guide

## 🚀 Quick Start

### 1. Backend Setup (Python FastAPI)

```bash
# Install dependencies (includes torch/diffusers for IP-Adapter character images)
pip install -r backend/requirements.txt

# Add your API keys
cp backend/.env.example backend/.env
# then edit backend/.env and fill in GROQ_API_KEY and HF_TOKEN

# Run backend
cd backend
python server.py
```

Backend runs on: `http://localhost:8000`

Note: the first request that generates a scene image will download the base
Stable Diffusion model (~4GB) and the IP-Adapter weights from Hugging Face —
this only happens once and needs an internet connection.

### 2. Frontend Setup (Next.js)

```bash
# Install dependencies (if not already done)
npm install

# Run frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 📁 Project Structure

```
genai-dashboard/
├── backend/
│   └── server.py          # FastAPI backend (Groq + Wan2.1)
├── app/
│   ├── (routes)/
│   │   ├── genesis/        # Initial prompt input page
│   │   └── loop/          # Main game loop (video + options)
│   └── api/               # Next.js API routes (proxies to backend)
├── components/
│   ├── VideoPlayer.tsx    # Video display component
│   └── OptionOverlay.tsx  # Choice buttons overlay
└── lib/
    └── utils.ts           # Type definitions & helpers
```

---

## 🔄 How It Works

1. **User enters Genesis prompt** → `/genesis` page
2. **Backend initializes** → Saves state, ready for choices
3. **User picks choice (A/B/C/D/Custom)** → `/loop` page
4. **Backend generates script** → Groq API creates 3-scene story
5. **Backend generates a character-consistent scene image** → IP-Adapter (Stable
   Diffusion + `ref_images/characters/CyberHero/CyberHero_1.png` as reference,
   no LoRA training/ComfyUI needed)
6. **Backend generates video** → Wan 2.1 tries image-to-video from that image,
   falling back to text-to-video if the Space doesn't support it
7. **Backend generates options** → Groq API creates next 4 choices
7. **Frontend displays** → Video plays, options shown
8. **Loop continues** → User picks again, cycle repeats

---

## 🧪 Testing

### Test Backend Directly:
```bash
# Health check
curl http://localhost:8000/

# Initialize game
curl -X POST http://localhost:8000/api/genesis \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A cyberpunk city where AI and humans coexist"}'

# Execute choice
curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"choice": "A"}'
```

### Test Frontend:
1. Open `http://localhost:3000`
2. Navigate to `/genesis`
3. Enter a prompt
4. Go to `/loop`
5. Click a choice button
6. Wait for video generation
7. See new options appear

---

## 🔧 Configuration

### Backend API Keys (in `backend/.env`, see `backend/.env.example`):
- `GROQ_API_KEY`: For script + options generation
- `HF_TOKEN`: For Wan 2.1 video generation

### Frontend Backend URL (in `.env.local`):
```
BACKEND_URL=http://localhost:8000
```

---

## 📝 Notes

- **Video Generation**: Uses Wan 2.1 via Hugging Face (cloud-based, may take 30-60 seconds)
- **Script Generation**: Uses Groq API (fast, ~2-5 seconds)
- **State Management**: Backend saves state to `backend/state/game_state.json`
- **Videos**: Saved to `backend/videos/` directory
- **Scripts**: Saved to `backend/scenes/generated_script.json`

---

## 🐛 Troubleshooting

### Backend won't start:
- Check Python version: `python --version` (needs 3.8+)
- Install dependencies: `pip install -r backend/requirements.txt`
- Check `backend/.env` exists and has `GROQ_API_KEY`/`HF_TOKEN` set (server
  raises a clear `RuntimeError` on startup if either is missing)

### Scene images look inconsistent / generation is slow:
- IP-Adapter runs on CPU if no CUDA GPU is available — this works but is slow
  (a minute or more per image). A GPU speeds this up a lot.
- Consistency depends on `ref_images/characters/CyberHero/CyberHero_1.png`
  existing; if missing, scene images are skipped and video falls back to
  text-to-video only (character consistency is not guaranteed in that case).

### Frontend can't connect:
- Ensure backend is running on port 8000
- Check `.env.local` has `BACKEND_URL=http://localhost:8000`

### Video generation fails:
- Check internet connection (Wan 2.1 is cloud-based)
- Check Groq API keys are valid
- Check backend logs for errors

---

## ✅ Ready to Go!

1. Start backend: `cd backend && python server.py`
2. Start frontend: `npm run dev`
3. Open browser: `http://localhost:3000/genesis`
4. Begin your story! 🎬


