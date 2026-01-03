#!/bin/bash
#SBATCH --job-name=GPU_Driver_Test
#SBATCH --output=driver-test-%j.out
#SBATCH --nodes=1
#SBATCH --cpus-per-task=4
#SBATCH --mem=40G
#SBATCH --time=00:10:00
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1

# --- DRIVER VISIBILITY FIX ---
# Load the system CUDA libraries FIRST
module load cuda/12.3 

# Activate the stable environment (Python 3.10)
source /home/saurabhgaikwad/miniconda3/etc/profile.d/conda.sh
conda activate game_stable

# Ensure the system CUDA libraries are exposed to the environment
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$CUDA_HOME/lib64:$CUDA_HOME/lib

# --- EXECUTION ---
cd /home/saurabhgaikwad/KRATI/genai_game_pipeline
python src/check_gpu.py
