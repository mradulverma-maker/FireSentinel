import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const maxDuration = 60; // Allow enough time for Google Sheets to process
export const dynamic = 'force-dynamic'; // Prevent static caching

const SHEET_ID = '1h5EGGHNCoTHmtSbfUL-mtA8HXXlq30-xEHaRrrrf0nA';
const CREDS = {
  client_email: "email-automation@email-automation-system-500609.iam.gserviceaccount.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQD4UlwCTMoEtAgm\n9k/qUuFcL1C1Pz6sl4uUgcDcMBfuGUtBFCPjxr1n3atrmuJYHvEHfTzloWRtkhNv\ns3IhYvmqR2ufltJKBY5bPWt7Kvo7EC8BVDIqZNSaIpeaahC5j5wuy0lNYIUbAUUC\n1rj4G5OAshlRMSrWV88FSI2nffVPHtPjsa4l83Wsbg0h2azHnGDhpJK/30N27dVW\nnCRwIUketbQFYQGhLiP/pkpFZ4gZoIImIbfnvnN2oHZPHwMIT0N7O3tepJU/3KGP\nr3AikIsOWvg95nPf4zggNISYEpTFnHX6PoG3QohZYdalS4lSnBDLkAQ6kkYc/lG4\n9pfuIChrAgMBAAECgf9dYj59h6j81f0jkpTYLQ0encPTfJgsfkWLH0CWdjnPZ+JC\nIq3oKUluaO5T/XbEOIGDT35orjG5MXvAnUbCu9L5k1agCoxQYTrh/cKzjwGiqOe+\nmDD/kdRh9BSyFHbv3SkkzPEJ4nDmK0488ZpAywbEvDVUx50OoTzE1yb57TXe/uP1\nub/k0PknnQfOQpMt3ICZYTbWjG4d7w1cLvH6YGzX1joGRenrXgCxZ+DQ9CsWFx+n\nCsuASg1xjTRgTnjHjAAy6JQRIPhNVNbGtAzFb74Y1vrdnFgZC3Q3ZKKhCvmhWTrY\nvd3rTKQgOebZrol0B9UYZ3UFeNSv0zPPlIr4hbECgYEA/ULcjc9wZgbuxeIhZ4rC\nvSDxcWh6itFB7bj5N0/Dlc25/yUEMGtKwfx+xheZnK3olm/I9NGyiE2XUUZ8mHxV\nN5mZ8ExC2MUM3+0i2OHKAnZqqJ+Dcvmow/nyQgdSOyU6Iv7Dd12OmmQw00A63p5b\nvM3YZORwSL/XP2YHgvfTMJkCgYEA+wHSwZ84ediizf2tlr54V1kQ7+5ijr/HQT59\nnK6eYYIVoPBwUgc2BcAS5nWQUVPS66vAumOpgnki+q4S/JG6kf8fWwgKXv2D9ZBt\nYr4nEiyCW4Wb+qn39YKGlS5AzFqg0pWLCBwZ50RZyxu3pQbd6BVDFhtWWzgddHh/\nbPCRT6MCgYAXWEduRvXMYc02rl535eGHf3biBkhtbVaPbCKEx7R2pY0EiMv3DpzI\nftbMubYuLBWpcEpszruPNt/A3Sd1Atj0FBONg+oRgzBpn7k7lqyBR5sTSgja20qE\nLhD3pyccTpUqTqOD6DrR3nRltKD4jk5UfAD7Y9c5zX0w2d3NY7yy2QKBgCP4rutw\nlfdgRHSg1i+0PCrIaNT5pMYwVa3T9sxteeUfb1oRGwemYOeSDyNX1cbR7Hg5tPUB\nM1mvYoPqTm5DtCkYFrZFALd8PV0DxalQ9uhz2HqlOyVBFnforMDUUBT5J/MF21be\nMBgkg3nIDxlnUoXgBi003btU32PBoQFLuIdhAoGBAOQAm4l90IhvTcAqT9BpNJET\nrKaTFmgD+cyHKJNq+AXe/wkekLh0/i7befIz80Aut0Vb7C2VwWXM6xbfK9QgIovW\nD1hezH8O4eaisnosLC1KJ0c19EMnlbuTz59dj7RvnvFOXyZoyx5sQm0S1xv7k/ci\n/8PcxoxDnPE6oDznDiqm\n-----END PRIVATE KEY-----\n"
};

async function getDoc() {
  const serviceAccountAuth = new JWT({
    email: CREDS.client_email,
    key: CREDS.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

export async function GET() {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    let status = "RUNNING";
    try {
        await sheet.loadCells('Z1');
        const cell = sheet.getCellByA1('Z1');
        if (cell.value) status = cell.value.toString();
    } catch(e) {}

    // Format output as array of arrays to match what frontend expects from Apps script
    // Note: Apps script getValues() includes header at index 0.
    const headerRow = sheet.headerValues;
    const leadsData = [headerRow];
    
    rows.forEach(r => {
        const rowData = [];
        for (let i = 0; i < 15; i++) {
           const colName = headerRow[i];
           rowData.push(colName ? (r.get(colName) || "") : "");
        }
        leadsData.push(rowData);
    });

    return NextResponse.json({ status: status, leads: leadsData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { action, ...payload } = await req.json();
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    
    if (action === 'TOGGLE_STATUS') {
        await sheet.loadCells('Z1');
        const cell = sheet.getCellByA1('Z1');
        cell.value = payload.value;
        await sheet.saveUpdatedCells();
        return NextResponse.json({ success: true, result: payload.value });
    }
    
    if (action === 'DISTRIBUTE_AND_START') {
        // Just trigger standard behavior. Python worker does real sending anyway.
        // Let's divide 10/10/10 logic for assignments here explicitly:
        const rows = await sheet.getRows();
        const inboxes = [
            "mradul.editv@gmail.com",
            "mradul.editzz@gmail.com",
            "mradul.verma.info@gmail.com"
        ];
        
        let savedCount = 0;
        for (let r of rows) {
             const stat = (r.get('Status') || "").toString().toLowerCase().trim();
             if (stat === "" || stat === "pending" || stat === "new") {
                 r.set("Status", "New");
                 r.set('Inbox Used', inboxes[pointer % 3]);
                 await r.save(); // Crucial: Actually write back to Google Sheets so Python worker sees it.
                 pointer++;
                 savedCount++;
             }
        }
        return NextResponse.json({ success: true, result: `DISTRIBUTION_STARTED_${savedCount}` });
    }

    return NextResponse.json({ success: true, result: "UNKNOWN_ACTION" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
