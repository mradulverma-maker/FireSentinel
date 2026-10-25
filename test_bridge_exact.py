import requests
from dotenv import load_dotenv
import os

load_dotenv('local_worker/.env')
BRIDGE_URL = os.getenv("BRIDGE_URL")

try:
    print(f"Connecting to {BRIDGE_URL}...")
    res = requests.post(BRIDGE_URL, json={"action": "GET_DATA"}, timeout=30)
    print("Status:", res.status_code)
    try:
        print("JSON data:", res.json())
    except:
        print("Text response:", res.text[:200])
except Exception as e:
    print(f"Failed: {e}")
