import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ClubLogo } from '../ClubLogo';
import {
  Sparkles,
  ArrowRight,
  DollarSign,
  Calendar,
  Users,
  Globe,
  TrendingUp,
  Clock,
  ExternalLink,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Trophy
} from 'lucide-react';
import { GoogleSheetDataModal } from '../components/GoogleSheetDataModal';

interface HomeViewProps {
  onOpenSheetModal: () => void;
  onOpenDriveModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenSheetModal, onOpenDriveModal }) => {
  const {
    language,
    t,
    setActiveTab,
    financeSummary,
    memberRecords,
    weeklyDrills,
    openGoogleSheetDirectly,
    managementLeaders
  } = useApp();

  const [sheetDataModalOpen, setSheetDataModalOpen] = useState(false);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xs p-6 sm:p-10 lg:p-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.clubMotto}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {language === 'si' ? (
                <>
                  <span className="text-amber-800">තරුණ තරු</span> ක්‍රීඩා සමාජය ගම්උදාව
                </>
              ) : (
                <>
                  YSSC <span className="text-amber-800">Sports Club</span> Gamudawa
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {t.heroTagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('finances')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>{t.viewFinancesBtn}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActiveTab('cricket')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-emerald-300" />
                <span>{language === 'si' ? 'ක්‍රිකට් වාර්තා & තරඟ' : 'Cricket Hub & Match Poll'}</span>
              </button>

              <button
                onClick={() => setActiveTab('cricket-stats')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>{language === 'si' ? 'ක්‍රිකට් ප්‍රස්ථාර (Recharts)' : 'Cricket Charts Dashboard'}</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-600" />
                <span>{t.viewEventsBtn}</span>
              </button>

              <button
                onClick={() => setActiveTab('management')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-semibold text-sm transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-amber-700" />
                <span>{t.viewManagementBtn}</span>
              </button>

              {onOpenDriveModal && (
                <button
                  onClick={onOpenDriveModal}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-semibold text-sm transition-colors cursor-pointer"
                  title="Web Page URL, QR Code & Google Drive Hosting Hub"
                >
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>{language === 'si' ? 'වෙබ් පිටුව & Drive' : 'Web & Drive Link'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-50 to-amber-50/50 border border-slate-200 shadow-xs">
            <ClubLogo size={140} />
            <div className="mt-4 text-center space-y-0.5">
              <span className="font-extrabold text-slate-900 text-base uppercase tracking-wider">YSSC</span>
              <p className="text-xs font-semibold text-amber-800">Gamudawa Grounds</p>
              <p className="text-[11px] text-slate-500 font-mono">Estd. 1998 · Affiliated</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => setActiveTab('finances')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.statMembers}</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{memberRecords.length}</p>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'si' ? 'සතිපතා ගාස්තු ගෙවන' : 'Weekly paying members'}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('finances')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.statDuesCollected}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-2 font-mono">
            Rs {financeSummary.weeklyDuesCollected.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'si' ? 'සතියකට රු. 100 බැගින්' : 'At Rs 100 per week'}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('finances')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.pendingDues}</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-2 font-mono">
            Rs {financeSummary.weeklyDuesPending.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'si' ? 'හිඟ සතිපතා දායක මුදල්' : 'Pending weekly dues'}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('finances')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.statTreasury}</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-2 font-mono">
            Rs {financeSummary.netBalance.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'si' ? 'ශුද්ධ සමාජ ශේෂය' : 'Net club treasury'}
          </p>
        </div>
      </div>

      {/* Quick Dues Ledger Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              {language === 'si' ? 'සතිපතා දායක මුදල්' : 'Weekly Membership Dues'}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {language === 'si' ? 'සාමාජික ගාස්තු සාරාංශය (සතියකට රු. 100)' : 'Dues Ledger (Rs 100/week)'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSheetDataModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'si' ? 'ෂීට් පරීක්ෂාව' : 'Inspect Sheet Data'}</span>
            </button>
            <button
              onClick={openGoogleSheetDirectly}
              className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>{t.openGoogleSheet}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3"># Code</th>
                <th className="p-3">Member Name</th>
                <th className="p-3 hidden sm:table-cell">Category</th>
                <th className="p-3 text-right">Total Paid</th>
                <th className="p-3 text-right">Due</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memberRecords.slice(0, 6).map((m) => (
                <tr key={m.memberId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">{m.memberCode}</td>
                  <td className="p-3 font-medium text-slate-900">
                    <div>{m.name}</div>
                    <div className="text-[10px] text-slate-400 font-sinhala">{m.nameSinhala}</div>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-slate-600">{m.category}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">
                    Rs {m.totalPaid.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-amber-700">
                    {m.totalOwed > 0 ? `Rs ${m.totalOwed.toLocaleString()}` : '—'}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        m.status === 'good'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : m.status === 'overdue'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {m.status === 'good' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                      )}
                      <span>
                        {m.status === 'good' ? t.statusGood : m.status === 'overdue' ? t.statusOverdue : t.statusDue}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {language === 'si'
              ? `සාමාජිකයින් 26 න් 6 දෙනෙකු පෙන්වයි`
              : `Showing 6 of ${memberRecords.length} registered members`}
          </span>
          <button
            onClick={() => setActiveTab('finances')}
            className="text-amber-800 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'si' ? 'සම්පූර්ණ ලේඛනය බලන්න' : 'View Full 26-Member Ledger'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Weekly Drills & Leadership Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Drills */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {language === 'si' ? 'පුහුණු කාලසටහන' : 'Weekly Drills & Practice'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {language === 'si' ? 'ගම්උදාව ක්‍රීඩාංගණ සැසි' : 'Ground Timetable'}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs text-amber-800 font-bold hover:underline cursor-pointer"
            >
              {t.viewEventsBtn}
            </button>
          </div>

          <div className="space-y-2.5">
            {weeklyDrills.slice(0, 4).map((d) => (
              <div
                key={d.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {language === 'si' ? d.daySinhala : d.day}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                      {language === 'si' ? d.targetGroupSinhala : d.targetGroup}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    {language === 'si' ? d.sessionSinhala : d.session}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-slate-700 font-semibold">{d.time}</p>
                  <p className="text-[10px] text-slate-400">{d.coach}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Club Leadership */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {language === 'si' ? 'සමාජ නායකයින්' : 'Club Leadership'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {language === 'si' ? 'ප්‍රධාන නිලධාරීන්' : 'Key Leaders of YSSC'}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('management')}
              className="px-4 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.viewManagementBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {managementLeaders.slice(0, 4).map((leader) => (
              <div
                key={leader.id}
                onClick={() => setActiveTab('management')}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center space-y-2 hover:bg-amber-50/50 cursor-pointer transition-colors"
              >
                <img
                  src={leader.photoUrl || '/yssc-logo.png'}
                  alt={leader.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/yssc-logo.png';
                  }}
                />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 text-xs leading-tight line-clamp-1">
                    {language === 'si' ? leader.nameSinhala : leader.name}
                  </p>
                  <p className="text-[11px] text-amber-800 font-semibold line-clamp-1">
                    {language === 'si' ? leader.designationSinhala : leader.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GoogleSheetDataModal
        isOpen={sheetDataModalOpen}
        onClose={() => setSheetDataModalOpen(false)}
      />
    </div>
  );
};
