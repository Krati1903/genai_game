#!/bin/bash
#SBATCH --job-name=ComfyUI_Server
#SBATCH --partition=gpu          # Check your cluster's partition name
#SBATCH --gres=gpu:1             # Request 1 GPU
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=4
#SBATCH --mem=32G
#SBATCH --time=04:00:00
#SBATCH --output=comfy_server_%j.log

# Activate your environment
source /home/saurabhgaikwad/genai_game/bin/activate

# Navigate to ComfyUI directory
cd /home/saurabhgaikwad/KRATI/genai_game_pipeline/ComfyUI

# Launch ComfyUI and allow it to listen to requests from the login node
# --listen 0.0.0.0 is the most important part here
python main.py --listen 0.0.0.0 --port 8188 --front-end-version Comfy-Org/ComfyUI_frontend@latest
