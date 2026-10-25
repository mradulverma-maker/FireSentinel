import time
import random
import os
from datetime import datetime
from sheets_manager import SheetsManager
from gmail_manager import GmailManager
from ai_polisher import AIPolisher

class OutreachEngine:
    def __init__(self):
        self.sheets = SheetsManager()
        self.polisher = AIPolisher()
        
        # Initialize the 3 inboxes
        self.inbox_configs = [
            {"email": "mradul.editv@gmail.com", "password": os.getenv("GMAIL_PASS1")},
            {"email": "mradul.editzz@gmail.com", "password": os.getenv("GMAIL_PASS2")},
            {"email": "mradul.verma.info@gmail.com", "password": os.getenv("GMAIL_PASS3")}
        ]
        
        self.gmail_clients = {
            cfg["email"]: GmailManager(cfg["email"], cfg["password"]) 
            for cfg in self.inbox_configs if cfg["password"]
        }
        
        self.daily_limit = 50

    def process_campaigns(self):
        leads = self.sheets.get_all_leads()
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Track daily counts per inbox
        daily_counts = {email: 0 for email in self.gmail_clients.keys()}
        
        # First, check for replies to stop follow-ups
        for email_addr, client in self.gmail_clients.items():
            replies = client.check_for_replies()
            for reply in replies:
                self.sheets.update_status(reply["sender"], "Replied", color=True)

        # Refresh leads after reply check
        leads = self.sheets.get_all_leads()

        for lead in leads:
            status = lead.get("Status")
            email = lead.get("Email")
            assigned_inbox = lead.get("Assigned Inbox")
            
            if status in ["Replied", "Done"]:
                continue
            
            if assigned_inbox not in self.gmail_clients:
                continue

            # Check daily cap
            if daily_counts[assigned_inbox] >= self.daily_limit:
                continue

            # Logic for when to send (Initial or Follow-up)
            # This is a simplified version; real drip logic uses 'Last Contacted' and 'Day Offset'
            should_send = self.calculate_drip(lead)
            
            if should_send:
                client = self.gmail_clients[assigned_inbox]
                
                # Get template (this would normally come from a settings tab or frontend)
                template = "Hi {firstname}, noticed you {notice}..." 
                
                body = self.polisher.polish_template(template, lead["First Name"], lead["Notice"])
                
                success, msg_id = client.send_email(
                    to_email=email,
                    subject="Thumbnail Design for your channel",
                    body=body,
                    thread_id=lead.get("Thread ID"),
                    message_id=lead.get("Message ID")
                )
                
                if success:
                    # Update lead in sheet
                    # (logic to update Last Contacted, Follow-up Count, msg_id, etc.)
                    daily_counts[assigned_inbox] += 1
                    
                    # Human emulation delay
                    wait_time = random.randint(60, 120)
                    print(f"Waiting {wait_time}s before next email...")
                    time.sleep(wait_time)

    def calculate_drip(self, lead):
        # Implementation of +1, +2, +1, +2, +1 sequence
        last_contacted = lead.get("Last Contacted Date")
        if not last_contacted:
            return True # Initial email
        
        follow_up_count = int(lead.get("Follow-up Count", 0))
        if follow_up_count >= 5:
            return False
            
        sequence = [1, 2, 1, 2, 1]
        days_to_wait = sequence[follow_up_count]
        
        last_date = datetime.strptime(last_contacted, "%Y-%m-%d")
        delta = datetime.now() - last_date
        
        return delta.days >= days_to_wait
