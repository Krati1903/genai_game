#!/bin/bash
# Quick local GPU driver / environment sanity check.
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

python "$REPO_ROOT/src/check_gpu.py"
