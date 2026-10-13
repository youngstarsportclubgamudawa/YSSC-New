import React, { useState } from 'react';
import { useApp } from '../AppContext';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  RefreshCw,
  Search,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Globe,
  TriangleAlert,
  Download
} from 'lucide-react';
import { GoogleSheetDataModal } from '../components/GoogleSheetDataModal';

interface FinancesViewProps {
  onOpenSheetModal: () => void;
  onOpenPaymentModal?: () => void;
  onOpenDriveModal?: () => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  onOpenSheetModal,
  onOpenDriveModal
}) => {
  const {
    language,
    t,
    role,
    financeSummary,
    memberRecords,
    expenses,
    googleSheetUrl,
    updateGoogleSheetUrl,
    syncGoogleSheet,
    isSyncing,
    lastSyncTime,
    recordPayment,
    openGoogleSheetDirectly,
    googleUser,
    isPushing,
    pushChangesToSheet,
    autoSyncMinutes
  } = useApp();

  const [inputUrl, setInputUrl] = useState(googleSheetUrl);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'good' | 'due' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [confirmPushModalOpen, setConfirmPushModalOpen] = useState(false);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      updateGoogleSheetUrl(inputUrl.trim());
      await syncGoogleSheet(inputUrl.trim());
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(googleSheetUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handlePushConfirm = async () => {
    setConfirmPushModalOpen(false);
    await pushChangesToSheet();
  };

  const filteredMembers = memberRecords.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.nameSinhala.includes(q) ||
      m.memberCode.toLowerCase().includes(q) ||
      m.phone.includes(q);

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {language === 'si' ? 'ගූගල් ෂීට් සජීවීව සම්බන්ධයි' : 'Live Google Sheet Sync Active'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {t.financesTitle}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              {t.financesSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-200 pt-1">
              <span>{t.weeklyFeeNotice}</span>
              <span>•</span>
              <span>
                {language === 'si' ? 'අවසන් යාවත්කාලීන වීම:' : 'Last Synced:'} {lastSyncTime}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={openGoogleSheetDirectly}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-emerald-900 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>{t.openGoogleSheet}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => syncGoogleSheet()}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/60 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm border border-emerald-400/40 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>
                {isSyncing ? (language === 'si' ? 'යාවත්කාලීන වෙමින්...' : 'Syncing...') : t.syncSheet}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Google Sheet Live Connection Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-150 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800 shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                  {language === 'si'
                    ? 'ගූගල් ෂීට් සජීවී දත්ත සම්බන්ධතාව'
                    : 'Google Sheet Real-Time Integration'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {memberRecords.length} {language === 'si' ? 'සාමාජිකයින්' : 'Members'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'si'
                  ? 'ඔබගේ ගූගල් ෂීට් සබැඳිය සම්බන්ධ කර සෘජුව දත්ත ලබාගන්න හෝ පරික්ෂා කරන්න'
                  : 'Connected directly to Google Sheets for live dues tracking and member payment verification'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {googleUser && (
              <button
                onClick={() => setConfirmPushModalOpen(true)}
                disabled={isPushing}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer disabled:opacity-50"
                title="Push all dues and payment records to connected Google Sheet"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPushing ? 'animate-spin' : ''}`} />
                <span>{language === 'si' ? 'ෂීට් එකට යවන්න' : 'Push to Sheet'}</span>
              </button>
            )}

            <button
              onClick={() => setInspectModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Inspect raw rows and columns from Google Sheet"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'si' ? 'සම්පූර්ණ වගුව බලන්න' : 'Inspect Exact Table'}</span>
            </button>

            <button
              onClick={onOpenSheetModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
            >
              <span>{language === 'si' ? 'සමමුහුර්ත මධ්‍යස්ථානය' : 'Sheet Sync Hub'}</span>
            </button>

            {onOpenDriveModal && (
              <button
                onClick={onOpenDriveModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors cursor-pointer font-mono"
                title="Official Live Link: tinyurl.com/yssc-gamudawa"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>tinyurl.com/yssc-gamudawa</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste any Google Sheet URL (https://docs.google.com/spreadsheets/d/...)"
                className="w-full pl-3 pr-20 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-mono"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="absolute right-2 top-2 px-2 py-1 rounded text-[10px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSyncing}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>
                {isSyncing
                  ? language === 'si'
                    ? 'දත්ත ලබාගනිමින්...'
                    : 'Fetching Sheet...'
                  : language === 'si'
                  ? 'සජීවීව සම්බන්ධ කරන්න'
                  : 'Load Exact Sheet'}
              </span>
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                Mode:{' '}
                <strong className="text-slate-700">
                  {googleUser ? 'Two-Way Live API (Write-Back Active)' : 'Public Link Sync'}
                </strong>
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Last sync: <strong className="text-slate-700">{lastSyncTime}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Auto-Sync:</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {autoSyncMinutes > 0 ? `Every ${autoSyncMinutes}m` : 'Manual'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.totalIncome}</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 font-mono">
            Rs {financeSummary.totalIncome.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Dues + Sponsorships</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.totalExpenses}</span>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-700 mt-2 font-mono">
            Rs {financeSummary.totalExpenses.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Ground & Equipment</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.netBalance}</span>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-700 mt-2 font-mono">
            Rs {financeSummary.netBalance.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Audited Net Treasury</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.collectedDues}</span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-2 font-mono">
            Rs {financeSummary.weeklyDuesCollected.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-600 mt-0.5 font-semibold">Weeks 1–10 Paid</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.pendingDues}</span>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-2 font-mono">
            Rs {financeSummary.weeklyDuesPending.toLocaleString()}
          </p>
          <p className="text-[10px] text-amber-600 mt-0.5 font-semibold">Rs 100/wk per Member</p>
        </div>
      </div>

      {/* 26-Member Dues Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-150 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{t.allMembersDues}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Rs 100/wk
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-normal mt-0.5">
              {language === 'si'
                ? `සියලුම සාමාජිකයින් ${memberRecords.length} දෙනාගේ 1 සිට 10 දක්වා සතිපතා ගෙවීම් වාර්තාව`
                : 'Individual payment records for Weeks 1 to 10 synced live with Google Sheets'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchMemberPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-800"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterAll}
              </button>
              <button
                onClick={() => setFilterStatus('good')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterStatus === 'good'
                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterGood}
              </button>
              <button
                onClick={() => setFilterStatus('due')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterStatus === 'due'
                    ? 'bg-white text-amber-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterDue}
              </button>
              <button
                onClick={() => setFilterStatus('overdue')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterStatus === 'overdue'
                    ? 'bg-white text-rose-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterOverdue}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-600 font-medium">
          <span className="text-slate-500">{language === 'si' ? 'සංකේත:' : 'Status Legend:'}</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{language === 'si' ? 'ගෙවා ඇත (රු. 100)' : 'Paid (Rs 100)'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>{language === 'si' ? 'ගෙවීමට ඇත' : 'Payment Due'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>{language === 'si' ? 'ප්‍රමාදයි' : 'Overdue'}</span>
          </span>
          <span className="ml-auto text-slate-400 italic hidden md:inline">
            {role === 'organiser'
              ? language === 'si'
                ? 'සංවිධායක: සතියක තත්ත්වය ක්ලික් කර වෙනස් කරන්න'
                : 'Admin Tip: Click any week circle to toggle paid status'
              : language === 'si'
              ? 'සතිපතා ගාස්තු ගූගල් ෂීට් මඟින් යාවත්කාලීන වේ'
              : 'Records auto-synced from Google Sheets'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 min-w-[820px]">
            <thead className="bg-slate-100/90 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-44">{t.colMember}</th>
                <th className="py-3 px-3 w-24">{t.colCategory}</th>
                {Array.from({ length: 10 }, (_, i) => (
                  <th key={i + 1} className="py-3 px-3 text-center">
                    W{i + 1}
                  </th>
                ))}
                <th className="py-3 px-3 text-right">{t.colTotalPaid}</th>
                <th className="py-3 px-3 text-right">{t.colTotalOwed}</th>
                <th className="py-3 px-4 text-center">{t.colStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredMembers.map((m) => {
                const isGood = m.status === 'good';
                const isOverdue = m.status === 'overdue';

                return (
                  <tr key={m.memberId} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">
                          {language === 'si' ? m.nameSinhala : m.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-0.5">
                          <span className="font-semibold text-amber-700">{m.memberCode}</span>
                          <span>•</span>
                          <span>{m.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {language === 'si' ? m.categorySinhala : m.category}
                      </span>
                    </td>
                    {Array.from({ length: 10 }, (_, i) => {
                      const weekNum = i + 1;
                      const isPaid = m.weeks[weekNum] === 'paid';

                      return (
                        <td key={weekNum} className="py-3 px-2 text-center">
                          <button
                            disabled={role !== 'organiser'}
                            onClick={() => {
                              if (role === 'organiser') {
                                recordPayment(m.memberId, weekNum, isPaid ? 'due' : 'paid');
                              }
                            }}
                            title={
                              role === 'organiser'
                                ? `Week ${weekNum}: ${isPaid ? 'Paid (Click to mark Due)' : 'Due (Click to mark Paid)'}`
                                : `Week ${weekNum}: ${isPaid ? 'Paid' : 'Unpaid'}`
                            }
                            className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-bold transition-transform ${
                              role === 'organiser' ? 'cursor-pointer hover:scale-115' : 'cursor-default'
                            } ${
                              isPaid
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {isPaid ? '✓' : '•'}
                          </button>
                        </td>
                      );
                    })}
                    <td className="py-3 px-3 text-right font-bold text-emerald-700 font-mono">
                      Rs {m.totalPaid.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-amber-800 font-mono">
                      {m.totalOwed > 0 ? `Rs ${m.totalOwed.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isGood
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isOverdue
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isGood ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : isOverdue ? (
                          <TriangleAlert className="w-3 h-3 text-rose-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600" />
                        )}
                        <span>
                          {isGood ? t.statusGood : isOverdue ? t.statusOverdue : t.statusDue}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={15} className="px-6 py-12 text-center">
                    <Search className="mx-auto h-7 w-7 text-slate-400" />
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {language === 'si' ? 'සාමාජික වාර්තා හමු නොවීය' : 'No member records found'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {language === 'si' ? 'සෙවුම හෝ පෙරහන වෙනස් කරන්න.' : 'Adjust the search or status filter.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <span>
            {language === 'si' ? 'පෙන්වන්නේ සාමාජිකයින්:' : 'Showing members:'}{' '}
            <strong>
              {filteredMembers.length} of {memberRecords.length}
            </strong>
          </span>
          <button
            onClick={openGoogleSheetDirectly}
            className="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:underline cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t.openGoogleSheet}</span>
          </button>
        </div>
      </div>

      {/* Expenses Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              {language === 'si' ? 'වියදම් ලේඛනය' : 'Expense Ledger'}
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'si' ? 'සමාජයේ මෑත වියදම්' : 'Recent Club Expenditures'}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
            Total: Rs {expenses.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Expense Details</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Receipt #</th>
                <th className="p-2.5 text-right">Amount (Rs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-500">{exp.date}</td>
                  <td className="p-2.5 font-medium text-slate-900">{exp.expenseDetails}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-slate-400">{exp.receiptNumber}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-rose-600">
                    Rs {exp.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Push to Sheet */}
      {confirmPushModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-amber-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Push Updates to Google Sheet?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will write the latest dues and payment status of all{' '}
              <strong>{memberRecords.length} members</strong> directly into your connected Google Sheet.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmPushModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePushConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                Confirm & Push to Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      <GoogleSheetDataModal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
      />
    </div>
  );
};
