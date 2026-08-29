#!/bin/bash
# Run test.py locally.
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Require the Groq API key from the environment rather than embedding it.
export GROQ_API_KEY="${GROQ_API_KEY:?set this in your environment}"

python "$REPO_ROOT/test.py"
