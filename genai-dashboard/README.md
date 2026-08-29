# InfiniLife: Nexus - Complete Setup Guide

## 🚀 Quick Start

### 1. Backend Setup (Python FastAPI)

```bash
# Install dependencies
pip install fastapi uvicorn langchain-groq gradio_client

# Run backend
cd backend
python server.py
```

Backend runs on: `http://localhost:8000`

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
5. **Backend generates video** → Wan 2.1 creates video from visual_prompt
6. **Backend generates options** → Groq API creates next 4 choices
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

### Backend API Keys (in `backend/server.py`):
- `SCRIPT_GROQ_KEY`: For script generation
- `OPTIONS_GROQ_KEY`: For options generation

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
- Install dependencies: `pip install -r requirements.txt`

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


