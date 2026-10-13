import React from 'react';
import { useApp } from '../AppContext';
import { FileSpreadsheet, X, Download, ExternalLink } from 'lucide-react';

interface GoogleSheetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetDataModal: React.FC<GoogleSheetDataModalProps> = ({ isOpen, onClose }) => {
  const { language, memberRecords, parsedSheet, googleSheetUrl, openGoogleSheetDirectly, lastSyncTime } = useApp();

  if (!isOpen) return null;

  const handleExportCsv = () => {
    const headers = [
      'Member ID',
      'Full Name',
      'Sinhala Name',
      'Phone',
      'Category',
      'W1',
      'W2',
      'W3',
      'W4',
      'W5',
      'W6',
      'W7',
      'W8',
      'W9',
      'W10',
      'Total Paid (Rs)',
      'Total Owed (Rs)',
      'Status'
    ];
    const rows = memberRecords.map((m) => [
      m.memberCode,
      `"${m.name}"`,
      `"${m.nameSinhala}"`,
      `"${m.phone}"`,
      m.category,
      ...Array.from({ length: 10 }, (_, i) => (m.weeks[i + 1] === 'paid' ? 'Paid' : 'Due')),
      m.totalPaid,
      m.totalOwed,
      m.status
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `YoungStar_SC_GoogleSheet_Dues_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                {language === 'si' ? 'ගූගල් ෂීට් සජීවී දත්ත ලේඛනය' : 'Exact Google Sheet Data Inspector'}
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                {parsedSheet
                  ? `Spreadsheet ID: ${parsedSheet.sheetId} • ${parsedSheet.memberCount} Rows Parsed`
                  : `Active Dataset: ${memberRecords.length} Members • Synced: ${lastSyncTime}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-800">Source:</span>
            <span className="font-mono text-[11px] truncate max-w-[280px] sm:max-w-md bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
              {googleSheetUrl}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={openGoogleSheetDirectly}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Open in Google Drive</span>
              <ExternalLink className="w-3 h-3 text-emerald-200" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto flex-1 p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold sticky top-0">
                <th className="p-2.5 whitespace-nowrap"># Code</th>
                <th className="p-2.5 whitespace-nowrap">Member Name</th>
                <th className="p-2.5 whitespace-nowrap hidden sm:table-cell">Phone</th>
                <th className="p-2.5 whitespace-nowrap">Category</th>
                {Array.from({ length: 10 }, (_, i) => (
                  <th key={i + 1} className="p-2 text-center whitespace-nowrap w-8">
                    W{i + 1}
                  </th>
                ))}
                <th className="p-2.5 text-right whitespace-nowrap">Paid (Rs)</th>
                <th className="p-2.5 text-right whitespace-nowrap">Due (Rs)</th>
                <th className="p-2.5 text-center whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-700">
              {memberRecords.map((m) => (
                <tr key={m.memberId} className="hover:bg-slate-50 transition-colors">
                  <td className="p-2.5 font-mono font-semibold text-slate-900">{m.memberCode}</td>
                  <td className="p-2.5 font-medium text-slate-900">
                    <div>{m.name}</div>
                    <div className="text-[10px] text-slate-400 font-sinhala">{m.nameSinhala}</div>
                  </td>
                  <td className="p-2.5 text-slate-500 font-mono hidden sm:table-cell">{m.phone}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {m.category}
                    </span>
                  </td>
                  {Array.from({ length: 10 }, (_, i) => {
                    const isPaid = m.weeks[i + 1] === 'paid';
                    return (
                      <td key={i + 1} className="p-1 text-center">
                        <span
                          className={`inline-block w-5 h-5 rounded text-[10px] font-bold leading-5 ${
                            isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isPaid ? '✓' : '—'}
                        </span>
                      </td>
                    );
                  })}
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                    Rs {m.totalPaid.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-right font-mono font-semibold text-amber-700">
                    Rs {m.totalOwed.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'good'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'due'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {m.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-600">
            <span>
              Total Members: <strong className="text-slate-900">{memberRecords.length}</strong>
            </span>
            <span>
              Collected:{' '}
              <strong className="text-emerald-700 font-mono">
                Rs {memberRecords.reduce((acc, m) => acc + m.totalPaid, 0).toLocaleString()}
              </strong>
            </span>
            <span>
              Pending:{' '}
              <strong className="text-amber-700 font-mono">
                Rs {memberRecords.reduce((acc, m) => acc + m.totalOwed, 0).toLocaleString()}
              </strong>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
