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
##SBATCH --gres=gpu:1
#SBATCH --gres=gpu:1g.10gb:1 

# --- ENVIRONMENT SETUP ---

# Load the CUDA module
module load cuda/12.3

# Activate your Conda environment
source /home/saurabhgaikwad/genai_game/bin/activate

#verify the python activated
which python
python --version

echo "Job started on $(hostname) at $(date)"
echo "User: $USER"

# Set the Groq API key
# !!! REPLACE THE TEXT INSIDE THE QUOTES WITH YOUR ACTUAL, SECRET GROQ API KEY !!!
export GROQ_API_KEY="gsk_85ZknaRazut1Ydu0Dm5KWGdyb3FYgtsfWeqNFIpdQikoutZdQh56_"

# Run the Python script
python /home/saurabhgaikwad/KRATI/genai_game_pipeline/src/generate_refs.py

echo "Job Completed at $(date)"

## Navigate to your project directory
## cd /home/saurabhgaikwad/KRATI/genai_game_pipeline

#for deactivate
deactivate











