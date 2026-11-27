const SHEET_NAME = "Reports";
const HEADERS = ["rid","title","category","description","location","priority","status","userId","userName","date","time","assignedTo","history","notes"];

function jsonOut(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return "CivicSnap Reports sheet is ready.";
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const action = String(payload.action || "");
    const adminActions = ["list", "update", "assign", "note", "delete"];
    if (adminActions.indexOf(action) !== -1) {
      const expected = PropertiesService.getScriptProperties().getProperty("ADMIN_KEY");
      if (!expected || !payload.key || payload.key !== expected) {
        return jsonOut({ok:false, error:"Unauthorized. Check the administrator key."});
      }
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("Reports sheet is missing. Run setup() first.");
    const values = sheet.getDataRange().getValues();
    const headers = values[0] || HEADERS;
    const column = name => headers.indexOf(name);
    const idIndex = column("rid");

    if (action === "create") {
      const required = ["rid","title","category","description","location","priority","userId","userName"];
      required.forEach(name => {
        if (!String(payload[name] || "").trim()) throw new Error("Missing required field: " + name);
      });
      const duplicate = values.slice(1).some(row => String(row[idIndex]) === String(payload.rid));
      if (duplicate) throw new Error("This report ID already exists. Please submit again.");
      sheet.appendRow([
        String(payload.rid), String(payload.title), String(payload.category),
        String(payload.description), String(payload.location), String(payload.priority),
        "Pending", String(payload.userId), String(payload.userName),
        String(payload.date || new Date().toISOString()), String(payload.time || ""),
        "", JSON.stringify([["Pending", new Date().toISOString()]]), "[]"
      ]);
      return jsonOut({ok:true, rid:payload.rid});
    }

    if (action === "list") {
      const reports = values.slice(1).filter(row => row[idIndex]).map(row => {
        const item = {};
        headers.forEach((header, i) => item[header] = row[i]);
        return item;
      });
      return jsonOut({ok:true, reports:reports});
    }

    const rowIndex = values.findIndex((row, i) => i > 0 && String(row[idIndex]) === String(payload.rid));
    if (rowIndex < 1) throw new Error("Report not found.");
    const row = values[rowIndex];

    if (action === "update") {
      const status = String(payload.status || "").trim();
      const allowed = ["Pending","Under Review","In Progress","For Verification","Resolved","Rejected"];
      if (allowed.indexOf(status) === -1) throw new Error("Invalid report status.");
      row[column("status")] = status;
      let history = [];
      try { history = JSON.parse(row[column("history")] || "[]"); } catch (_) {}
      history.push([status, new Date().toISOString()]);
      row[column("history")] = JSON.stringify(history);
    } else if (action === "assign") {
      row[column("assignedTo")] = String(payload.assignedTo || "");
    } else if (action === "note") {
      const note = String(payload.note || "").trim();
      if (!note) throw new Error("Note cannot be empty.");
      let notes = [];
      try { notes = JSON.parse(row[column("notes")] || "[]"); } catch (_) {}
      notes.push({text:note, createdAt:new Date().toISOString()});
      row[column("notes")] = JSON.stringify(notes);
    } else if (action === "delete") {
      sheet.deleteRow(rowIndex + 1);
      return jsonOut({ok:true});
    } else {
      throw new Error("Unknown action.");
    }

    sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([row]);
    return jsonOut({ok:true});
  } catch (error) {
    return jsonOut({ok:false, error:String(error && error.message || error)});
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
