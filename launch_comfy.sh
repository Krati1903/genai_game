#!/bin/bash
# Launch a local ComfyUI server.
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$REPO_ROOT/ComfyUI"
python main.py --listen 127.0.0.1 --port 8188 --front-end-version Comfy-Org/ComfyUI_frontend@latest
