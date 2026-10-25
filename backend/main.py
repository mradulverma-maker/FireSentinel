import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from engine import OutreachEngine
from sheets_manager import SheetsManager
from datetime import datetime

app = Flask(__name__)
CORS(app)

engine = OutreachEngine()
sheets = SheetsManager()
TEMPLATE_FILE = os.path.join(os.path.dirname(__file__), 'templates.json')

def load_templates():
    if os.path.exists(TEMPLATE_FILE):
        with open(TEMPLATE_FILE, 'r') as f:
            return json.load(f)
    return {
        "initial": ["Hi {firstname}, I saw your video about {notice} and...", "", ""],
        "followups": [[ "", ""], ["", ""], ["", ""], ["", ""], ["", ""]]
    }

@app.route('/templates', methods=['GET', 'POST'])
def manage_templates():
    if request.method == 'POST':
        with open(TEMPLATE_FILE, 'w') as f:
            json.dump(request.json, f)
        return jsonify({"status": "saved"})
    return jsonify(load_templates())

@app.route('/import-leads', methods=['POST'])
def import_leads():
    try:
        data = request.json
        raw_leads = data.get('leads', [])
        
        if not raw_leads:
            return jsonify({"status": "error", "message": "No leads provided in paste box."}), 400

        unique_leads = []
        skipped_count = 0
        
        for lead in raw_leads:
            if not lead.get('email') or '@' not in lead.get('email'):
                continue
            if sheets.check_duplicate(lead['email']):
                skipped_count += 1
                continue
            unique_leads.append(lead)
        
        inboxes_list = ["mradul.editv@gmail.com", "mradul.editzz@gmail.com", "mradul.verma.info@gmail.com"]
        
        formatted_leads = []
        for i, lead in enumerate(unique_leads):
            assigned = inboxes_list[i % 3]
            formatted_leads.append([
                lead.get('firstname', 'Client'),
                lead.get('notice', ''),
                lead['email'],
                assigned,
                "Pending",
                datetime.now().strftime("%Y-%m-%d"),
                "", "", "", "" # Placeholders for last sent / IDs
            ])
        
        if formatted_leads:
            sheets.add_leads(formatted_leads)
            
        return jsonify({
            "status": "success",
            "imported": len(formatted_leads),
            "skipped": skipped_count
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Import failed: {str(e)}"}), 500

import gspread

@app.route('/run-campaign', methods=['POST'])
def run_campaign():
    try:
        engine.process_campaigns()
        return jsonify({"status": "completed"})
    except FileNotFoundError:
        return jsonify({
            "status": "error", 
            "error_type": "AUTH_ERROR", 
            "message": "service_account.json not found in backend folder. Please upload it."
        }), 404
    except gspread.exceptions.SpreadsheetNotFound:
        return jsonify({
            "status": "error", 
            "error_type": "SHEET_ERROR", 
            "message": f"Sheet '{os.getenv('GOOGLE_SHEET_NAME')}' not found. Check the name and share settings."
        }), 404
    except Exception as e:
        return jsonify({"status": "error", "message": f"Campaign Error: {str(e)}"}), 500

@app.route('/inbox-status', methods=['GET'])
def get_inbox_status():
    # Helper for the frontend to show counter and badges
    # This would aggregate data from the sheet
    return jsonify({
        "inboxes": [
            {"email": "mradul.editv@gmail.com", "count": 12, "status": "GREEN"},
            {"email": "mradul.editzz@gmail.com", "count": 52, "status": "RED"},
            {"email": "mradul.verma.info@gmail.com", "count": 5, "status": "GREEN"}
        ]
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
