from gradio_client import Client

try:
    client = Client("multimodalart/Wan2.1-T2V-1.3B")
    print("? Connection Successful! The Cloud is ready.")
except Exception as e:
    print(f"? Connection Failed: {e}")
