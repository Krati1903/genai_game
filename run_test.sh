#!/bin/bash
#SBATCH --job-name=LoRA_Test
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1
#SBATCH --time=00:05:00
#SBATCH --output=test_output.out

source /home/saurabhgaikwad/genai_game/bin/activate
export HF_HUB_OFFLINE=1
python /home/saurabhgaikwad/KRATI/genai_game_pipeline/src/test_lora.py
