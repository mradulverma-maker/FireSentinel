import time
import random
import os
from sheets_manager import SheetsManager
from gmail_manager import GmailManager
from ai_polisher import AIPolisher

def run_worker():
    sheets = SheetsManager()
    polisher = AIPolisher()
    
    # Init 3 inboxes
    inbox_clients = {
        os.getenv("GMAIL_USER1"): GmailManager(1),
        os.getenv("GMAIL_USER2"): GmailManager(2),
        os.getenv("GMAIL_USER3"): GmailManager(3)
    }

    print("⚡ Thumbnail Agency Hybrid Worker is ONLINE.")
    
    while True:
        # 1. Master Switch Check (Z1)
        system_status = sheets.get_status()
        
        if system_status == "PAUSED":
            print("⏸️ System Paused via Dashboard. Waiting 30s...")
            time.sleep(30)
            continue
            
        if system_status == "COMPLETE":
            print("✅ Campaign finished for now. Standing by...")
            time.sleep(300)
            continue

        # 2. Get Next Lead
        lead = sheets.get_next_pending_lead()
        if not lead:
            print("🏁 No more pending leads found. Marking as COMPLETE.")
            sheets.set_status("COMPLETE")
            continue

        # 3. Check Daily Cap (50/inbox)
        inbox_email = lead.get('Assigned Inbox')
        current_count = sheets.get_daily_count(inbox_email)
        
        if current_count >= 50:
            print(f"🛑 Inbox {inbox_email} hit daily cap. Skipping lead for now.")
            continue

        # 4. Process & Send
        print(f"🎯 Processing lead: {lead.get('Email')} using {inbox_email}")
        
        # In a real setup, we'd fetch actual templates from a file or another tab
        template = "Hi {firstname}, noticed your video {notice}..." 
        
        # Using your exact column names: 'Name' and 'Note (Topic)'
        polished_body = polisher.polish(template, lead.get('Name'), lead.get('Note (Topic)'))
        
        # Inbox lookup from column 'Inbox Used'
        inbox_email = lead.get('Inbox Used')
        client = inbox_clients.get(inbox_email)
        if not client:
            print(f"⚠️ Error: No client configured for {inbox_email}")
            continue

        success, thread_id, msg_id = client.send_outreach(
            to_email=lead.get('Email'),
            subject="Thumbnail design for your channel",
            body=polished_body,
            thread_id=lead.get('Thread ID'),
            last_msg_id=lead.get('Message ID')
        )

        if success:
            # 5. LAPTOP SHUTDOWN SAFETY: Update spreadsheet IMMEDIATELY
            sheets.update_lead_after_send(
                lead['row_index'], 
                thread_id, 
                msg_id, 
                int(lead.get('Follow-up Count', 0))
            )
            
            # 6. Human Emulation Delay
            delay = random.randint(60, 120)
            print(f"Sent! Sleeping {delay}s for human emulation...")
            time.sleep(delay)
        else:
            print("Failed to send. Waiting before retry...")
            time.sleep(60)

if __name__ == "__main__":
    try:
        run_worker()
    except KeyboardInterrupt:
        print("\nWorker stopped by user.")
    except Exception as e:
        print(f"\nCRITICAL ERROR: {e}")
        time.sleep(10)
