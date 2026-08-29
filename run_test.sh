#!/bin/bash
# Run the LoRA test script locally.
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export HF_HUB_OFFLINE=1
python "$REPO_ROOT/src/test_lora.py"
