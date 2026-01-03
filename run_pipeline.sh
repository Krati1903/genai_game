#!/bin/bash
#SBATCH --job-name=GenAI_Final_Fix
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1
#SBATCH --time=00:30:00
#SBATCH --output=pipeline_%j.log

source /home/saurabhgaikwad/genai_game/bin/activate

# 1. Setup FFmpeg correctly
export FFMPEG_DIR="/home/saurabhgaikwad/genai_game/lib/python3.11/site-packages/imageio_ffmpeg/binaries"
ln -sf "$FFMPEG_DIR/ffmpeg-linux-x86_64-v7.0.2" "$FFMPEG_DIR/ffmpeg"
export PATH="$FFMPEG_DIR:$PATH"

# 2. Debug: Check if Python can actually use the video nodes
echo "--- LIBRARY CHECK ---"
python -c "import cv2; import imageio; print('✅ Video Libraries are Loadable')" || echo "❌ Video Libraries FAILED to load"

# 3. Clean environment
export GIT_PYTHON_REFRESH=quiet
pkill -u $USER python
sleep 2

# 4. Start ComfyUI (single instance)
cd /home/saurabhgaikwad/KRATI/genai_game_pipeline/ComfyUI
python main.py --listen 127.0.0.1 --port 8188 --disable-auto-launch &
SERVER_PID=$!

# 5. Wait for the server to fully warm up
echo "Waiting 90s for Node Registration..."
sleep 90

# 6. Run the Bridge
python /home/saurabhgaikwad/KRATI/genai_game_pipeline/src/comfy_bridge.py

# 7. Stay alive
wait $SERVER_PID