import requests
import json
import time
import random
import os
from dotenv import load_dotenv
from gmail_manager import GmailManager
from ai_polisher import AIPolisher

load_dotenv()

BRIDGE_URL = os.getenv("BRIDGE_URL") 

def run_bridge_worker():
    print("Initializing components...")
    polisher = AIPolisher()
    print("AI Initialized.")
    
    inbox_clients = {
        os.getenv("GMAIL_USER1"): GmailManager(1),
        os.getenv("GMAIL_USER2"): GmailManager(2),
        os.getenv("GMAIL_USER3"): GmailManager(3)
    }
    print("Gmail Inboxes Initialized.")

    print(f"Connecting to Bridge: {BRIDGE_URL[:40]}...")
    
    print("UNIVERSAL BRIDGE WORKER IS ONLINE.")

    while True:
        try:
            # 1. Fetch State from Bridge
            res = requests.post(BRIDGE_URL, json={"action": "GET_DATA"}, timeout=30)
            data = res.json()
            
            if data.get('status') == "PAUSED":
                print("System is PAUSED via Dashboard. Waiting 30s...")
                time.sleep(30)
                continue
            
            # 2. Find Pending Lead
            leads = data.get('leads', [])
            if not leads:
                print("No data found in sheet.")
                time.sleep(60)
                continue

            pending_lead = None
            row_idx = 0
            for i, row in enumerate(leads[1:]): 
                if len(row) > 4 and row[4] == "New": 
                    pending_lead = row
                    row_idx = i + 2
                    break
            
            if not pending_lead:
                print("Status Check: No 'New' leads. Checking again in 5 minutes...")
                time.sleep(300)
                continue

            # 3. Process
            inbox_email = pending_lead[7] if len(pending_lead) > 7 else os.getenv("GMAIL_USER1")
            client = inbox_clients.get(inbox_email)
            
            if not client:
                print(f"Warning: No config for {inbox_email}. Using Inbox 1.")
                client = inbox_clients.get(os.getenv("GMAIL_USER1"))

            email_to = pending_lead[2]
            name = pending_lead[0]
            topic = pending_lead[3]

            print(f"Found Lead: {name} ({email_to}). Generating AI email...")
            
            body = polisher.polish("Hi {firstname}...", name, topic)
            
            print(f"Sending outreach via {inbox_email}...")
            success, thread_id, msg_id = client.send_outreach(
                to_email=email_to,
                subject="Thumbnail design inquiry",
                body=body
            )

            if success:
                print("Outreach sent successfully! Updating sheet...")
                requests.post(BRIDGE_URL, json={
                    "action": "UPDATE_ROW",
                    "row": row_idx,
                    "status": "Awaiting Reply"
                }, timeout=30)
                
                delay = random.randint(60, 120)
                print(f"Sheet updated. Waiting {delay}s to emulate human behavior...")
                time.sleep(delay)
            else:
                print(f"Email failed for {email_to}. Will retry later.")
                time.sleep(60)
                
        except Exception as e:
            print(f"Bridge connection issue: {e}. Retrying in 10s...")
            time.sleep(10)

if __name__ == "__main__":
    try:
        run_bridge_worker()
    except KeyboardInterrupt:
        print("\nShutdown signal received. Goodbye!")
    except Exception as e:
        print(f"\nFATAL ERROR: {e}")
