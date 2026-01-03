import torch
import os

print("--- GPU CHECK START ---")
print(f"CUDA PATH: {os.environ.get('CUDA_HOME')}")
print(f"Torch Version: {torch.__version__}")
print(f"Cuda Available: {torch.cuda.is_available()}")

if torch.cuda.is_available():
    # This is the line that failed previously
    print(f"Current Device: {torch.cuda.current_device()}")
    print(f"Device Name: {torch.cuda.get_device_name(0)}")
    print("--- GPU CHECK SUCCESSFUL! ---")
else:
    print("--- GPU CHECK FAILED: CUDA NOT AVAILABLE TO TORCH ---")
