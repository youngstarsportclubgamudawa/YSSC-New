import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import {
  Trophy,
  Flame,
  Activity,
  PlusCircle,
  FileSpreadsheet,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  Vote,
  Users,
  Megaphone,
  Radio,
  Share2,
  Trash2,
  Edit3,
  Shield,
  Clock,
  MapPin,
  TrendingUp,
  Target,
  RefreshCw,
  Send,
  MessageCircle,
  Award
} from 'lucide-react';
import { DailyCricketEntry } from '../types';

export const CricketView: React.FC = () => {
  const {
    language,
    role,
    currentUser,
    memberRecords,
    cricketEntries,
    cricketSheetUrl,
    updateCricketSheetUrl,
    addOrUpdateCricketEntry,
    deleteCricketEntry,
    syncCricketEntriesToSheet,
    openCricketSheetDirectly,
    matchOrganizing,
    voteInMatchPoll,
    updateMatchOrganizing,
    assignSquadPlayer,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    setActiveTab,
    showToast
  } = useApp();

  // Tab section
  const [subTab, setSubTab] = useState<'career' | 'addRecord' | 'matchPoll' | 'organizing' | 'announcements'>('career');

  // Search and filter for career stats
  const [searchMember, setSearchMember] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sheetUrlInput, setSheetUrlInput] = useState(cricketSheetUrl);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);

  // Daily Entry Form State (for members to record daily runs & wickets)
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(currentUser.id || memberRecords[0]?.memberId || '');
  const [matchType, setMatchType] = useState<'Daily Practice' | 'Club Match' | 'Tournament' | 'Friendly'>('Daily Practice');
  const [runsScored, setRunsScored] = useState<number>(0);
  const [ballsFaced, setBallsFaced] = useState<number>(0);
  const [fours, setFours] = useState<number>(0);
  const [sixes, setSixes] = useState<number>(0);
  const [isNotOut, setIsNotOut] = useState<boolean>(false);
  const [oversBowled, setOversBowled] = useState<number>(0);
  const [maidens, setMaidens] = useState<number>(0);
  const [runsConceded, setRunsConceded] = useState<number>(0);
  const [wicketsTaken, setWicketsTaken] = useState<number>(0);
  const [catches, setCatches] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // New Announcement Form State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'normal' | 'urgent' | 'info'>('normal');

  // Calculate aggregated stats per player
  const playerStatsMap = useMemo(() => {
    const map: Record<string, {
      memberId: string;
      name: string;
      memberCode: string;
      matches: number;
      runs: number;
      balls: number;
      highestScore: number;
      fours: number;
      sixes: number;
      notOuts: number;
      wickets: number;
      overs: number;
      runsConceded: number;
      catches: number;
      fiveWickets: number;
    }> = {};

    cricketEntries.forEach(entry => {
      const pid = entry.memberId;
      if (!map[pid]) {
        map[pid] = {
          memberId: pid,
          name: entry.memberName,
          memberCode: entry.memberCode,
          matches: 0,
          runs: 0,
          balls: 0,
          highestScore: 0,
          fours: 0,
          sixes: 0,
          notOuts: 0,
          wickets: 0,
          overs: 0,
          runsConceded: 0,
          catches: 0,
          fiveWickets: 0
        };
      }
      map[pid].matches += 1;
      map[pid].runs += Number(entry.runsScored) || 0;
      map[pid].balls += Number(entry.ballsFaced) || 0;
      if (entry.runsScored > map[pid].highestScore) {
        map[pid].highestScore = entry.runsScored;
      }
      map[pid].fours += Number(entry.fours) || 0;
      map[pid].sixes += Number(entry.sixes) || 0;
      if (entry.isNotOut) map[pid].notOuts += 1;
      map[pid].wickets += Number(entry.wicketsTaken) || 0;
      map[pid].overs += Number(entry.oversBowled) || 0;
      map[pid].runsConceded += Number(entry.runsConceded) || 0;
      map[pid].catches += Number(entry.catches) || 0;
      if (entry.wicketsTaken >= 5) map[pid].fiveWickets += 1;
    });

    return Object.values(map);
  }, [cricketEntries]);

  // Overall totals
  const totalCareerRuns = useMemo(() => cricketEntries.reduce((acc, curr) => acc + (Number(curr.runsScored) || 0), 0), [cricketEntries]);
  const totalCareerWickets = useMemo(() => cricketEntries.reduce((acc, curr) => acc + (Number(curr.wicketsTaken) || 0), 0), [cricketEntries]);
  const totalPracticeSessions = cricketEntries.length;

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return cricketEntries.filter(entry => {
      const matchesSearch =
        entry.memberName.toLowerCase().includes(searchMember.toLowerCase()) ||
        entry.memberCode.toLowerCase().includes(searchMember.toLowerCase());
      const matchesType = filterType === 'all' || entry.matchType === filterType;
      return matchesSearch && matchesType;
    });
  }, [cricketEntries, searchMember, filterType]);

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const playerObj = memberRecords.find(m => m.memberId === selectedPlayerId) || {
      name: currentUser.name,
      memberCode: currentUser.memberCode
    };

    addOrUpdateCricketEntry({
      date: entryDate,
      memberId: selectedPlayerId,
      memberName: playerObj.name,
      memberCode: playerObj.memberCode,
      matchType,
      runsScored: Number(runsScored),
      ballsFaced: Number(ballsFaced),
      fours: Number(fours),
      sixes: Number(sixes),
      isNotOut,
      oversBowled: Number(oversBowled),
      maidens: Number(maidens),
      runsConceded: Number(runsConceded),
      wicketsTaken: Number(wicketsTaken),
      catches: Number(catches),
      stumpings: 0,
      notes,
      syncedToSheet: true
    }, editingEntryId || undefined);

    // Reset form
    setEditingEntryId(null);
    setRunsScored(0);
    setBallsFaced(0);
    setFours(0);
    setSixes(0);
    setIsNotOut(false);
    setOversBowled(0);
    setMaidens(0);
    setRunsConceded(0);
    setWicketsTaken(0);
    setCatches(0);
    setNotes('');
    setSubTab('career');
  };

  const startEditEntry = (entry: DailyCricketEntry) => {
    setEditingEntryId(entry.id);
    setSelectedPlayerId(entry.memberId);
    setEntryDate(entry.date);
    setMatchType(entry.matchType);
    setRunsScored(entry.runsScored);
    setBallsFaced(entry.ballsFaced);
    setFours(entry.fours);
    setSixes(entry.sixes);
    setIsNotOut(entry.isNotOut);
    setOversBowled(entry.oversBowled);
    setMaidens(entry.maidens);
    setRunsConceded(entry.runsConceded);
    setWicketsTaken(entry.wicketsTaken);
    setCatches(entry.catches);
    setNotes(entry.notes || '');
    setSubTab('addRecord');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
    addAnnouncement({
      title: newAnnTitle,
      titleSinhala: newAnnTitle,
      content: newAnnContent,
      contentSinhala: newAnnContent,
      priority: newAnnPriority,
      author: `${currentUser.name} (${role === 'organiser' ? 'Executive Committee' : 'Player'})`,
      targetGroup: 'Cricket Team & Members'
    });
    setNewAnnTitle('');
    setNewAnnContent('');
    showToast(language === 'si' ? 'නිවේදනය පළ විය!' : 'Announcement published!');
  };

  const handleSyncToSheet = async () => {
    setIsSyncingSheet(true);
    await syncCricketEntriesToSheet();
    setIsSyncingSheet(false);
  };

  // WhatsApp share generator
  const generateWhatsAppMessage = () => {
    const text = `🏏 *YOUNG STAR SPORTS CLUB (YSSC) - CRICKET MATCH POLL* 🏏%0A%0A` +
      `📅 *Date:* ${matchOrganizing.matchDate} at ${matchOrganizing.matchTime}%0A` +
      `📍 *Ground:* ${matchOrganizing.venue}%0A` +
      `⚡ *Match:* ${matchOrganizing.title} (${matchOrganizing.overs} Overs)%0A` +
      `👕 *Dress Code:* ${matchOrganizing.kitDressCode}%0A` +
      `💵 *Fee:* Rs ${matchOrganizing.entryFeePerPlayer} per player%0A%0A` +
      `❓ *Poll Question:* ${matchOrganizing.pollQuestion}%0A%0A` +
      `*Options & Live Responses:*%0A` +
      matchOrganizing.pollOptions.map(opt => `👉 *${opt.label}*: ${opt.votes.length} votes`).join('%0A') +
      `%0A%0A📲 Open YSSC Club Portal to cast your vote & log daily scores: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Check if current user voted
  const currentUserVoteOptionId = matchOrganizing.pollOptions.find(opt =>
    opt.votes.includes(currentUser.id)
  )?.id;

  const totalVotesCount = matchOrganizing.pollOptions.reduce((acc, opt) => acc + opt.votes.length, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'si' ? 'ක්‍රිකට් දෛනික වාර්තා & තරඟ සංවිධාන' : 'Cricket Career & Match Coordination Hub'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {language === 'si' ? 'YSSC ක්‍රිකට් වාර්තා හා තරඟ කළමනාකරණය' : 'YSSC Daily Cricket Performance & Match Organizing'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {language === 'si'
                ? 'සෑම සාමාජිකයෙකුටම තමන් දිනපතා ක්‍රීඩා කර ලබාගත් ලකුණු (Runs) සහ බිඳහෙලූ කඩුලු (Wickets) ඇතුළත් කළ හැක. එය වෙනමම ගූගල් ෂීට් ලේඛනයක සුරැකී සජීවීව විශ්ලේෂණය වේ.'
                : 'Every member can record their daily scored runs and wickets. Automatically synced to a dedicated Google Sheet for deep performance analytics, team WhatsApp poll voting, and match coordinating.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={openCricketSheetDirectly}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              title="Open Dedicated Cricket Career Google Sheet"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{language === 'si' ? 'ක්‍රිකට් Google Sheet විවෘත කරන්න' : 'Open Cricket Google Sheet'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={handleSyncToSheet}
              disabled={isSyncingSheet}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingSheet ? 'animate-spin' : ''}`} />
              <span>{isSyncingSheet ? 'Syncing...' : 'Sync Sheet Now'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <p className="text-[11px] text-slate-300 font-medium">Total Career Runs</p>
            <p className="text-xl sm:text-2xl font-extrabold text-amber-300">{totalCareerRuns.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <p className="text-[11px] text-slate-300 font-medium">Total Wickets Taken</p>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-300">{totalCareerWickets}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <p className="text-[11px] text-slate-300 font-medium">Matches / Drills Logged</p>
            <p className="text-xl sm:text-2xl font-extrabold text-blue-300">{totalPracticeSessions}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <p className="text-[11px] text-slate-300 font-medium">Match Squad Confirmed</p>
            <p className="text-xl sm:text-2xl font-extrabold text-purple-300">{matchOrganizing.confirmedSquad.length} Players</p>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSubTab('career')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            subTab === 'career'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{language === 'si' ? 'සියලු ක්‍රිකට් වාර්තා & විශ්ලේෂණ' : 'Career Records & Stats'}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900/10">
            {cricketEntries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cricket-stats')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white shadow-sm border border-emerald-600/40"
        >
          <TrendingUp className="w-4 h-4 text-emerald-300" />
          <span>{language === 'si' ? 'ප්‍රස්ථාර සහ දත්ත පුවරුව (Recharts Charts)' : 'Performance Charts Dashboard'}</span>
        </button>

        <button
          onClick={() => {
            setEditingEntryId(null);
            setSubTab('addRecord');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            subTab === 'addRecord'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'si' ? '+ දෛනික ලකුණු / කඩුලු ඇතුළත් කිරීම' : '+ Add Daily Performance'}</span>
        </button>

        <button
          onClick={() => setSubTab('matchPoll')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            subTab === 'matchPoll'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Vote className="w-4 h-4" />
          <span>{language === 'si' ? 'WhatsApp තරඟ ඡන්දය (Poll)' : 'WhatsApp Match Poll'}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            {totalVotesCount} Votes
          </span>
        </button>

        <button
          onClick={() => setSubTab('organizing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            subTab === 'organizing'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'si' ? 'කණ්ඩායම් කළමනාකරණය (Teams)' : 'Match Squad & Teams'}</span>
        </button>

        <button
          onClick={() => setSubTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            subTab === 'announcements'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>{language === 'si' ? 'නිල නිවේදන (Announcements)' : 'Club Announcements'}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 font-bold">
            {announcements.length}
          </span>
        </button>
      </div>

      {/* SUBTAB 1: CAREER RECORDS & STATS */}
      {subTab === 'career' && (
        <div className="space-y-6">
          {/* Top Leaderboard Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Top Run Scorer Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-900 text-sm">Top Run Scorers</h3>
                </div>
                <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">Batting</span>
              </div>
              <div className="space-y-2.5">
                {playerStatsMap
                  .sort((a, b) => b.runs - a.runs)
                  .slice(0, 3)
                  .map((p, idx) => (
                    <div key={p.memberId} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-[10px] text-slate-500">{p.matches} inns • HS: {p.highestScore}*</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-sm">{p.runs} runs</p>
                        <p className="text-[10px] text-slate-500">{p.fours} 4s • {p.sixes} 6s</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Wicket Takers Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Leading Wicket Takers</h3>
                </div>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Bowling</span>
              </div>
              <div className="space-y-2.5">
                {playerStatsMap
                  .sort((a, b) => b.wickets - a.wickets)
                  .slice(0, 3)
                  .map((p, idx) => (
                    <div key={p.memberId} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-[10px] text-slate-500">{p.overs} overs • Econ: {p.overs > 0 ? (p.runsConceded / p.overs).toFixed(1) : '-'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-sm">{p.wickets} wkts</p>
                        <p className="text-[10px] text-slate-500">{p.runsConceded} runs conceded</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Google Sheet Sync Hub Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-sm">Separate Google Sheet Sync</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every member entry instantly writes into your dedicated Cricket Career Sheet for analysis and formulas.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-800 font-mono bg-white p-2 rounded-lg border border-emerald-200 truncate">
                  <span className="truncate">{cricketSheetUrl}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-emerald-200/60">
                <button
                  onClick={openCricketSheetDirectly}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Sheet</span>
                </button>
                <button
                  onClick={handleSyncToSheet}
                  className="py-2 px-3 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Push</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search, Filter & Quick Record Button */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search player or ID..."
                  value={searchMember}
                  onChange={e => setSearchMember(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
              >
                <option value="all">All Match Types</option>
                <option value="Daily Practice">Daily Practice</option>
                <option value="Club Match">Club Match</option>
                <option value="Tournament">Tournament</option>
                <option value="Friendly">Friendly</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingEntryId(null);
                setSubTab('addRecord');
              }}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Today's Performance</span>
            </button>
          </div>

          {/* Daily Records Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Daily Performance Ledger ({filteredEntries.length} Records)</h3>
                <p className="text-[11px] text-slate-500">Member-by-member daily practice & match runs, balls, wickets and overs</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Synced with Google Sheet
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Player</th>
                    <th className="py-3 px-4">Match Type</th>
                    <th className="py-3 px-4 text-center">Runs (Balls)</th>
                    <th className="py-3 px-4 text-center">4s / 6s</th>
                    <th className="py-3 px-4 text-center">Overs</th>
                    <th className="py-3 px-4 text-center">Wickets</th>
                    <th className="py-3 px-4 text-center">Catches</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {entry.date}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-bold text-slate-900">{entry.memberName}</p>
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-100/60 px-1 rounded">
                          {entry.memberCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {entry.matchType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900 whitespace-nowrap">
                        <span className="text-amber-800 text-sm">{entry.runsScored}</span>
                        {entry.isNotOut && <span className="text-emerald-600 font-extrabold">*</span>}
                        <span className="text-slate-400 font-normal text-[11px] ml-1">({entry.ballsFaced}b)</span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 font-mono whitespace-nowrap">
                        {entry.fours} / {entry.sixes}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-700 whitespace-nowrap">
                        {entry.oversBowled} ov ({entry.maidens} m)
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          entry.wicketsTaken >= 3 ? 'bg-emerald-100 text-emerald-800' : 'text-slate-700'
                        }`}>
                          {entry.wicketsTaken} / {entry.runsConceded}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600 whitespace-nowrap">
                        {entry.catches}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate text-[11px]">
                        {entry.notes || '-'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEditEntry(entry)}
                            className="p-1 rounded text-slate-500 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {(role === 'organiser' || entry.memberId === currentUser.id) && (
                            <button
                              onClick={() => deleteCricketEntry(entry.id)}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEntries.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">
                        No performance records matching search criteria. Click "+ Add Daily Performance" to add one!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ADD / EDIT DAILY PERFORMANCE FORM */}
      {subTab === 'addRecord' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{editingEntryId ? 'Edit Entry' : 'Daily Cricket Record'}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {language === 'si' ? 'දෛනික ක්‍රිකට් වාර්තාව ඇතුළත් කරන්න' : 'Record Daily Runs & Wickets'}
              </h2>
              <p className="text-xs text-slate-500">
                Every member updates their score, which directly updates the app & syncs to the Google Sheet.
              </p>
            </div>
            <button
              onClick={() => setSubTab('career')}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Back to Records
            </button>
          </div>

          <form onSubmit={handleRecordSubmit} className="space-y-6">
            {/* Player Selection & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Player Member</label>
                <select
                  value={selectedPlayerId}
                  onChange={e => setSelectedPlayerId(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500"
                >
                  {memberRecords.map(m => (
                    <option key={m.memberId} value={m.memberId}>
                      {m.memberCode} - {m.name} ({m.nameSinhala})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Select yourself or any club member</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={e => setEntryDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            {/* Match Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Match / Practice Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Daily Practice', 'Club Match', 'Tournament', 'Friendly'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMatchType(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      matchType === type
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Batting Stats Section */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-xs uppercase flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Batting Performance
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-950">
                  <input
                    type="checkbox"
                    checked={isNotOut}
                    onChange={e => setIsNotOut(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Not Out (*)</span>
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Runs Scored</label>
                  <input
                    type="number"
                    min="0"
                    value={runsScored}
                    onChange={e => setRunsScored(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Balls Faced</label>
                  <input
                    type="number"
                    min="0"
                    value={ballsFaced}
                    onChange={e => setBallsFaced(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">4s (Fours)</label>
                  <input
                    type="number"
                    min="0"
                    value={fours}
                    onChange={e => setFours(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">6s (Sixes)</label>
                  <input
                    type="number"
                    min="0"
                    value={sixes}
                    onChange={e => setSixes(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Bowling & Fielding Section */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-4">
              <span className="font-bold text-emerald-900 text-xs uppercase flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-600" />
                Bowling & Fielding Performance
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Overs Bowled</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={oversBowled}
                    onChange={e => setOversBowled(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Maidens</label>
                  <input
                    type="number"
                    min="0"
                    value={maidens}
                    onChange={e => setMaidens(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Runs Conceded</label>
                  <input
                    type="number"
                    min="0"
                    value={runsConceded}
                    onChange={e => setRunsConceded(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Wickets</label>
                  <input
                    type="number"
                    min="0"
                    value={wicketsTaken}
                    onChange={e => setWicketsTaken(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-emerald-800 focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Catches Taken</label>
                  <input
                    type="number"
                    min="0"
                    value={catches}
                    onChange={e => setCatches(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Match Highlights / Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Scored 50 at Gamudawa turf wickets, 3 death over yorkers, good slip catch..."
                rows={2}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingEntryId ? 'Update Record & Push to Sheet' : 'Save Daily Record & Sync to Sheet'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSubTab('career')}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 3: WHATSAPP-STYLE MATCH POLL */}
      {subTab === 'matchPoll' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* WhatsApp Poll Banner Card */}
          <div className="bg-[#0b141a] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900/60 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp-Style Match Availability Poll</span>
              </div>
              <button
                onClick={generateWhatsAppMessage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share to WhatsApp Group</span>
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {matchOrganizing.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-400" /> {matchOrganizing.matchDate} at {matchOrganizing.matchTime}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {matchOrganizing.venue}</span>
                <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-blue-400" /> {matchOrganizing.format} ({matchOrganizing.overs} Overs)</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-purple-400" /> Rs {matchOrganizing.entryFeePerPlayer}/player</span>
              </div>
            </div>

            {/* Poll Question */}
            <div className="bg-[#1f2c34] rounded-2xl p-5 border border-slate-700/80 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Poll Question</p>
                  <p className="text-base sm:text-lg font-bold text-white mt-0.5">
                    {language === 'si' ? matchOrganizing.pollQuestionSinhala : matchOrganizing.pollQuestion}
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-1 rounded-md shrink-0">
                  {totalVotesCount} Responses
                </span>
              </div>

              {/* Poll Options */}
              <div className="space-y-3 pt-2">
                {matchOrganizing.pollOptions.map(option => {
                  const isSelected = currentUserVoteOptionId === option.id;
                  const voteCount = option.votes.length;
                  const percentage = totalVotesCount > 0 ? Math.round((voteCount / totalVotesCount) * 100) : 0;

                  return (
                    <div
                      key={option.id}
                      onClick={() => voteInMatchPoll(currentUser.id, option.id)}
                      className={`relative overflow-hidden rounded-xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50'
                          : 'border-slate-700 bg-slate-800/60 hover:bg-slate-800'
                      }`}
                    >
                      {/* Vote percentage bar */}
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-emerald-600/20 transition-all duration-300 pointer-events-none"
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? 'border-emerald-400 bg-emerald-500' : 'border-slate-500'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-white">
                              {language === 'si' ? option.labelSinhala : option.label}
                            </p>
                            {/* Avatars of members who voted this option */}
                            <div className="flex flex-wrap items-center gap-1 mt-1.5">
                              {option.votes.map(vid => {
                                const m = memberRecords.find(mem => mem.memberId === vid);
                                return (
                                  <span key={vid} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300 font-mono">
                                    {m?.name || vid}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-extrabold text-sm sm:text-base text-white">{voteCount}</span>
                          <span className="text-[11px] text-slate-400 block">{percentage}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-right text-[11px] text-slate-400 pt-1">
                You are voting as <span className="text-emerald-400 font-bold">{currentUser.name}</span>. Click any option to change your response instantly.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: MATCH SQUAD ORGANIZING & TEAM COORDINATION */}
      {subTab === 'organizing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
                <Users className="w-3.5 h-3.5 text-amber-700" />
                <span>Squad Coordination Part</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Team Coordination & 11 vs 11 Match Builder
              </h2>
              <p className="text-xs text-slate-500">
                Organize confirmed players into two squads ({matchOrganizing.teamA.name} and {matchOrganizing.teamB.name}) for the upcoming fixture.
              </p>
            </div>

            {role === 'organiser' && (
              <button
                onClick={() => {
                  const newNameA = prompt('Enter Team A Name:', matchOrganizing.teamA.name);
                  const newNameB = prompt('Enter Team B Name:', matchOrganizing.teamB.name);
                  if (newNameA && newNameB) {
                    updateMatchOrganizing({
                      teamA: { ...matchOrganizing.teamA, name: newNameA },
                      teamB: { ...matchOrganizing.teamB, name: newNameB }
                    });
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Rename Teams
              </button>
            )}
          </div>

          {/* Two Teams Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team A */}
            <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-md p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <h3 className="font-extrabold text-slate-900 text-base">{matchOrganizing.teamA.name}</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {matchOrganizing.teamA.playerIds.length} Players Selected
                </span>
              </div>

              <div className="space-y-2">
                {matchOrganizing.teamA.playerIds.map((pid, idx) => {
                  const m = memberRecords.find(mem => mem.memberId === pid);
                  return (
                    <div key={pid} className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{m?.name || pid}</p>
                          <p className="text-[10px] text-slate-500">{m?.category || 'Player'} • {m?.phone || ''}</p>
                        </div>
                      </div>
                      {role === 'organiser' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => assignSquadPlayer(pid, 'teamB')}
                            className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded text-slate-800 font-medium cursor-pointer"
                            title="Move to Team B"
                          >
                            Move to B
                          </button>
                          <button
                            onClick={() => assignSquadPlayer(pid, 'remove')}
                            className="text-[10px] text-red-600 hover:bg-red-50 p-1 rounded cursor-pointer"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team B */}
            <div className="bg-white rounded-2xl border-2 border-amber-500 shadow-md p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <h3 className="font-extrabold text-slate-900 text-base">{matchOrganizing.teamB.name}</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {matchOrganizing.teamB.playerIds.length} Players Selected
                </span>
              </div>

              <div className="space-y-2">
                {matchOrganizing.teamB.playerIds.map((pid, idx) => {
                  const m = memberRecords.find(mem => mem.memberId === pid);
                  return (
                    <div key={pid} className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{m?.name || pid}</p>
                          <p className="text-[10px] text-slate-500">{m?.category || 'Player'} • {m?.phone || ''}</p>
                        </div>
                      </div>
                      {role === 'organiser' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => assignSquadPlayer(pid, 'teamA')}
                            className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded text-slate-800 font-medium cursor-pointer"
                            title="Move to Team A"
                          >
                            Move to A
                          </button>
                          <button
                            onClick={() => assignSquadPlayer(pid, 'remove')}
                            className="text-[10px] text-red-600 hover:bg-red-50 p-1 rounded cursor-pointer"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Unassigned Confirmed Players Pool */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">
              Available Players from WhatsApp Poll ({matchOrganizing.confirmedSquad.length} Players)
            </h4>
            <div className="flex flex-wrap gap-2">
              {matchOrganizing.confirmedSquad.map(pid => {
                const isinA = matchOrganizing.teamA.playerIds.includes(pid);
                const isinB = matchOrganizing.teamB.playerIds.includes(pid);
                const m = memberRecords.find(mem => mem.memberId === pid);

                return (
                  <div
                    key={pid}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
                      isinA
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold'
                        : isinB
                        ? 'border-amber-300 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span>{m?.name || pid}</span>
                    {role === 'organiser' && !isinA && !isinB && (
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          onClick={() => assignSquadPlayer(pid, 'teamA')}
                          className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          + Team A
                        </button>
                        <button
                          onClick={() => assignSquadPlayer(pid, 'teamB')}
                          className="px-1.5 py-0.5 rounded bg-amber-600 text-white text-[10px] font-bold hover:bg-amber-700 cursor-pointer"
                        >
                          + Team B
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: ANNOUNCEMENTS & TEAM COMMUNICATIONS */}
      {subTab === 'announcements' && (
        <div className="space-y-6">
          {/* Create Announcement Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-base">Post Club & Match Announcement</h3>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Announcement Title (e.g. Ground Inspection, Pitch Preparation, Match Ball Supply)..."
                    value={newAnnTitle}
                    onChange={e => setNewAnnTitle(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <select
                    value={newAnnPriority}
                    onChange={e => setNewAnnPriority(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-bold"
                  >
                    <option value="normal">Normal Announcement</option>
                    <option value="urgent">Urgent / Match Alert</option>
                    <option value="info">General Info</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea
                  placeholder="Details of the announcement, arrival timings, practice ground instructions..."
                  value={newAnnContent}
                  onChange={e => setNewAnnContent(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Announcement</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Announcements */}
          <div className="space-y-4">
            {announcements.map(ann => (
              <div
                key={ann.id}
                className={`rounded-2xl p-5 border shadow-xs transition-all ${
                  ann.priority === 'urgent'
                    ? 'bg-red-50/70 border-red-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        ann.priority === 'urgent'
                          ? 'bg-red-200 text-red-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ann.priority}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {ann.date}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">By {ann.author}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {language === 'si' ? ann.titleSinhala : ann.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                      {language === 'si' ? ann.contentSinhala : ann.content}
                    </p>
                  </div>

                  {role === 'organiser' && (
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
