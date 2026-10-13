import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import {
  Trophy,
  Activity,
  Flame,
  Calendar,
  User,
  Search,
  ExternalLink,
  FileSpreadsheet,
  Download,
  RefreshCw,
  TrendingUp,
  Shield,
  Target,
  Award,
  ChevronRight,
  PlusCircle,
  Filter,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
} from 'recharts';

export const CricketStatsView: React.FC = () => {
  const {
    language,
    role,
    currentUser,
    memberRecords,
    cricketEntries,
    cricketSheetUrl,
    updateCricketSheetUrl,
    openCricketSheetDirectly,
    syncCricketEntriesToSheet,
    setActiveTab,
    showToast
  } = useApp();

  // Selected player ID for the dashboard
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    currentUser.id || memberRecords[0]?.memberId || 'm-1'
  );
  const [searchPlayer, setSearchPlayer] = useState('');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [sheetUrlInput, setSheetUrlInput] = useState(cricketSheetUrl);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSheetConfig, setShowSheetConfig] = useState(false);

  // Available players who have matches or are club members
  const availablePlayers = useMemo(() => {
    return memberRecords.map(m => {
      const matchCount = cricketEntries.filter(e => e.memberId === m.memberId).length;
      return {
        id: m.memberId,
        memberCode: m.memberCode,
        name: m.name,
        nameSinhala: m.nameSinhala,
        phone: m.phone,
        category: m.category,
        matchCount
      };
    });
  }, [memberRecords, cricketEntries]);

  // Selected player details
  const selectedMember = useMemo(() => {
    return (
      memberRecords.find(m => m.memberId === selectedPlayerId) ||
      memberRecords[0] || {
        memberId: selectedPlayerId,
        memberCode: 'YS-001',
        name: 'Hasitha Madusanka',
        nameSinhala: 'හසිත මධුසංඛ',
        category: 'Senior (Cricket)',
        phone: '077 123 4567',
        weeks: {},
        totalPaid: 1000,
        totalOwed: 0,
        status: 'good'
      }
    );
  }, [memberRecords, selectedPlayerId]);

  // Player's match entries sorted chronologically (oldest to newest for charts)
  const playerEntriesChronological = useMemo(() => {
    const raw = cricketEntries.filter(e => e.memberId === selectedPlayerId);
    const filtered = formatFilter === 'all' ? raw : raw.filter(e => e.matchType === formatFilter);
    return [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [cricketEntries, selectedPlayerId, formatFilter]);

  // Player's match entries newest to oldest (for match history log)
  const playerEntriesRecent = useMemo(() => {
    return [...playerEntriesChronological].reverse();
  }, [playerEntriesChronological]);

  // Player Aggregated Career Stats
  const playerStats = useMemo(() => {
    let totalRuns = 0;
    let totalBalls = 0;
    let totalFours = 0;
    let totalSixes = 0;
    let highestScore = 0;
    let highestScoreNotOut = false;
    let notOuts = 0;
    let halfCenturies = 0;
    let centuries = 0;
    let thirties = 0;

    let totalWickets = 0;
    let totalOvers = 0;
    let totalRunsConceded = 0;
    let maidens = 0;
    let bestBowlingWickets = 0;
    let bestBowlingRuns = 999;
    let totalCatches = 0;
    let totalStumpings = 0;

    playerEntriesChronological.forEach(entry => {
      totalRuns += entry.runsScored || 0;
      totalBalls += entry.ballsFaced || 0;
      totalFours += entry.fours || 0;
      totalSixes += entry.sixes || 0;

      if (entry.isNotOut) notOuts++;

      if (entry.runsScored > highestScore) {
        highestScore = entry.runsScored;
        highestScoreNotOut = entry.isNotOut;
      }

      if (entry.runsScored >= 100) centuries++;
      else if (entry.runsScored >= 50) halfCenturies++;
      else if (entry.runsScored >= 30) thirties++;

      totalWickets += entry.wicketsTaken || 0;
      totalOvers += entry.oversBowled || 0;
      totalRunsConceded += entry.runsConceded || 0;
      maidens += entry.maidens || 0;
      totalCatches += entry.catches || 0;
      totalStumpings += entry.stumpings || 0;

      // Best bowling figures check
      if (
        entry.wicketsTaken > bestBowlingWickets ||
        (entry.wicketsTaken === bestBowlingWickets &&
          entry.wicketsTaken > 0 &&
          entry.runsConceded < bestBowlingRuns)
      ) {
        bestBowlingWickets = entry.wicketsTaken;
        bestBowlingRuns = entry.runsConceded;
      }
    });

    const matches = playerEntriesChronological.length;
    const dismissals = matches - notOuts;
    const battingAvg = dismissals > 0 ? (totalRuns / dismissals).toFixed(1) : totalRuns.toString();
    const strikeRate = totalBalls > 0 ? ((totalRuns / totalBalls) * 100).toFixed(1) : '0.0';
    const bowlingEconomy = totalOvers > 0 ? (totalRunsConceded / totalOvers).toFixed(2) : '0.00';
    const bowlingAvg =
      totalWickets > 0 ? (totalRunsConceded / totalWickets).toFixed(1) : totalRunsConceded > 0 ? '-' : '0.0';

    const bestBowling =
      bestBowlingWickets > 0 ? `${bestBowlingWickets}/${bestBowlingRuns}` : '-';

    return {
      matches,
      totalRuns,
      totalBalls,
      totalFours,
      totalSixes,
      highestScore: `${highestScore}${highestScoreNotOut ? '*' : ''}`,
      highestScoreNum: highestScore,
      notOuts,
      battingAvg,
      strikeRate,
      halfCenturies,
      centuries,
      thirties,
      totalWickets,
      totalOvers,
      totalRunsConceded,
      maidens,
      bowlingEconomy,
      bowlingAvg,
      bestBowling,
      totalCatches,
      totalStumpings
    };
  }, [playerEntriesChronological]);

  // Data for Chart 1 & Chart 2: Runs, Strike Rate, Wickets & Economy per Match over time
  const matchPerformanceChartData = useMemo(() => {
    let runningRuns = 0;
    let runningWickets = 0;

    return playerEntriesChronological.map((entry, idx) => {
      runningRuns += entry.runsScored;
      runningWickets += entry.wicketsTaken;

      const sr =
        entry.ballsFaced > 0
          ? Number(((entry.runsScored / entry.ballsFaced) * 100).toFixed(1))
          : 0;

      const econ =
        entry.oversBowled > 0
          ? Number((entry.runsConceded / entry.oversBowled).toFixed(2))
          : 0;

      const dateObj = new Date(entry.date);
      const shortDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

      return {
        matchIndex: `M${idx + 1}`,
        date: entry.date,
        shortDate,
        label: `${shortDate} (${entry.matchType})`,
        matchType: entry.matchType,
        runs: entry.runsScored,
        balls: entry.ballsFaced,
        strikeRate: sr,
        fours: entry.fours,
        sixes: entry.sixes,
        wickets: entry.wicketsTaken,
        overs: entry.oversBowled,
        runsConceded: entry.runsConceded,
        economy: econ,
        cumulativeRuns: runningRuns,
        cumulativeWickets: runningWickets,
        notOut: entry.isNotOut,
        notes: entry.notes || ''
      };
    });
  }, [playerEntriesChronological]);

  // Data for Chart 4: Runs by Match Format (Pie chart)
  const formatBreakdownData = useMemo(() => {
    const formatTotals: Record<string, number> = {};
    playerEntriesChronological.forEach(e => {
      formatTotals[e.matchType] = (formatTotals[e.matchType] || 0) + e.runsScored;
    });

    const colors: Record<string, string> = {
      'Daily Practice': '#059669', // Emerald
      'Club Match': '#2563eb',    // Blue
      Tournament: '#d97706',      // Amber
      Friendly: '#7c3aed'         // Purple
    };

    return Object.entries(formatTotals).map(([type, runs]) => ({
      name: type,
      runs,
      color: colors[type] || '#64748b'
    }));
  }, [playerEntriesChronological]);

  // Team Leaderboard Overview (for comparison context)
  const topRunScorers = useMemo(() => {
    const map: Record<string, { id: string; name: string; runs: number; wickets: number }> = {};
    cricketEntries.forEach(e => {
      if (!map[e.memberId]) {
        map[e.memberId] = { id: e.memberId, name: e.memberName, runs: 0, wickets: 0 };
      }
      map[e.memberId].runs += e.runsScored;
      map[e.memberId].wickets += e.wicketsTaken;
    });

    return Object.values(map)
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 5);
  }, [cricketEntries]);

  // Handle Sheet URL save
  const handleSaveSheetUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (sheetUrlInput.trim()) {
      updateCricketSheetUrl(sheetUrlInput.trim());
      showToast(
        language === 'si'
          ? 'ක්‍රිකට් ගූගල් ෂීට් සබැඳිය යාවත්කාලීන විය!'
          : 'Cricket Career Google Sheet URL updated!'
      );
      setShowSheetConfig(false);
    }
  };

  // Handle Sheet Sync
  const handleSyncSheet = async () => {
    setIsSyncing(true);
    try {
      await syncCricketEntriesToSheet();
    } finally {
      setIsSyncing(false);
    }
  };

  // Export Player Stats to CSV
  const handleExportPlayerCsv = () => {
    const headers = [
      'Match Date',
      'Match Type',
      'Member Code',
      'Player Name',
      'Runs Scored',
      'Balls Faced',
      'Fours (4s)',
      'Sixes (6s)',
      'Not Out',
      'Strike Rate',
      'Overs Bowled',
      'Maidens',
      'Runs Conceded',
      'Wickets Taken',
      'Economy',
      'Catches',
      'Notes'
    ];

    const rows = playerEntriesChronological.map(e => [
      e.date,
      e.matchType,
      e.memberCode,
      `"${e.memberName}"`,
      e.runsScored,
      e.ballsFaced,
      e.fours,
      e.sixes,
      e.isNotOut ? 'Yes' : 'No',
      e.ballsFaced > 0 ? ((e.runsScored / e.ballsFaced) * 100).toFixed(1) : '0',
      e.oversBowled,
      e.maidens,
      e.runsConceded,
      e.wicketsTaken,
      e.oversBowled > 0 ? (e.runsConceded / e.oversBowled).toFixed(2) : '0',
      e.catches,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${selectedMember.name.replace(/\s+/g, '_')}_Cricket_Stats_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter players list
  const filteredPlayersList = useMemo(() => {
    if (!searchPlayer.trim()) return availablePlayers;
    const q = searchPlayer.toLowerCase().trim();
    return availablePlayers.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.nameSinhala.includes(q) ||
        p.memberCode.toLowerCase().includes(q)
    );
  }, [availablePlayers, searchPlayer]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-72 h-72 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {language === 'si'
                  ? 'යොවුන් තරු ක්‍රිකට් සංඛ්‍යාලේඛන & ප්‍රස්ථාර පුවරුව'
                  : 'YSSC Cricket Analytics & Recharts Performance Dashboard'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {language === 'si'
                ? 'සාමාජික ක්‍රිකට් දක්ෂතා සහ ප්‍රස්ථාර විශ්ලේෂණය'
                : 'Individual Member Cricket Performance & Career Charts'}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              {language === 'si'
                ? 'සෑම ක්‍රීඩකයෙකුගේම ලකුණු (Runs), කඩුලු (Wickets), ප්‍රහාරාත්මක වේගය සහ කාලයත් සමඟ ඇති ප්‍රගතිය Recharts මඟින් සජීවීව නිරීක්ෂණය කරන්න. ගූගල් ෂීට් සමඟ සෘජුව සම්බන්ධ කර ඇත.'
                : 'Visualize individual player runs scored, wickets taken, strike rates, and career progression over time using interactive charts linked with Google Sheets.'}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-200 pt-1">
              <span>{cricketEntries.length} Match Records Analyzed</span>
              <span>•</span>
              <span>Google Sheet: Active Link</span>
              <span>•</span>
              <span>Young Star SC Gamudawa</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={openCricketSheetDirectly}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-emerald-900 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              title="Open the official Cricket Career Google Sheet in a new tab"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>{language === 'si' ? 'ගූගල් ෂීට් විවෘත කරන්න' : 'Open Cricket Sheet'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={handleSyncSheet}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm border border-emerald-400/40 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? (language === 'si' ? 'සමමුහුර්ත වෙමින්...' : 'Syncing...') : (language === 'si' ? 'ෂීට් සමමුහුර්ත කරන්න' : 'Sync Google Sheet')}</span>
            </button>

            <button
              onClick={() => setActiveTab('cricket')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-900" />
              <span>{language === 'si' ? 'නව ලකුණු සටහන් කරන්න' : 'Record Daily Scores'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Google Sheet Link & Sync Integration Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800 shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {language === 'si'
                    ? 'ක්‍රිකට් ගූගල් ෂීට් සම්බන්ධතාව (Google Sheet Link)'
                    : 'Cricket Career Google Sheet Live Link'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono truncate max-w-xl">
                {cricketSheetUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSheetConfig(!showSheetConfig)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {showSheetConfig ? (language === 'si' ? 'සඟවන්න' : 'Close URL') : (language === 'si' ? 'සබැඳිය වෙනස් කරන්න' : 'Change Sheet URL')}
            </button>
            <button
              onClick={handleExportPlayerCsv}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'ක්‍රීඩක දත්ත බාගන්න (CSV)' : 'Export Player CSV'}</span>
            </button>
          </div>
        </div>

        {showSheetConfig && (
          <form onSubmit={handleSaveSheetUrl} className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-2">
            <label className="text-xs font-bold text-emerald-950 block">
              {language === 'si'
                ? 'ක්‍රිකට් වාර්තා සඳහා වන නව ගූගල් ෂීට් සබැඳිය ඇතුළත් කරන්න:'
                : 'Enter Custom Google Sheet URL for Cricket Records:'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={sheetUrlInput}
                onChange={e => setSheetUrlInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="flex-1 p-2 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {language === 'si' ? 'සුරකින්න' : 'Save URL'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Member Selector Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {language === 'si' ? 'ක්‍රීඩකයා තෝරන්න' : 'Select Player to Analyze'}
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {language === 'si'
                ? `${selectedMember.nameSinhala} (${selectedMember.name}) ගේ දක්ෂතා`
                : `${selectedMember.name} (${selectedMember.memberCode}) Stats`}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchPlayer}
                onChange={e => setSearchPlayer(e.target.value)}
                placeholder={language === 'si' ? 'නමින් හෝ ID මඟින් සොයන්න...' : 'Filter by name or YS-ID...'}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Dropdown Selector */}
            <select
              value={selectedPlayerId}
              onChange={e => setSelectedPlayerId(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {filteredPlayersList.map(p => (
                <option key={p.id} value={p.id}>
                  {p.memberCode} - {p.name} {language === 'si' ? `(${p.nameSinhala})` : ''} ({p.matchCount} matches)
                </option>
              ))}
            </select>

            {/* Format Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              {['all', 'Daily Practice', 'Club Match', 'Tournament'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setFormatFilter(fmt)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    formatFilter === fmt
                      ? 'bg-white text-emerald-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fmt === 'all' ? (language === 'si' ? 'සියල්ල' : 'All') : fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Player Selection Avatars */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {availablePlayers.slice(0, 10).map(p => {
            const isSelected = p.id === selectedPlayerId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlayerId(p.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  isSelected ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {p.name.charAt(0)}
                </div>
                <span>{p.name.split(' ')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {p.matchCount}m
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Member Profile Card & Hero Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {selectedMember.name.charAt(0)}
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {selectedMember.memberCode}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-1 leading-snug">
                  {selectedMember.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedMember.nameSinhala}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-150 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{language === 'si' ? 'කාණ්ඩය' : 'Category'}:</span>
                <span className="font-semibold text-slate-800">{selectedMember.category}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{language === 'si' ? 'දුරකථනය' : 'Phone'}:</span>
                <span className="font-mono text-slate-800">{selectedMember.phone}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{language === 'si' ? 'තරඟ සංඛ්‍යාව' : 'Matches'}:</span>
                <span className="font-bold text-emerald-700">{playerStats.matches} Matches</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{language === 'si' ? 'ඉහළම ලකුණු' : 'Highest Score'}:</span>
                <span className="font-bold text-slate-900">{playerStats.highestScore}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{language === 'si' ? 'හොඳම පන්දු යැවීම' : 'Best Bowling'}:</span>
                <span className="font-bold text-emerald-700">{playerStats.bestBowling}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-150">
            <button
              onClick={() => setActiveTab('cricket')}
              className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'si' ? 'ලකුණු / කඩුලු ඇතුළත් කරන්න' : 'Record Match Performance'}</span>
            </button>
          </div>
        </div>

        {/* High-level Metric Stat Badges */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Batting Card: Total Runs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {language === 'si' ? 'මුළු ලකුණු' : 'Total Runs'}
              </span>
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {playerStats.totalRuns}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{playerStats.totalFours} × 4s</span>
              <span>•</span>
              <span>{playerStats.totalSixes} × 6s</span>
            </div>
          </div>

          {/* Batting Average & Strike Rate */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {language === 'si' ? 'ප්‍රහාරාත්මක වේගය' : 'Strike Rate / Avg'}
              </span>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-blue-900 mt-2">
              {playerStats.strikeRate}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span>Average: </span>
              <span className="font-bold text-slate-800">{playerStats.battingAvg}</span>
              <span className="text-[10px] ml-1">({playerStats.notOuts} NO)</span>
            </div>
          </div>

          {/* Bowling: Wickets Taken */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {language === 'si' ? 'දවාගැනීම් (කඩුලු)' : 'Wickets Taken'}
              </span>
              <div className="p-2 bg-teal-100 text-teal-700 rounded-xl">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-teal-900 mt-2">
              {playerStats.totalWickets}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span>Economy: </span>
              <span className="font-bold text-slate-800">{playerStats.bowlingEconomy}</span>
              <span className="text-[10px] ml-1">({playerStats.totalOvers} ov)</span>
            </div>
          </div>

          {/* Milestones & Fielding */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {language === 'si' ? 'අර්ධ ශතක & උඩපන්දු' : '50s & Fielding'}
              </span>
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-900 mt-2">
              {playerStats.halfCenturies}
              <span className="text-sm font-semibold text-slate-500 ml-1">50s</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span>{playerStats.totalCatches} Catches • {playerStats.thirties} × 30s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section 1: Runs Scored & Strike Rate Over Time */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-150 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                {language === 'si'
                  ? 'ලකුණු සහ ප්‍රහාරාත්මක වේගයේ ප්‍රගතිය (Runs & Strike Rate Timeline)'
                  : 'Runs Scored & Strike Rate Performance Over Time'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'si'
                ? 'සෑම තරඟයකදීම ලබාගත් ලකුණු ප්‍රමාණය (කොළ පැහැති ප්‍රදේශය) සහ ප්‍රහාරාත්මක වේගය (නිල් ඉර)'
                : 'Match-by-match runs scored (Emerald Area) and batting strike rate (Blue Line) with 50-run benchmark'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
              <span>Runs</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-700">
              <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" />
              <span>Strike Rate</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600">
              <span className="w-3 h-0.5 bg-amber-500 inline-block border-t border-dashed" />
              <span>50 Benchmark</span>
            </div>
          </div>
        </div>

        {matchPerformanceChartData.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            {language === 'si'
              ? 'මෙම ක්‍රීඩකයා සඳහා තරඟ දත්ත නොමැත. කරුණාකර "නව ලකුණු සටහන් කරන්න" බොත්තම ඔබන්න.'
              : 'No recorded cricket entries found for this member yet. Record their scores using the form above.'}
          </div>
        ) : (
          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={matchPerformanceChartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="runsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 'dataMax + 15']}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 'auto']}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any, name: any) => {
                    if (name === 'runs') return [`${val} runs`, 'Runs Scored'];
                    if (name === 'strikeRate') return [`${val}%`, 'Strike Rate'];
                    return [val, name];
                  }}
                  labelFormatter={(lbl, items) => {
                    const match = items[0]?.payload;
                    return match ? `${match.date} • ${match.matchType} ${match.notOut ? '(Not Out)' : ''}` : lbl;
                  }}
                />
                <ReferenceLine
                  yAxisId="left"
                  y={50}
                  stroke="#d97706"
                  strokeDasharray="4 4"
                  label={{ value: 'Half-Century (50)', fill: '#d97706', fontSize: 10, position: 'top' }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="runs"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#runsGradient)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="strikeRate"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#2563eb' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Chart Section 2: Wickets Taken & Cumulative Progression Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 2A: Wickets Taken & Runs Conceded per Match */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-150 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {language === 'si'
                  ? 'කඩුලු සහ පන්දු යැවීමේ සාරාංශය'
                  : 'Wickets Taken & Economy per Match'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'si'
                  ? 'කඩුලු සංඛ්‍යාව (කොළ තීරු) සහ ඕවරයකට ලබාදුන් ලකුණු (Economy rate)'
                  : 'Bars for wickets taken, line for bowling economy rate'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <span>Bowling</span>
            </div>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={matchPerformanceChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="shortDate"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any, name: any) => {
                    if (name === 'wickets') return [`${val} wkts`, 'Wickets Taken'];
                    if (name === 'economy') return [val, 'Economy Rate'];
                    return [val, name];
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="wickets"
                  fill="#0d9488"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="economy"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#f59e0b' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2B: Cumulative Runs & Wickets Growth */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-150 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {language === 'si'
                  ? 'සමුච්චිත ලකුණු සහ කඩුලු වර්ධනය'
                  : 'Cumulative Career Progression Curve'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'si'
                  ? 'සමස්ත තරඟාවලිය පුරා ලකුණු හා කඩුලු ක්‍රමානුකූලව වැඩිවීම'
                  : 'Cumulative runs (Area) and wickets (Line) climbing over time'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Career Trajectory</span>
            </div>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={matchPerformanceChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="cumRunsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="shortDate"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="runs"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="wkts"
                  orientation="right"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any, name: any) => {
                    if (name === 'cumulativeRuns') return [`${val} runs`, 'Total Runs (Career)'];
                    if (name === 'cumulativeWickets') return [`${val} wkts`, 'Total Wickets'];
                    return [val, name];
                  }}
                />
                <Area
                  yAxisId="runs"
                  type="monotone"
                  dataKey="cumulativeRuns"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#cumRunsGrad)"
                />
                <Line
                  yAxisId="wkts"
                  type="monotone"
                  dataKey="cumulativeWickets"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#8b5cf6' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Section 3: Format Breakdown & Team Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Format Breakdown (Donut Pie Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-150 pb-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {language === 'si' ? 'තරඟ වර්ගය අනුව ලකුණු' : 'Runs by Match Format'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'si'
                ? 'පුහුණු සැසි, සමාජ තරඟ සහ තරඟාවලි බෙදීයාම'
                : 'Distribution of runs across match formats'}
            </p>
          </div>

          <div className="w-full h-56 flex items-center justify-center">
            {formatBreakdownData.length === 0 ? (
              <span className="text-xs text-slate-400">No match format data</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formatBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="runs"
                  >
                    {formatBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val} runs`, 'Runs']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-150 text-xs">
            {formatBreakdownData.map(fmt => (
              <div key={fmt.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fmt.color }} />
                <span className="text-slate-600 truncate">{fmt.name}:</span>
                <span className="font-bold text-slate-900 ml-auto">{fmt.runs}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Leaderboard Comparison */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-150 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {language === 'si'
                  ? 'කණ්ඩායමේ ප්‍රමුඛ ක්‍රීඩකයින්ගේ සංසන්දනය'
                  : 'Team Top Run-Scorers & Wicket-Takers'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'si'
                  ? 'තෝරාගත් ක්‍රීඩකයා අනෙකුත් කණ්ඩායම් සාමාජිකයින් සමඟ සංසන්දනය කරන්න'
                  : 'See how the selected player stacks up against club squad leaders'}
              </p>
            </div>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-3">
            {topRunScorers.map((scorer, idx) => {
              const isSelected = scorer.id === selectedPlayerId;
              const maxRuns = Math.max(...topRunScorers.map(s => s.runs), 100);
              const percentage = Math.round((scorer.runs / maxRuns) * 100);

              return (
                <div
                  key={scorer.id}
                  onClick={() => setSelectedPlayerId(scorer.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        idx === 0 ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-900">{scorer.name}</span>
                      {isSelected && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                          Selected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 font-semibold text-slate-700">
                      <span className="text-emerald-700 font-extrabold">{scorer.runs} runs</span>
                      <span>•</span>
                      <span className="text-teal-700 font-bold">{scorer.wickets} wkts</span>
                    </div>
                  </div>

                  {/* Progress visual bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Match History Table for the Player */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">
              {language === 'si'
                ? `${selectedMember.name} ගේ තරඟ වාර්තා ලේඛනය`
                : `${selectedMember.name} — Full Match Log & Performance History`}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {playerEntriesRecent.length} {language === 'si' ? 'තරඟ සටහන් වී ඇත' : 'recorded matches in database'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPlayerCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setActiveTab('cricket')}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Daily Match Score</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-3 py-3">Format</th>
                <th className="px-3 py-3 text-right">Runs</th>
                <th className="px-3 py-3 text-right">Balls</th>
                <th className="px-3 py-3 text-right">4s / 6s</th>
                <th className="px-3 py-3 text-right">SR</th>
                <th className="px-3 py-3 text-right">Overs</th>
                <th className="px-3 py-3 text-right">Wickets</th>
                <th className="px-3 py-3 text-right">Runs Conceded</th>
                <th className="px-3 py-3 text-right">Economy</th>
                <th className="px-3 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {playerEntriesRecent.map(match => {
                const sr =
                  match.ballsFaced > 0
                    ? ((match.runsScored / match.ballsFaced) * 100).toFixed(1)
                    : '-';
                const econ =
                  match.oversBowled > 0
                    ? (match.runsConceded / match.oversBowled).toFixed(2)
                    : '-';

                return (
                  <tr key={match.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      {match.date}
                    </td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {match.matchType}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-extrabold text-slate-900">
                      {match.runsScored}
                      {match.isNotOut && <span className="text-emerald-700 ml-0.5">*</span>}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-600">
                      {match.ballsFaced}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-600">
                      {match.fours} / {match.sixes}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-blue-700 font-semibold">
                      {sr}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-600">
                      {match.oversBowled}
                    </td>
                    <td className="px-3 py-3 text-right font-extrabold text-teal-800">
                      {match.wicketsTaken}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-600">
                      {match.runsConceded}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-amber-700 font-semibold">
                      {econ}
                    </td>
                    <td className="px-3 py-3 text-slate-500 max-w-xs truncate" title={match.notes}>
                      {match.notes || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
