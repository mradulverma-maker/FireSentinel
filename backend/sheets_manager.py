import os
import json
import gspread
from dotenv import load_dotenv

load_dotenv()

class SheetsManager:
    def __init__(self):
        self.scope = ["https://spreadsheets.google.com/feeds", 'https://www.googleapis.com/auth/drive']
        self.service_account_path = os.path.join(os.path.dirname(__file__), 'service_account.json')
        
        if not os.path.exists(self.service_account_path):
            raise FileNotFoundError("service_account.json not found in backend folder. Please follow the guide.")

        self.gc = gspread.service_account(filename=self.service_account_path)
        self.sheet_name = os.getenv("GOOGLE_SHEET_NAME", "Outreach CRM")
        self.spreadsheet = self.gc.open(self.sheet_name)
        self.worksheet = self.spreadsheet.get_worksheet(0) # First tab

    def get_all_leads(self):
        return self.worksheet.get_all_records()

    def check_duplicate(self, email):
        emails = self.worksheet.col_values(3) # Column C is Email
        return email in emails

    def add_leads(self, leads_data):
        """
        leads_data should be a list of lists: [[firstname, notice, email, assigned_inbox, status, date_added, ...]]
        """
        self.worksheet.append_rows(leads_data)

    def update_status(self, email, status, color=None):
        cell = self.worksheet.find(email)
        if cell:
            # Update status in Column E (5)
            self.worksheet.update_cell(cell.row, 5, status)
            
            if status == "Awaiting Reply":
                # Highlight "Email Sent" column (Assume Column L is indicators)
                # For simplicity, we can also color the whole row or specific cells
                pass
            
            if status == "Replied" and color:
                self.worksheet.format(f"A{cell.row}:L{cell.row}", {
                    "backgroundColor": {"red": 0.8, "green": 1.0, "blue": 0.8} # Light green
                })

    def get_inbox_count(self, inbox_email):
        # Count rows where Column D (Assigned Inbox) == inbox_email and Date == Today
        # This will be refined in the engine logic
        pass
