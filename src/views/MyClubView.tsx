import React from 'react';
import { useApp } from '../AppContext';
import { ClubLogo } from '../ClubLogo';
import { ShieldCheck, Calendar, DollarSign, CheckCircle2, AlertCircle, Clock, UserCheck, QrCode } from 'lucide-react';

export const MyClubView: React.FC = () => {
  const { language, t, currentUser, memberRecords, events, toggleEventRegistration, role, toggleRole } = useApp();

  const currentMember = memberRecords.find((m) => m.memberId === currentUser.id) || memberRecords[0];
  const registeredEvents = events.filter((ev) => ev.registeredMembers.includes(currentUser.id));

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'si' ? 'සාමාජික ඩිජිටල් හැඳුනුම්පත' : 'Digital Member Pass & Portal'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {t.navMyClub}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {language === 'si'
                ? 'ඔබගේ සතිපතා දායක මුදල් ගෙවීම් වාර්තාව, ලියාපදිංචි තරඟ සහ සාමාජික හැඳුනුම්පත් විස්තර.'
                : 'Track your weekly dues records, registered training slots, and digital club pass.'}
            </p>
          </div>

          <button
            onClick={toggleRole}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            <span>
              {role === 'organiser' ? t.roleMember : t.roleAdmin} (Switch)
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Membership Pass Card */}
        <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClubLogo size={48} />
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block">
                  YOUNG STAR SC
                </span>
                <span className="text-[10px] text-amber-200 font-bold tracking-wider block">
                  GAMUDAWA · SRI LANKA
                </span>
              </div>
            </div>
            <div className="p-2 bg-white/10 rounded-xl">
              <QrCode className="w-7 h-7 text-white" />
            </div>
          </div>

          <div className="space-y-1 pt-4">
            <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider block">
              MEMBER PASS
            </span>
            <h2 className="text-2xl font-black tracking-tight">
              {language === 'si' ? currentMember.nameSinhala : currentMember.name}
            </h2>
            <p className="text-xs text-amber-100 font-mono">
              Code: <strong className="text-white font-bold">{currentMember.memberCode}</strong> · {currentMember.category}
            </p>
          </div>

          <div className="pt-4 border-t border-amber-500/40 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-amber-200 block">STANDING</span>
              <span className="font-extrabold uppercase tracking-wider">
                {currentMember.status === 'good' ? 'Paid & Good' : 'Dues Pending'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-200 block">WEEKLY DUES</span>
              <span className="font-extrabold font-mono text-emerald-300">
                Rs {currentMember.totalPaid} Paid
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Dues Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {language === 'si' ? 'සතිපතා දායකත්ව වාර්තාව' : 'Personal Dues Ledger'}
              </span>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {language === 'si' ? 'සති 1 සිට 10 දක්වා ගෙවීම්' : 'Weeks 1 to 10 Payment Record'}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Total Paid: Rs {currentMember.totalPaid}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {Array.from({ length: 10 }, (_, i) => {
              const weekNum = i + 1;
              const isPaid = currentMember.weeks[weekNum] === 'paid';

              return (
                <div
                  key={weekNum}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 ${
                    isPaid
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span className="text-xs font-bold font-mono">Week {weekNum}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isPaid
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPaid ? '✓' : '•'}
                  </div>
                  <span className="text-[10px] font-semibold">
                    {isPaid ? 'Rs 100 Paid' : 'Rs 100 Due'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <span>
              {currentMember.totalOwed > 0
                ? `You have Rs ${currentMember.totalOwed} in outstanding dues. Please submit to Treasurer.`
                : 'All 10 weeks paid in full! Thank you for supporting Gamudawa sports.'}
            </span>
            <span className="font-bold text-amber-800 font-mono">
              Due: Rs {currentMember.totalOwed}
            </span>
          </div>
        </div>
      </div>

      {/* Registered Events */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            {language === 'si' ? 'වෙන්කරගත් තරඟ & පුහුණු' : 'My Bookings & Reservations'}
          </span>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            {language === 'si' ? 'මගේ ක්‍රීඩා කාලසටහන' : 'Registered Sessions'}
          </h2>
        </div>

        {registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registeredEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {ev.badge}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {language === 'si' ? ev.titleSinhala : ev.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {ev.date} · {ev.time} · {ev.location}
                  </p>
                </div>
                <button
                  onClick={() => toggleEventRegistration(ev.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors cursor-pointer shrink-0"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">No upcoming session reservations.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Visit the Events tab to register for cricket, volleyball, or training drills.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
