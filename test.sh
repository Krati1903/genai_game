#!/bin/bash
# ----------------------------------------------------------------------
# SLURM JOB SCRIPT: Generate Character and Environment Reference Images
# ----------------------------------------------------------------------

# --- SLURM RESOURCE REQUESTS ---
# Job Info
#SBATCH --job-name=GenAI_Ref_Gen
#SBATCH --output=slurm-%j.out

# Hardware Allocation (Confirmed by CDAC)
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=4
#SBATCH --mem=40G
#SBATCH --time=00:30:00
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1

# --- ENVIRONMENT SETUP ---

# Load the CUDA module
module load cuda/12.3

# Activate your Conda environment
source /home/saurabhgaikwad/miniconda3/etc/profile.d/conda.sh
conda activate genai_game_env

# Navigate to your project directory
cd /home/saurabhgaikwad/KRATI/genai_game_pipeline

# --- EXECUTION ---

# Set the Groq API key
# !!! REPLACE THE TEXT INSIDE THE QUOTES WITH YOUR ACTUAL, SECRET GROQ API KEY !!!
export GROQ_API_KEY="gsk_85ZknaRazut1Ydu0Dm5KWGdyb3FYgtsfWeqNFIpdQikoutZdQh56_"

# Run the Python script
python /home/saurabhgaikwad/KRATI/genai_game_pipeline/test.py

# Optional: Deactivate the environment
conda deactivate

