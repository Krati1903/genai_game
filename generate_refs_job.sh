#!/bin/bash
# Generate character/environment reference images locally.
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Require the Groq API key from the environment rather than embedding it.
export GROQ_API_KEY="${GROQ_API_KEY:?set this in your environment}"

echo "Job started on $(hostname) at $(date)"

python "$REPO_ROOT/src/generate_refs.py"

echo "Job completed at $(date)"
