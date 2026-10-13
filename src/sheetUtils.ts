// Helpers for Google Sheets & Google Drive integration

import { MemberRecord, ParsedSheetData, ExpenseRecord } from './types';

export function parseSpreadsheetUrl(url: string): { sheetId: string; gid: string } {
  const clean = url.trim();
  if (/^[a-zA-Z0-9-_]{20,}$/.test(clean)) {
    return { sheetId: clean, gid: '0' };
  }
  const idMatch = clean.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const sheetId = idMatch ? idMatch[1] : clean;
  const gidMatch = clean.match(/[#&?]gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : '0';
  return { sheetId, gid };
}

export function parseCsv(text: string): string[][] {
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let insideQuotes = false;
  const firstLine = cleanText.split('\n')[0] || '';
  const delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes(';') && !firstLine.includes(',') ? ';' : ',';

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++;
        } else {
          insideQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === delimiter) {
        row.push(cell.trim());
        cell = '';
      } else if (char === '\n') {
        row.push(cell.trim());
        if (row.some(c => c !== '')) {
          lines.push(row);
        }
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some(c => c !== '')) {
      lines.push(row);
    }
  }

  return lines;
}

export function parseExpensesFromRows(rows: string[][]): ExpenseRecord[] {
  if (!rows || rows.length === 0) return [];
  let headerRow = -1;
  let dateCol = -1;
  let detailsCol = -1;
  let amountCol = -1;
  let categoryCol = -1;

  for (let i = 0; i < Math.min(6, rows.length); i++) {
    const rowStr = rows[i].join(' ').toLowerCase();
    if (
      (rowStr.includes('expense') || rowStr.includes('වියදම') || rowStr.includes('item') || rowStr.includes('detail') || rowStr.includes('විස්තර')) &&
      (rowStr.includes('amount') || rowStr.includes('මුදල') || rowStr.includes('rs') || rowStr.includes('cost') || rowStr.includes('price'))
    ) {
      headerRow = i;
      rows[i].forEach((cell, idx) => {
        const lower = cell.toLowerCase().trim();
        if (dateCol === -1 && (lower.includes('date') || lower.includes('දිනය'))) dateCol = idx;
        if (detailsCol === -1 && (lower.includes('expense') || lower.includes('detail') || lower.includes('item') || lower.includes('description') || lower.includes('විස්තර'))) detailsCol = idx;
        if (amountCol === -1 && (lower.includes('amount') || lower.includes('මුදල') || lower.includes('rs') || lower.includes('cost') || lower.includes('price'))) amountCol = idx;
        if (categoryCol === -1 && (lower.includes('category') || lower.includes('කාණ්ඩය'))) categoryCol = idx;
      });
      break;
    }
  }

  const startIdx = headerRow !== -1 ? headerRow + 1 : 0;
  if (dateCol === -1 && detailsCol === -1 && amountCol === -1) {
    dateCol = 0;
    detailsCol = 1;
    amountCol = 2;
  } else {
    if (dateCol === -1) dateCol = 0;
    if (detailsCol === -1) detailsCol = dateCol === 0 ? 1 : 0;
    if (amountCol === -1) amountCol = detailsCol === 1 ? 2 : 1;
  }

  const list: ExpenseRecord[] = [];
  for (let r = startIdx; r < rows.length; r++) {
    const row = rows[r];
    if (!row || !row.some(c => c.trim().length > 0)) continue;
    const dateStr = (row[dateCol] || '').trim();
    const detailsStr = (row[detailsCol] || '').trim();
    const numClean = (row[amountCol] || '').replace(/[^0-9.]/g, '');
    const amountVal = parseFloat(numClean);
    const rowText = row.join(' ').toLowerCase();

    if (
      !rowText.includes('total') &&
      !rowText.includes('එකතුව') &&
      !rowText.includes('balance') &&
      !detailsStr.toLowerCase().includes('table 2') &&
      detailsStr &&
      !isNaN(amountVal) &&
      amountVal > 0
    ) {
      const cat = categoryCol !== -1 && row[categoryCol]?.trim() ? row[categoryCol].trim() : 'Club Expense';
      list.push({
        id: `exp-${r + 1}`,
        date: dateStr || new Date().toISOString().split('T')[0],
        expenseDetails: detailsStr,
        amount: amountVal,
        category: cat,
        receiptNumber: `EXP-${(r + 1).toString().padStart(3, '0')}`
      });
    }
  }

  return list;
}

export function parseSheetCsvToData(
  grid: string[][],
  sheetId: string,
  gid: string,
  sourceUrl: string
): ParsedSheetData {
  if (!grid || grid.length === 0) {
    throw new Error('The spreadsheet appears to be empty.');
  }

  let headerRowIdx = 0;
  for (let i = 0; i < Math.min(5, grid.length); i++) {
    const line = grid[i].join(' ').toLowerCase();
    if (line.includes('name') || line.includes('member') || line.includes('week') || line.includes('නම') || line.includes('සතිය') || line.includes('w1')) {
      headerRowIdx = i;
      break;
    }
  }

  const headers = grid[headerRowIdx].map(h => h.trim());
  const bodyRows = grid.slice(headerRowIdx + 1);

  let idCol = -1;
  let nameCol = -1;
  let phoneCol = -1;
  let catCol = -1;
  let paidCol = -1;
  let owedCol = -1;
  const weekCols: { weekNum: number; colIdx: number }[] = [];

  headers.forEach((h, idx) => {
    const lower = h.toLowerCase();
    if (idCol === -1 && (lower === 'id' || lower === 'no' || lower === 'code' || lower.includes('member id') || lower.includes('member code') || lower === '#')) {
      idCol = idx;
    }
    if (nameCol === -1 && (lower === 'name' || lower.includes('full name') || lower.includes('member name') || lower.includes('නම'))) {
      nameCol = idx;
    }
    if (phoneCol === -1 && (lower.includes('phone') || lower.includes('mobile') || lower.includes('contact') || lower.includes('දුරකථන'))) {
      phoneCol = idx;
    }
    if (catCol === -1 && (lower.includes('category') || lower.includes('role') || lower.includes('status') || lower.includes('කාණ්ඩය'))) {
      catCol = idx;
    }
    if (paidCol === -1 && (lower.includes('total paid') || lower.includes('amount paid') || lower.includes('paid total') || lower.includes('ගෙවූ'))) {
      paidCol = idx;
    }
    if (owedCol === -1 && (lower.includes('owed') || lower.includes('balance') || lower.includes('due') || lower.includes('pending') || lower.includes('හිඟ'))) {
      owedCol = idx;
    }

    const weekMatch = lower.match(/(?:week|w|සතිය)\s*([0-9]{1,2})/i);
    if (weekMatch) {
      const num = parseInt(weekMatch[1], 10);
      if (num >= 1 && num <= 20) {
        weekCols.push({ weekNum: num, colIdx: idx });
      }
    } else if (/^[0-9]{1,2}$/.test(lower)) {
      const num = parseInt(lower, 10);
      if (num >= 1 && num <= 10) {
        weekCols.push({ weekNum: num, colIdx: idx });
      }
    }
  });

  if (nameCol === -1) {
    nameCol = idCol === 0 ? 1 : 0;
  }

  if (weekCols.length === 0) {
    let weekCounter = 1;
    for (let c = 0; c < headers.length; c++) {
      if (c !== idCol && c !== nameCol && c !== phoneCol && weekCounter <= 10) {
        weekCols.push({ weekNum: weekCounter, colIdx: c });
        weekCounter++;
      }
    }
  }

  weekCols.sort((a, b) => a.weekNum - b.weekNum);

  // Split table 1 (members) and table 2 (expenses)
  let splitRow = -1;
  for (let i = 0; i < bodyRows.length; i++) {
    const rowText = bodyRows[i].join(' ').toLowerCase();
    if (
      rowText.includes('table 2') ||
      rowText.includes('expense table') ||
      rowText.includes('වියදම්') ||
      (rowText.includes('expense') && (rowText.includes('amount') || rowText.includes('rs') || rowText.includes('මුදල')))
    ) {
      splitRow = i;
      break;
    }
  }

  const memberGrid = splitRow !== -1 ? bodyRows.slice(0, splitRow) : bodyRows;
  const expenseGrid = splitRow !== -1 ? bodyRows.slice(splitRow) : [];

  const members: MemberRecord[] = [];
  let sumPaid = 0;
  let sumOwed = 0;

  memberGrid.forEach((row, rIdx) => {
    if (!row || !row.some(c => c.trim().length > 0)) return;
    const nameVal = row[nameCol]?.trim() || `Member ${rIdx + 1}`;
    if (!nameVal || nameVal.toLowerCase().includes('total amount') || nameVal.toLowerCase().includes('total expenses')) return;

    let memberCode = '';
    if (idCol !== -1 && row[idCol]?.trim()) {
      const rawCode = row[idCol].trim();
      memberCode = rawCode.startsWith('YS-') ? rawCode : `YS-${rawCode.padStart(3, '0')}`;
    } else {
      memberCode = `YS-${(rIdx + 1).toString().padStart(3, '0')}`;
    }

    const phoneVal = phoneCol !== -1 && row[phoneCol]?.trim() ? row[phoneCol].trim() : '077-0000000';
    const catVal = catCol !== -1 && row[catCol]?.trim() ? row[catCol].trim() : 'Senior';
    const normalizedCat = catVal.toLowerCase().includes('junior') ? 'Junior' : catVal.toLowerCase().includes('honorary') ? 'Honorary' : 'Senior';
    const catSi = normalizedCat === 'Junior' ? 'කනිෂ්ඨ' : normalizedCat === 'Honorary' ? 'ගෞරවනීය' : 'ජ්‍යෙෂ්ඨ';

    const weeksMap: Record<number, 'paid' | 'due'> = {};
    let paidCount = 0;
    weekCols.forEach(({ weekNum, colIdx }) => {
      const cell = (row[colIdx] || '').trim().toLowerCase();
      const isPaid = cell === '100' || cell === 'paid' || cell === 'yes' || cell === 'p' || cell === 'true' || cell === '1' || cell === '✓' || cell.includes('ගෙවා') || (parseFloat(cell) > 0 && !isNaN(parseFloat(cell)));
      weeksMap[weekNum] = isPaid ? 'paid' : 'due';
      if (isPaid) paidCount++;
    });

    for (let w = 1; w <= 10; w++) {
      if (!weeksMap[w]) weeksMap[w] = 'due';
    }

    let calculatedPaid = paidCount * 100;
    if (paidCol !== -1 && row[paidCol]?.trim()) {
      const explicit = parseFloat(row[paidCol].replace(/[^0-9.]/g, ''));
      if (!isNaN(explicit) && explicit >= 0) calculatedPaid = explicit;
    }

    let calculatedOwed = (10 - paidCount) * 100;
    if (owedCol !== -1 && row[owedCol]?.trim()) {
      const explicitOwed = parseFloat(row[owedCol].replace(/[^0-9.]/g, ''));
      if (!isNaN(explicitOwed) && explicitOwed >= 0) calculatedOwed = explicitOwed;
    }

    sumPaid += calculatedPaid;
    sumOwed += calculatedOwed;
    const standing = calculatedOwed === 0 ? 'good' : calculatedOwed <= 300 ? 'due' : 'overdue';

    members.push({
      memberId: `m-sheet-${rIdx + 1}`,
      memberCode,
      name: nameVal,
      nameSinhala: nameVal,
      phone: phoneVal,
      category: normalizedCat,
      categorySinhala: catSi,
      weeks: weeksMap,
      totalPaid: calculatedPaid,
      totalOwed: calculatedOwed,
      status: standing,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      lastPaymentMethod: 'Google Sheet Sync'
    });
  });

  if (members.length === 0) {
    throw new Error('No valid member records found in the parsed spreadsheet.');
  }

  const expenses = parseExpensesFromRows(expenseGrid);
  const totalExp = expenses.reduce((a, b) => a + b.amount, 0);
  const net = sumPaid - totalExp;

  const now = new Date();
  const syncedTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Google Sheet Live)`;

  return {
    sheetId,
    gid,
    sourceUrl,
    headers,
    rawRows: bodyRows,
    members,
    expenses,
    totalCollected: sumPaid,
    totalExpenses: totalExp,
    netBalance: net,
    totalPending: sumOwed,
    memberCount: members.length,
    syncedAt: syncedTime
  };
}

// Google Drive Launcher HTML generator
export function generateDriveLauncherHtml(targetUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Young Star Sports Club Gamudawa - Web Portal Launcher</title>
  <meta http-equiv="refresh" content="0; url=${targetUrl}">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 40px; background: #0f172a; color: #f8fafc; }
    .card { background: #1e293b; max-width: 500px; margin: 40px auto; padding: 30px; border-radius: 20px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #f59e0b; font-size: 24px; margin-bottom: 10px; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
    a.btn { display: inline-block; background: #f59e0b; color: #0f172a; font-weight: bold; padding: 12px 24px; border-radius: 12px; text-decoration: none; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Young Star Sports Club - Gamudawa</h1>
    <p>Connecting to the official club management portal...</p>
    <a class="btn" href="${targetUrl}">Open Web Portal Now</a>
  </div>
</body>
</html>`;
}
