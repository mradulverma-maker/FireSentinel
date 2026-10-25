// ============================================================
// 🌐 WEB APP BRIDGE — handles dashboard POST requests
// PASTE THIS AT THE BOTTOM of your Google Apps Script
// Then: Deploy → New deployment → Web App → Anyone → Execute as Me
// ============================================================

function doPost(e) {
  try {
    const body   = JSON.parse(e.postData ? e.postData.contents : "{}");
    const action = body.action || "";

    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheetByIndex(0);

    // ── GET_DATA: Send all sheet data to dashboard ──────────
    if (action === "GET_DATA") {
      const allData = sheet.getDataRange().getValues();

      // Read master status from Z1
      let status = "RUNNING";
      try {
        const z1 = sheet.getRange("Z1").getValue();
        if (z1) status = z1.toString();
      } catch(err) {}

      return buildResponse({ status: status, leads: allData });
    }

    // ── TOGGLE_STATUS: Pause / Resume from dashboard ─────────
    if (action === "TOGGLE_STATUS") {
      const newStatus = body.value || "RUNNING";
      sheet.getRange("Z1").setValue(newStatus);
      return buildResponse({ success: true, result: newStatus });
    }

    // ── DISTRIBUTE_AND_START: Assign leads to 3 inboxes ─────
    if (action === "DISTRIBUTE_AND_START") {
      const inboxes = [
        "mradul.editv@gmail.com",
        "mradul.editzz@gmail.com",
        "mradul.verma.info@gmail.com"
      ];

      const allRows = sheet.getDataRange().getValues();
      let pointer   = 0;
      let saved     = 0;

      for (let i = 1; i < allRows.length; i++) {
        const stat = (allRows[i][5] || "").toString().toLowerCase().trim();
        if (stat === "" || stat === "new" || stat === "pending") {
          // Column F = Status (index 5), Column H = Inbox Used — we'll use col 8 (index 7)
          sheet.getRange(i + 1, 6).setValue("New");           // Status = New
          sheet.getRange(i + 1, 9).setValue(inboxes[pointer % 3]); // Template col I = Inbox
          pointer++;
          saved++;
        }
      }

      return buildResponse({ success: true, result: "DISTRIBUTED_" + saved });
    }

    // ── UPDATE_ROW: Mark a row after email is sent ───────────
    if (action === "UPDATE_ROW") {
      const row    = parseInt(body.row) || 0;
      const status = body.status || "Awaiting Reply";
      if (row > 0) {
        sheet.getRange(row, 6).setValue(status); // Column F = Status
      }
      return buildResponse({ success: true });
    }

    return buildResponse({ error: "Unknown action: " + action });

  } catch (err) {
    return buildResponse({ error: err.message });
  }
}

// Also handle GET requests (for testing in browser)
function doGet(e) {
  return doPost({ postData: { contents: JSON.stringify({ action: "GET_DATA" }) } });
}

// Helper to build JSON response with correct CORS headers
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
