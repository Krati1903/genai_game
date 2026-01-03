#!/bin/bash
#SBATCH --job-name=LoRA_Train
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=32G
#SBATCH --time=02:00:00
#SBATCH --output=lora_train_%j.out

# Load Environment
module load cuda/12.3
source /home/saurabhgaikwad/genai_game/bin/activate

# THE KEY: POINT TO THE PHYSICAL DIRECTORY
MODEL_DIR="/home/saurabhgaikwad/.cache/huggingface/hub/models--runwayml--stable-diffusion-v1-5/snapshots/451f4fe16113bff5a5d2269ed5ad43b0592e9a14"
TRAIN_DATA_DIR="/home/saurabhgaikwad/KRATI/genai_game_pipeline/lora_train/img"
OUTPUT_DIR="/home/saurabhgaikwad/KRATI/genai_game_pipeline/lora_train/model"

# ENSURE OFFLINE MODE IS ACTIVE
export HF_HUB_OFFLINE=1
export TRANSFORMERS_OFFLINE=1

echo "🚀 Starting LoRA Training with Local Path..."

python -m accelerate.commands.launch \
  --num_cpu_threads_per_process 8 \
  /home/saurabhgaikwad/KRATI/genai_game_pipeline/src/sd-scripts/train_network.py \
  --pretrained_model_name_or_path="$MODEL_DIR" \
  --train_data_dir="$TRAIN_DATA_DIR" \
  --output_dir="$OUTPUT_DIR" \
  --output_name="CyberHero_LoRA" \
  --resolution=512,512 \
  --train_batch_size=1 \
  --learning_rate=1e-4 \
  --max_train_steps=2000 \
  --network_module=networks.lora \
  --network_dim=32 \
  --network_alpha=16 \
  --save_every_n_epochs=1 \
  --mixed_precision="fp16" \
  --save_precision="fp16"

echo "✅ Training Complete! Model saved in $OUTPUT_DIR"

