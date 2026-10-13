import React, { useState } from 'react';
import { useApp } from '../AppContext';
import {
  ShieldAlert,
  DollarSign,
  FileSpreadsheet,
  Globe,
  RefreshCw,
  FolderOpen,
  Calendar,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { LiveDataEditor } from '../components/LiveDataEditor';

interface AdminViewProps {
  onOpenSheetModal: () => void;
  onOpenUploadDocModal?: () => void;
  onOpenCreateEventModal?: () => void;
  onOpenDriveModal?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  onOpenSheetModal,
  onOpenUploadDocModal,
  onOpenCreateEventModal,
  onOpenDriveModal
}) => {
  const {
    language,
    t,
    setActiveTab,
    memberRecords,
    recordPayment,
    openGoogleSheetDirectly,
    syncGoogleSheet,
    isSyncing,
    showToast
  } = useApp();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(memberRecords[0]?.memberId || '');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<'paid' | 'due'>('paid');

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    recordPayment(selectedMemberId, selectedWeek, selectedStatus);
    showToast(
      language === 'si'
        ? 'ගෙවීම් වාර්තාව සාර්ථකව යාවත්කාලීන විය!'
        : `Week ${selectedWeek} payment updated successfully!`
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'si' ? 'සංවිධායක පරිපාලක පුවරුව' : 'Organiser Administrator Console'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {t.adminTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {t.adminSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('master-doc')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              title="Open the Full Master Document Webpage"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>{language === 'si' ? 'සජීවී ප්‍රධාන ලේඛනය' : 'Living Master Document'}</span>
            </button>

            <button
              onClick={openGoogleSheetDirectly}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t.openGoogleSheet}</span>
            </button>

            {onOpenDriveModal && (
              <button
                onClick={onOpenDriveModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                title="Web Page URL, QR Code & Google Drive Hosting Hub"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'si' ? 'වෙබ් පිටුව & Drive' : 'Web & Drive Link'}</span>
              </button>
            )}

            <button
              onClick={() => syncGoogleSheet()}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Fast Member Dues Recording Form */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800">
              <DollarSign className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {t.updatePaymentBtn}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'si'
                  ? 'සාමාජිකයෙකුගේ සතිපතා ගෙවීමක් (රු. 100) සටහන් කරන්න'
                  : `Mark week payment (Rs 100/wk) for any of the ${memberRecords.length} members`}
              </p>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.colMember}</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
              >
                {memberRecords.map((m) => (
                  <option key={m.memberId} value={m.memberId}>
                    {m.memberCode} - {m.name} ({m.nameSinhala}) - Due: Rs {m.totalOwed}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Week Number (1-10)
                </label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
                    <option key={w} value={w}>
                      Week {w} (Rs 100)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  <option value="paid" className="text-emerald-700 font-bold">
                    ✓ Paid (Rs 100 received)
                  </option>
                  <option value="due" className="text-amber-700 font-bold">
                    • Payment Due (Unpaid)
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {language === 'si' ? 'ගෙවීම සටහන් කර ෂීට් එකට යවන්න' : 'Save Payment Record & Sync'}
            </button>
          </form>
        </div>

        {/* Quick Integrations Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {language === 'si' ? 'සංවිධායක කෙටිමං' : 'Organiser Quick Links & Integrations'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={onOpenSheetModal}
              className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all cursor-pointer group"
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-slate-900 text-sm">{t.configureSheet}</p>
              <p className="text-xs text-slate-500 mt-0.5">Inspect or paste Google Sheet URL</p>
            </button>

            {onOpenUploadDocModal && (
              <button
                onClick={onOpenUploadDocModal}
                className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all cursor-pointer group"
              >
                <FolderOpen className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-slate-900 text-sm">{t.uploadDocBtn}</p>
                <p className="text-xs text-slate-500 mt-0.5">Link PDF/Doc to Google Drive Hub</p>
              </button>
            )}

            {onOpenCreateEventModal && (
              <button
                onClick={onOpenCreateEventModal}
                className="p-4 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all cursor-pointer group"
              >
                <Calendar className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-slate-900 text-sm">{t.createEventBtn}</p>
                <p className="text-xs text-slate-500 mt-0.5">Add cricket match or training drill</p>
              </button>
            )}
          </div>
        </div>

        {/* Universal Web Page Live Content & Data Editor */}
        <div className="pt-2">
          <LiveDataEditor />
        </div>
      </div>
    </div>
  );
};
