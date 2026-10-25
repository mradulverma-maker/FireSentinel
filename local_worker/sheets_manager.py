import os
import gspread
import json
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

class SheetsManager:
    def __init__(self):
        # Locate the service account JSON
        json_file = [f for f in os.listdir(os.path.dirname(__file__)) if f.endswith('.json')][0]
        self.creds_path = os.path.join(os.path.dirname(__file__), json_file)
        
        # Load credentials and client
        self.gc = gspread.service_account(filename=self.creds_path)
        
        # Extract bot email for diagnostic
        with open(self.creds_path, 'r') as f:
            self.email = json.load(f).get('client_email')
        
        # Load the Sheet ID correctly
        raw_id = os.getenv("GOOGLE_SHEET_ID")
        if not raw_id:
            raise Exception("GOOGLE_SHEET_ID not found in .env file!")
        self.sheet_id = raw_id.strip()

        try:
            # Connect via Direct URL (most robust)
            url = f"https://docs.google.com/spreadsheets/d/{self.sheet_id}/edit"
            self.spreadsheet = self.gc.open_by_url(url)
            self.worksheet = self.spreadsheet.get_worksheet(0)
        except gspread.exceptions.SpreadsheetNotFound:
            print(f"\n[PERMISSION ERROR]")
            print(f"I cannot see your sheet yet! Please share it with me:")
            print(f"Invite this email: {self.email}")
            print(f"----------------------------------------\n")
            raise Exception("Sheet not shared with bot email.")

    def get_status(self):
        """Fetches the Master Switch from Cell Z1. Defaults to RUNNING if empty."""
        try:
            val = self.worksheet.acell('Z1').value
            return val if val else "RUNNING"
        except:
            return "RUNNING"

    def set_status(self, value):
        """Sets the Master Switch or Daily Completion"""
        self.worksheet.update_acell('Z1', value)

    def get_next_pending_lead(self):
        all_leads = self.worksheet.get_all_records()
        for i, lead in enumerate(all_leads):
            status = lead.get('Status')
            if status == 'New' or status == 'Awaiting Reply':
                if status == 'New':
                    lead['row_index'] = i + 2
                    return lead
        return None

    def update_lead_after_send(self, row_index, thread_id, msg_id, follow_up_count):
        now = datetime.now().strftime("%Y-%m-%d")
        updates = [
            {'range': f'E{row_index}', 'values': [['Awaiting Reply']]},
            {'range': f'F{row_index}', 'values': [[now]]},
            {'range': f'G{row_index}', 'values': [[follow_up_count + 1]]},
            {'range': f'J{row_index}', 'values': [[thread_id]]}
        ]
        for update in updates:
            self.worksheet.update(update['range'], update['values'])
        
        self.worksheet.format(f'A{row_index}:K{row_index}', {
            "backgroundColor": {"red": 0.9, "green": 0.9, "blue": 1.0}
        })

    def get_daily_count(self, inbox_email):
        today = datetime.now().strftime("%Y-%m-%d")
        records = self.worksheet.get_all_records()
        count = 0
        for r in records:
            if r.get('Last Sent') == today and r.get('Inbox Used') == inbox_email:
                count += 1
        return count
