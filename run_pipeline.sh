#!/bin/bash
# Run the local ComfyUI pipeline: start ComfyUI, then run the bridge script.
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Debug: Check if Python can actually use the video nodes
echo "--- LIBRARY CHECK ---"
python -c "import cv2; import imageio; print('Video libraries are loadable')" || echo "Video libraries FAILED to load"

# 2. Start ComfyUI (single instance)
cd "$REPO_ROOT/ComfyUI"
python main.py --listen 127.0.0.1 --port 8188 --disable-auto-launch &
SERVER_PID=$!

# 3. Wait for the server to fully warm up
echo "Waiting 90s for node registration..."
sleep 90

# 4. Run the bridge
python "$REPO_ROOT/src/comfy_bridge.py"

# 5. Stay alive
wait $SERVER_PID
