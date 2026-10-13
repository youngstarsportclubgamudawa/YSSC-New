import React, { useState } from 'react';
import { useApp } from './AppContext';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Download,
  Upload,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDriveModal: () => void;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  onOpenDriveModal
}) => {
  const {
    language,
    googleSheetUrl,
    updateGoogleSheetUrl,
    syncGoogleSheet,
    isSyncing,
    lastSyncTime,
    openGoogleSheetDirectly,
    googleUser,
    isGoogleLoggingIn,
    signInWithGoogle,
    signOutFromGoogle,
    parsedSheet,
    importRawCsvData,
    resetToSampleData,
    memberRecords,
    autoSyncMinutes,
    setAutoSyncMinutes,
    writeBackEnabled,
    setWriteBackEnabled,
    isPushing,
    pushChangesToSheet,
    createAndLinkOfficialSheet,
    isCreatingSheet
  } = useApp();

  const [activeTab, setActiveTab] = useState<'direct' | 'import' | 'settings'>('direct');
  const [urlInput, setUrlInput] = useState(googleSheetUrl);
  const [csvInput, setCsvInput] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      updateGoogleSheetUrl(urlInput.trim());
      await syncGoogleSheet(urlInput.trim());
    }
  };

  const handleCsvImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) return;
    if (importRawCsvData(csvInput.trim())) {
      setCsvInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      if (content) {
        importRawCsvData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(googleSheetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsvTemplate = () => {
    const headers = [
      'Member Code',
      'Full Name',
      'Sinhala Name',
      'Phone',
      'Category',
      'Week 1',
      'Week 2',
      'Week 3',
      'Week 4',
      'Week 5',
      'Week 6',
      'Week 7',
      'Week 8',
      'Week 9',
      'Week 10',
      'Total Paid (Rs)',
      'Total Due (Rs)',
      'Status'
    ];
    const rows = memberRecords.map(m => [
      m.memberCode,
      `"${m.name}"`,
      `"${m.nameSinhala}"`,
      `"${m.phone}"`,
      m.category,
      ...Array.from({ length: 10 }, (_, i) => (m.weeks[i + 1] === 'paid' ? 'Paid' : 'Due')),
      m.totalPaid,
      m.totalOwed,
      m.status.toUpperCase()
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'YoungStar_Gamudawa_GoogleSheet_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <FileSpreadsheet className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg leading-tight">
                  {language === 'si'
                    ? 'ගූගල් ෂීට් සජීවී සමමුහුර්ත මධ්‍යස්ථානය'
                    : 'Google Sheets Sync & Linking Hub'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-700/80 border border-emerald-500/30 text-[10px] font-semibold">
                  Official Integration
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                {language === 'si'
                  ? 'සාමාජිකයින් 26 දෙනාගේ සතිපතා දායක මුදල් (රු. 100/සතිය) සජීවීව සම්බන්ධ කරගන්න'
                  : 'Manage real-time two-way synchronization for 26 members (Rs 100/week)'}
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

        {/* Status Strip */}
        <div className="px-4 py-2.5 bg-emerald-50/90 border-b border-emerald-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-900">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold">
              {googleUser ? 'Google API Connected' : 'Live View Mode Connected'}
            </span>
            <span className="text-emerald-700">· {lastSyncTime}</span>
          </div>

          <div className="flex items-center gap-2">
            {googleUser ? (
              <button
                onClick={signOutFromGoogle}
                className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
              >
                Sign out ({googleUser.email?.split('@')[0]})
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                disabled={isGoogleLoggingIn}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md flex items-center gap-1 cursor-pointer"
              >
                {isGoogleLoggingIn && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('direct')}
            className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'direct'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'si' ? 'සජීවී ෂීට් සබැඳිය' : 'Live Sheet Link'}
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'si' ? 'CSV ආයාතය / Template' : 'CSV Import & Backup'}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'si' ? 'සමමුහුර්ත සැකසුම්' : 'Sync & Drive Options'}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {activeTab === 'direct' && (
            <div className="space-y-4">
              <form onSubmit={handleUrlSubmit} className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {language === 'si' ? 'ගූගල් ෂීට් සබැඳිය (Google Sheet URL)' : 'Google Sheet URL or Sheet ID'}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="flex-1 p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Save & Sync'}</span>
                  </button>
                </div>
              </form>

              {/* Direct Link Info Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    {language === 'si' ? 'නිල සම්බන්ධිත ලේඛනය' : 'Currently Connected Sheet'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyUrl}
                      className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={openGoogleSheetDirectly}
                      className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Sheet</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-600 truncate bg-white p-2 rounded-lg border border-slate-200">
                  {googleSheetUrl}
                </div>
              </div>

              {/* Sync Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => syncGoogleSheet()}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Fetch Latest Changes Now</span>
                </button>

                {googleUser && (
                  <button
                    type="button"
                    onClick={pushChangesToSheet}
                    disabled={isPushing}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isPushing ? 'Pushing...' : 'Push Local Changes to Sheet'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {language === 'si' ? 'CSV දත්ත ආයාත කරන්න' : 'Import Raw CSV Data'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Paste raw spreadsheet CSV text or upload an exported .csv file
                  </p>
                </div>
                <button
                  onClick={downloadCsvTemplate}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Template</span>
                </button>
              </div>

              <form onSubmit={handleCsvImport} className="space-y-3">
                <textarea
                  rows={5}
                  value={csvInput}
                  onChange={e => setCsvInput(e.target.value)}
                  placeholder="Paste CSV rows here: Member Code,Full Name,Phone,Week 1,Week 2..."
                  className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex items-center justify-between gap-3">
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload .CSV File</span>
                    <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Parse & Import
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="font-bold text-sm text-slate-900">
                  {language === 'si' ? 'ස්වයංක්‍රීය සමමුහුර්තකරණය' : 'Auto-Sync Frequency'}
                </h4>
                <div className="flex items-center gap-2">
                  {[0, 1, 5, 15, 30].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setAutoSyncMinutes(mins)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        autoSyncMinutes === mins
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {mins === 0 ? 'Manual only' : `${mins} min`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {language === 'si' ? 'ගෙවීම් සටහන් කළ විට සෘජු යාවත්කාලීන කිරීම' : 'Live Cell Write-Back'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Directly update the corresponding cell in Google Sheet when a payment is logged
                  </p>
                </div>
                <button
                  onClick={() => setWriteBackEnabled(!writeBackEnabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    writeBackEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {writeBackEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-blue-950">
                  Create Master Sheet in Google Drive
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Want to clone all 26 members into a brand new Google Spreadsheet in your own Google Drive?
                </p>
                <button
                  onClick={createAndLinkOfficialSheet}
                  disabled={isCreatingSheet}
                  className="mt-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{isCreatingSheet ? 'Creating in Drive...' : 'Create in My Google Drive'}</span>
                </button>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={resetToSampleData}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Reset to default local records
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenDriveModal();
            }}
            className="text-xs font-bold text-blue-700 hover:underline"
          >
            Open Google Drive Hub →
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            {language === 'si' ? 'වසන්න' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
