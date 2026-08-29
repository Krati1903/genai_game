#!/bin/bash
# Train a LoRA locally. Run from the repo root with your Python env already active.
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Point this at your local Stable Diffusion base model (HF cache dir, local path, or repo id).
MODEL_DIR="${SD_MODEL_PATH:-runwayml/stable-diffusion-v1-5}"
TRAIN_DATA_DIR="$REPO_ROOT/lora_train/img"
OUTPUT_DIR="$REPO_ROOT/lora_train/model"

echo "Starting LoRA training..."

python -m accelerate.commands.launch \
  --num_cpu_threads_per_process 8 \
  "$REPO_ROOT/src/sd-scripts/train_network.py" \
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

echo "Training complete. Model saved in $OUTPUT_DIR"
