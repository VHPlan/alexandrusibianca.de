/**
 * THE AB WEDDING — RSVP → Google Sheet
 * ------------------------------------------------------------
 * SETUP (o singură dată, ~3 minute):
 *  1. Deschide https://sheets.new  (un Google Sheet nou) și numește-l „RSVP Nuntă”.
 *  2. Meniu: Extensii → Apps Script.
 *  3. Șterge tot ce e acolo și lipește TOT acest fișier. Salvează (Ctrl+S).
 *  4. Sus dreapta: Implementare (Deploy) → Implementare nouă (New deployment)
 *       - Tip: Aplicație web (Web app)
 *       - Execută ca: Eu (Me)
 *       - Cine are acces: Oricine (Anyone)
 *     → Implementează → acceptă permisiunile → copiază „URL aplicație web”
 *       (arată ca https://script.google.com/macros/s/XXXX/exec)
 *  5. În js/main.js pune URL-ul la:  const RSVP_ENDPOINT = 'https://script.google.com/macros/s/XXXX/exec';
 *
 * Fiecare confirmare apare ca rând nou în foaia „Confirmări”, iar sus ai un
 * rezumat automat (câți vin, câte persoane, câți copii, câți refuză).
 */

const SHEET_NAME = 'Confirmări';
const HEADERS = ['Data', 'Nume', 'Participă', 'Persoane', 'Copii', 'Meniu', 'Mesaj'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    const sh = getSheet_();
    sh.appendRow([
      new Date(),
      String(d.name || '').slice(0, 120),
      d.attend === 'yes' ? 'DA' : 'NU',
      Number(d.guests) || 0,
      Number(d.kids) || 0,
      String(d.menu || ''),
      String(d.message || '').slice(0, 1000)
    ]);
    const row = sh.getLastRow();
    sh.getRange(row, 3).setBackground(d.attend === 'yes' ? '#e8f5e9' : '#fdecea');
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: 'AB Wedding RSVP' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    // summary block (rows 1-2), table header on row 4
    sh.getRange('A1:E1').setValues([['Confirmă DA', 'Refuză', 'Total persoane', 'Total copii', 'Răspunsuri']]);
    sh.getRange('A2').setFormula('=COUNTIF(C5:C,"DA")');
    sh.getRange('B2').setFormula('=COUNTIF(C5:C,"NU")');
    sh.getRange('C2').setFormula('=SUMIF(C5:C,"DA",D5:D)');
    sh.getRange('D2').setFormula('=SUMIF(C5:C,"DA",E5:E)');
    sh.getRange('E2').setFormula('=COUNTA(B5:B)');
    sh.getRange('A1:E1').setFontWeight('bold').setBackground('#f3e9d2');
    sh.getRange('A2:E2').setFontSize(14).setHorizontalAlignment('center');
    sh.getRange(4, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold').setBackground('#b8913f').setFontColor('#ffffff');
    sh.setFrozenRows(4);
    sh.setColumnWidth(1, 150); sh.setColumnWidth(2, 200); sh.setColumnWidth(7, 320);
  }
  return sh;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
