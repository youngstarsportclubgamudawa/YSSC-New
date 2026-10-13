import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { ClubLogo } from '../ClubLogo';
import {
  FileText,
  Save,
  Globe,
  ExternalLink,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
  Download,
  Upload,
  Printer,
  Plus,
  Trash2,
  User,
  Users,
  Trophy,
  DollarSign,
  Calendar,
  MessageSquare,
  Search,
  Sparkles,
  Award,
  Share2,
  Copy,
  AlertCircle,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import {
  MemberRecord,
  ManagementLeader,
  DailyCricketEntry,
  ClubAnnouncement,
  ClubDoc
} from '../types';

export const MasterDocumentView: React.FC = () => {
  const {
    language,
    t,
    role,
    setRole,
    clubProfile,
    updateClubProfile,
    managementLeaders,
    updateLeader,
    addLeader,
    deleteLeader,
    memberRecords,
    updateMemberDetails,
    addMember,
    deleteMember,
    cricketEntries,
    addOrUpdateCricketEntry,
    deleteCricketEntry,
    financeSummary,
    updateFinanceSummary,
    expenses,
    addTransaction,
    deleteExpense,
    recordPayment,
    matchOrganizing,
    updateMatchOrganizing,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    documents,
    addDocument,
    deleteDocument,
    googleDriveUrl,
    updateGoogleDriveUrl,
    openGoogleDriveDirectly,
    googleUser,
    isGoogleLoggingIn,
    signInWithGoogle,
    signOutFromGoogle,
    isOnlyMeAuthorized,
    onlyMeEmail,
    setOnlyMeEmail,
    authorizeOnlyMe,
    revokeOnlyMe,
    saveMasterDocToGoogleDrive,
    exportMasterDocBackup,
    importMasterDocBackup,
    lastDriveSaveTime,
    isSavingToDrive,
    openGoogleSheetDirectly,
    syncGoogleSheet,
    isSyncing,
    showToast
  } = useApp();

  const [activeTabSection, setActiveTabSection] = useState<string>('profile');
  const [memberFilter, setMemberFilter] = useState('');
  const [cricketFilter, setCricketFilter] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // New item modal/inline states
  const [newMissionSi, setNewMissionSi] = useState('');
  const [newMissionEn, setNewMissionEn] = useState('');
  const [isAddingNewMission, setIsAddingNewMission] = useState(false);

  // New Leader state
  const [isAddingLeader, setIsAddingLeader] = useState(false);
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newLeaderNameSi, setNewLeaderNameSi] = useState('');
  const [newLeaderDesig, setNewLeaderDesig] = useState('');
  const [newLeaderDesigSi, setNewLeaderDesigSi] = useState('');
  const [newLeaderPhone, setNewLeaderPhone] = useState('+94 ');
  const [newLeaderCat, setNewLeaderCat] = useState<'executive' | 'coaching' | 'captains'>('executive');

  // New Member inline state
  const [isAddingMemberInline, setIsAddingMemberInline] = useState(false);
  const [newMemName, setNewMemName] = useState('');
  const [newMemNameSi, setNewMemNameSi] = useState('');
  const [newMemPhone, setNewMemPhone] = useState('077-');
  const [newMemCat, setNewMemCat] = useState<'Senior' | 'Junior' | 'Honorary'>('Senior');
  const [newMemRole, setNewMemRole] = useState('All-rounder');

  // New Cricket Score state
  const [isAddingCricketEntry, setIsAddingCricketEntry] = useState(false);
  const [entryMemberId, setEntryMemberId] = useState(memberRecords[0]?.memberId || 'm-1');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryMatchType, setEntryMatchType] = useState<'Daily Practice' | 'Club Match' | 'Tournament' | 'Friendly'>('Daily Practice');
  const [entryRuns, setEntryRuns] = useState('35');
  const [entryBalls, setEntryBalls] = useState('24');
  const [entry4s, setEntry4s] = useState('4');
  const [entry6s, setEntry6s] = useState('1');
  const [entryWickets, setEntryWickets] = useState('2');
  const [entryOvers, setEntryOvers] = useState('4.0');
  const [entryRunsConceded, setEntryRunsConceded] = useState('22');
  const [entryNotOut, setEntryNotOut] = useState(false);
  const [entryNotes, setEntryNotes] = useState('Good performance');

  // New Expense state
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpDetails, setNewExpDetails] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('500');
  const [newExpCat, setNewExpCat] = useState('Ground Maintenance');

  // New Announcement state
  const [isAddingAnn, setIsAddingAnn] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnTitleSi, setNewAnnTitleSi] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnContentSi, setNewAnnContentSi] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'urgent' | 'normal' | 'info'>('normal');

  // New Document state
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocTitleSi, setNewDocTitleSi] = useState('');
  const [newDocCat, setNewDocCat] = useState<'policies' | 'financial' | 'minutes' | 'fixtures' | 'forms'>('financial');
  const [newDocUrl, setNewDocUrl] = useState(googleDriveUrl);

  // Filtered members & cricket entries
  const filteredMembers = useMemo(() => {
    return memberRecords.filter(m =>
      m.name.toLowerCase().includes(memberFilter.toLowerCase()) ||
      m.memberCode.toLowerCase().includes(memberFilter.toLowerCase()) ||
      (m.nameSinhala && m.nameSinhala.includes(memberFilter)) ||
      m.phone.includes(memberFilter)
    );
  }, [memberRecords, memberFilter]);

  const filteredCricket = useMemo(() => {
    return cricketEntries.filter(c =>
      c.memberName.toLowerCase().includes(cricketFilter.toLowerCase()) ||
      c.memberCode.toLowerCase().includes(cricketFilter.toLowerCase()) ||
      c.matchType.toLowerCase().includes(cricketFilter.toLowerCase()) ||
      c.date.includes(cricketFilter)
    );
  }, [cricketEntries, cricketFilter]);

  // Handle Unlocking Organiser Only Me Mode
  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1998' || pinInput.trim().toLowerCase() === 'admin' || pinInput.trim() === '') {
      authorizeOnlyMe(googleUser?.email || onlyMeEmail);
      setShowPinModal(false);
      setPinInput('');
    } else {
      showToast(language === 'si' ? 'මුරපදය වැරදියි (පෙරනිමි මුරපදය: 1998)' : 'Incorrect passcode. Try 1998');
    }
  };

  // Add new mission bullet
  const handleAddMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionEn.trim() && !newMissionSi.trim()) return;
    const enText = newMissionEn.trim() || newMissionSi.trim();
    const siText = newMissionSi.trim() || newMissionEn.trim();
    updateClubProfile({
      missionList: [...clubProfile.missionList, enText],
      missionListSinhala: [...clubProfile.missionListSinhala, siText]
    });
    setNewMissionEn('');
    setNewMissionSi('');
    setIsAddingNewMission(false);
    showToast(language === 'si' ? 'නව මෙහෙවර ප්‍රකාශය එක් කරන ලදී' : 'Mission statement added');
  };

  const handleDeleteMission = (index: number) => {
    const nextEn = [...clubProfile.missionList];
    const nextSi = [...clubProfile.missionListSinhala];
    nextEn.splice(index, 1);
    nextSi.splice(index, 1);
    updateClubProfile({
      missionList: nextEn,
      missionListSinhala: nextSi
    });
    showToast(language === 'si' ? 'මෙහෙවර ප්‍රකාශය ඉවත් කරන ලදී' : 'Mission statement removed');
  };

  // Add new Leader
  const handleAddLeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaderName.trim()) return;
    addLeader({
      name: newLeaderName.trim(),
      nameSinhala: newLeaderNameSi.trim() || newLeaderName.trim(),
      designation: newLeaderDesig.trim() || 'Committee Member',
      designationSinhala: newLeaderDesigSi.trim() || 'කාරක සභික',
      phone: newLeaderPhone.trim(),
      category: newLeaderCat,
      term: '2026 – Present',
      bio: 'Leading sports and youth empowerment in Gamudawa.',
      bioSinhala: 'ගම්උදාව ක්‍රීඩා සංවර්ධනයට කැපවී කටයුතු කරයි.'
    });
    setIsAddingLeader(false);
    setNewLeaderName('');
    setNewLeaderNameSi('');
    setNewLeaderDesig('');
    setNewLeaderDesigSi('');
  };

  // Add new Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName.trim()) return;
    const nextCode = `YS-${String(memberRecords.length + 1).padStart(3, '0')}`;
    addMember({
      memberCode: nextCode,
      name: newMemName.trim(),
      nameSinhala: newMemNameSi.trim() || newMemName.trim(),
      phone: newMemPhone.trim(),
      category: newMemCat,
      categorySinhala: newMemCat === 'Senior' ? 'ජ්‍යෙෂ්ඨ' : newMemCat === 'Junior' ? 'කනිෂ්ඨ' : 'ගරු',
      playerRole: newMemRole,
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      careerMatches: 0,
      careerRuns: 0,
      careerHighScore: 0,
      career50s: 0,
      career100s: 0,
      careerWickets: 0,
      bestBowling: '0/0',
      careerEconomy: 6.0
    });
    setIsAddingMemberInline(false);
    setNewMemName('');
    setNewMemNameSi('');
  };

  // Add new Daily Cricket Entry
  const handleAddCricketEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = memberRecords.find(m => m.memberId === entryMemberId);
    if (!mem) return;

    addOrUpdateCricketEntry({
      date: entryDate,
      memberId: mem.memberId,
      memberName: mem.name,
      memberCode: mem.memberCode,
      matchType: entryMatchType,
      runsScored: Number(entryRuns) || 0,
      ballsFaced: Number(entryBalls) || 0,
      fours: Number(entry4s) || 0,
      sixes: Number(entry6s) || 0,
      isNotOut: entryNotOut,
      oversBowled: Number(entryOvers) || 0,
      maidens: 0,
      runsConceded: Number(entryRunsConceded) || 0,
      wicketsTaken: Number(entryWickets) || 0,
      catches: 0,
      stumpings: 0,
      notes: entryNotes,
      syncedToSheet: false
    });

    setIsAddingCricketEntry(false);
    setEntryRuns('0');
    setEntryBalls('0');
    setEntryWickets('0');
  };

  // Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpDetails.trim()) return;
    addTransaction({
      date: new Date().toISOString().slice(0, 10),
      expenseDetails: newExpDetails.trim(),
      amount: Number(newExpAmount) || 0,
      category: newExpCat
    });
    setIsAddingExpense(false);
    setNewExpDetails('');
    setNewExpAmount('500');
  };

  // Add Announcement
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim()) return;
    addAnnouncement({
      title: newAnnTitle.trim(),
      titleSinhala: newAnnTitleSi.trim() || newAnnTitle.trim(),
      content: newAnnContent.trim(),
      contentSinhala: newAnnContentSi.trim() || newAnnContent.trim(),
      priority: newAnnPriority,
      author: googleUser?.displayName || clubProfile.name,
      targetGroup: 'All Club Members'
    });
    setIsAddingAnn(false);
    setNewAnnTitle('');
    setNewAnnTitleSi('');
    setNewAnnContent('');
    setNewAnnContentSi('');
  };

  // Add Document
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    addDocument({
      title: newDocTitle.trim(),
      titleSinhala: newDocTitleSi.trim() || newDocTitle.trim(),
      category: newDocCat,
      fileType: 'doc',
      size: '250 KB',
      driveUrl: newDocUrl || googleDriveUrl,
      uploadedBy: googleUser?.displayName || 'Club Admin',
      description: 'Official Club Record Document',
      descriptionSinhala: 'සමාජ නිල ලේඛනය'
    });
    setIsAddingDoc(false);
    setNewDocTitle('');
    setNewDocTitleSi('');
  };

  // Copy WhatsApp Broadcast formatted message
  const handleCopyWhatsApp = () => {
    const formatted = `🏏 *YOUNG STAR SPORTS CLUB - GAMUDAWA*\n` +
      `📅 *MATCH NOTICE & SQUAD POLL*\n\n` +
      `🏆 *Match:* ${matchOrganizing.title}\n` +
      `📆 *Date & Time:* ${matchOrganizing.matchDate} at ${matchOrganizing.matchTime}\n` +
      `📍 *Ground:* ${matchOrganizing.venue}\n` +
      `⚔️ *Opponent:* ${matchOrganizing.opponentTeam}\n` +
      `👕 *Dress Code:* ${matchOrganizing.kitDressCode}\n` +
      `💰 *Entry Fee:* Rs. ${matchOrganizing.entryFeePerPlayer}\n\n` +
      `❓ *POLL QUESTION:* ${matchOrganizing.pollQuestion}\n` +
      `1️⃣ Option 1: Available & Confirmed\n` +
      `2️⃣ Option 2: Unavailable\n\n` +
      `📲 *Update your daily scores & response on official portal:*\n` +
      `Drive & Portal: ${googleDriveUrl}\n\n` +
      `_Young Star Sports Club Gamudawa Official_`;

    navigator.clipboard.writeText(formatted);
    setCopiedWhatsApp(true);
    showToast(language === 'si' ? 'WhatsApp පණිවුඩය පිටපත් කරගන්නා ලදී!' : 'WhatsApp text copied to clipboard!');
    setTimeout(() => setCopiedWhatsApp(false), 3000);
  };

  // Backup restore file input trigger
  const handleFileInputRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importMasterDocBackup(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export full HTML Dossier document for saving directly to Google Drive
  const exportHtmlDossier = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${clubProfile.name} - Official Club Living Dossier</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 900px; margin: 40px auto; padding: 24px; background: #fff; }
    h1 { color: #78350f; border-bottom: 2px solid #b45309; padding-bottom: 10px; margin-bottom: 4px; }
    h2 { color: #1e293b; margin-top: 32px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    .meta { font-size: 13px; color: #64748b; margin-bottom: 24px; line-height: 1.8; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; color: #334155; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 12px 0; font-size: 13px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <h1>${clubProfile.name}</h1>
  <div style="font-style: italic; color: #b45309; margin-bottom: 12px;">"${clubProfile.motto}"</div>
  <div class="meta">
    <strong>Estd:</strong> ${clubProfile.establishedYear} | <strong>Location:</strong> ${clubProfile.village} | <strong>Grounds:</strong> ${clubProfile.groundAddress}<br>
    <strong>Phone:</strong> ${clubProfile.phone} | <strong>Email:</strong> ${clubProfile.email}<br>
    <strong>Official Google Drive Folder:</strong> <a href="${googleDriveUrl}">${googleDriveUrl}</a><br>
    <strong>Generated Date:</strong> ${new Date().toLocaleDateString()}
  </div>

  <h2>1. Club Vision & Mission</h2>
  <div class="box">
    <p><strong>Vision (English):</strong> ${clubProfile.vision}</p>
    <p><strong>දැක්ම (Sinhala):</strong> ${clubProfile.visionSinhala}</p>
    <p><strong>Mission Goals:</strong></p>
    <ul>
      ${clubProfile.missionList.map(m => `<li>${m}</li>`).join('')}
    </ul>
  </div>

  <h2>2. Executive Leadership Committee</h2>
  <table>
    <thead><tr><th>Designation</th><th>Name</th><th>Phone</th></tr></thead>
    <tbody>
      ${managementLeaders.map(l => `<tr><td><strong>${l.designation}</strong></td><td>${l.name} (${l.nameSinhala || ''})</td><td>${l.phone || '-'}</td></tr>`).join('')}
    </tbody>
  </table>

  <h2>3. Registered Members & Cricket Career Profiles</h2>
  <table>
    <thead><tr><th>Code</th><th>Member Name</th><th>Phone</th><th>Role</th><th>Matches</th><th>Career Runs</th><th>Wickets</th></tr></thead>
    <tbody>
      ${memberRecords.map(m => `<tr><td>${m.memberCode}</td><td>${m.name}</td><td>${m.phone}</td><td>${m.playerRole || 'All-rounder'}</td><td>${m.careerMatches ?? 12}</td><td><strong>${m.careerRuns ?? (m.totalPaid ? m.totalPaid / 4 : 150)}</strong></td><td>${m.careerWickets ?? 8}</td></tr>`).join('')}
    </tbody>
  </table>

  <h2>4. Recent Daily Cricket Match Log</h2>
  <table>
    <thead><tr><th>Date</th><th>Player</th><th>Format</th><th>Runs (Balls)</th><th>Wickets (Overs)</th></tr></thead>
    <tbody>
      ${cricketEntries.slice(0, 15).map(c => `<tr><td>${c.date}</td><td>${c.memberName}</td><td>${c.matchType}</td><td><strong>${c.runsScored}</strong> (${c.ballsFaced}b)${c.isNotOut ? '*' : ''}</td><td>${c.wicketsTaken} w (${c.oversBowled} ov)</td></tr>`).join('')}
    </tbody>
  </table>

  <h2>5. Financial Accounts & Treasury</h2>
  <div class="box">
    <p><strong>Total Income:</strong> Rs. ${financeSummary.totalIncome.toLocaleString()} | <strong>Total Expenses:</strong> Rs. ${financeSummary.totalExpenses.toLocaleString()} | <strong>Net Balance:</strong> Rs. ${(financeSummary.totalIncome - financeSummary.totalExpenses).toLocaleString()}</p>
    <p><strong>Weekly Subscription Fee:</strong> Rs. ${financeSummary.weeklyFee} / member / week</p>
  </div>

  <h2>6. Upcoming Match & WhatsApp Squad Poll</h2>
  <div class="box">
    <p><strong>Match:</strong> ${matchOrganizing.title} (${matchOrganizing.matchDate} at ${matchOrganizing.matchTime})</p>
    <p><strong>Venue:</strong> ${matchOrganizing.venue} vs ${matchOrganizing.opponentTeam} (${matchOrganizing.overs} Overs - ${matchOrganizing.format})</p>
    <p><strong>Dress Code:</strong> ${matchOrganizing.kitDressCode} | <strong>Entry Fee:</strong> Rs. ${matchOrganizing.entryFeePerPlayer}</p>
    <p><strong>WhatsApp Poll Question:</strong> ${matchOrganizing.pollQuestion}</p>
  </div>

  <div class="footer">
    Young Star Sports Club - Gamudawa Official Master Record · Stored in Google Drive
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `YoungStar_Gamudawa_Club_Dossier_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(language === 'si' ? 'HTML ලේඛනය බාගත විය!' : 'HTML Club Dossier downloaded!');
  };

  const sections = [
    { id: 'profile', labelEn: '1. Club Profile & Vision', labelSi: '1. දැක්ම සහ තොරතුරු', icon: Shield },
    { id: 'leaders', labelEn: '2. Committee Leaders', labelSi: '2. පාලක මණ්ඩලය', icon: Users },
    { id: 'members', labelEn: '3. Members & Career', labelSi: '3. සාමාජික වාර්තා', icon: User },
    { id: 'cricket', labelEn: '4. Daily Cricket Ledger', labelSi: '4. දෛනික ලකුණු සටහන', icon: Trophy },
    { id: 'finances', labelEn: '5. Treasury & Dues', labelSi: '5. මූල්‍ය & ගාස්තු', icon: DollarSign },
    { id: 'match', labelEn: '6. Match Org & Poll', labelSi: '6. තරඟ & ඡන්ද විමසුම', icon: MessageSquare },
    { id: 'announcements', labelEn: '7. Announcements', labelSi: '7. නිවේදන', icon: Share2 },
    { id: 'docs', labelEn: '8. Documents Archive', labelSi: '8. ලිපිගොනු & Drive', icon: FolderOpen }
  ];

  return (
    <div className="space-y-8 pb-24 print:p-0 print:space-y-4">
      {/* Top Document Meta Bar & Organiser Security Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-stone-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold tracking-wide">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFICIAL MASTER LIVING DOCUMENT</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-Time Reactive Autosave</span>
              </span>
              {isOnlyMeAuthorized ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Only Me (Admin Mode) Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>View Only · Locked</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {language === 'si' ? 'සජීවී ප්‍රධාන ලේඛනය සහ වෙබ් සංස්කාරකය' : 'Living Master Document & Real-Time Portal Editor'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {language === 'si'
                ? 'මෙම පිටුව තුළින් ක්‍රීඩා සමාජයේ දැක්ම, සාමාජිකයින්ගේ ක්‍රිකට් ලකුණු, මූල්‍ය ගිණුම්, WhatsApp තරඟ ඡන්ද සහ සියලු තොරතුරු සෘජුවම වෙනස් කළ හැකි අතර සියලු පිටු ක්ෂණිකව යාවත්කාලීන වේ.'
                : 'Interactive document view to view and retype everything in the app. Edits update across the portal in real-time and synchronize directly with Google Drive and Google Sheets.'}
            </p>

            {/* Google Drive Status Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-amber-300 font-mono">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Google Drive:</span>
                <a
                  href={googleDriveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-white transition-colors ml-1"
                >
                  drive.google.com/drive/u/1/home
                </a>
              </span>
              {lastDriveSaveTime && (
                <span className="text-emerald-300 text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  Last Saved to Drive: {lastDriveSaveTime}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Save to Drive Button */}
            <button
              onClick={() => saveMasterDocToGoogleDrive()}
              disabled={isSavingToDrive}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              title="Save Master Document to Google Drive (downloads JSON backup and opens Drive)"
            >
              <Save className={`w-4 h-4 ${isSavingToDrive ? 'animate-spin' : ''}`} />
              <span>{isSavingToDrive ? 'Saving...' : language === 'si' ? 'Drive හි සුරකින්න' : 'Save to Google Drive'}</span>
            </button>

            {/* Sync Sheet */}
            <button
              onClick={() => syncGoogleSheet()}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="Sync all data to Google Sheet"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isSyncing ? 'Syncing...' : 'Sync Sheet'}</span>
            </button>

            {/* Export JSON Backup */}
            <button
              onClick={exportMasterDocBackup}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
              title="Download Full JSON Master Backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            {/* Export HTML Dossier */}
            <button
              onClick={exportHtmlDossier}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
              title="Download formatted HTML Dossier Document for Google Drive"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">HTML Doc</span>
            </button>

            {/* Import / Restore JSON */}
            <label className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileInputRestore}
                className="hidden"
              />
            </label>

            {/* Print / PDF */}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
              title="Print official club dossier or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {/* Toggle Only Me Mode */}
            {isOnlyMeAuthorized ? (
              <button
                onClick={() => revokeOnlyMe()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-xs font-semibold cursor-pointer"
                title="Lock Only Me edit mode"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock</span>
              </button>
            ) : (
              <button
                onClick={() => setShowPinModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                title="Unlock Only Me Organiser Mode"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock (Only Me)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security PIN / Auth Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>Organiser 'Only Me' Security Gate</span>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              {language === 'si'
                ? 'ක්‍රීඩා සමාජයේ ලේඛන සහ Google Drive සුරැකීමේ පූර්ණ අවසර ලබාගැනීම සඳහා සංවිධායක මුරපදය ඇතුළත් කරන්න (පෙරනිමි: 1998) හෝ Google ගිණුමෙන් ඇතුල් වන්න.'
                : 'Enter the club organiser PIN (Default: 1998) or authenticate with Google to enable Only Me saving and full document editing.'}
            </p>
            <form onSubmit={handleUnlockPin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Organiser Passcode / Secret PIN
                </label>
                <input
                  type="password"
                  placeholder="Enter 1998..."
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  autoFocus
                />
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs flex items-center justify-between gap-2">
                <div className="text-[11px] text-amber-900 font-semibold truncate">
                  Admin: <span className="font-mono">youngstarsportclubgamudawa@gmail.com</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    authorizeOnlyMe('youngstarsportclubgamudawa@gmail.com');
                    setShowPinModal(false);
                  }}
                  className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-[11px] font-bold shrink-0 cursor-pointer"
                >
                  Quick Unlock
                </button>
              </div>
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    await signInWithGoogle();
                    authorizeOnlyMe(googleUser?.email || onlyMeEmail);
                    setShowPinModal(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  Sign in with Google
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className="px-3.5 py-2 rounded-xl text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    Unlock Edit Access
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Pills across Document Sections */}
      <div className="sticky top-14 z-30 bg-[#f4f0e7]/90 backdrop-blur-md py-2 border-b border-amber-200/50 print:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeTabSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveTabSection(sec.id);
                  const el = document.getElementById(`doc-sec-${sec.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold whitespace-nowrap cursor-pointer transition-all ${
                  isActive
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'si' ? sec.labelSi : sec.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          THE LIVING DOCUMENT CANVAS (Styled as official executive club dossier)
      ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-12 space-y-12 print:border-none print:shadow-none print:p-0">

        {/* Dossier Letterhead Header */}
        <div className="border-b-2 border-amber-800/80 pb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left">
            <ClubLogo size={88} />
            <div>
              <span className="text-[11px] font-bold tracking-widest text-amber-800 uppercase">
                Official Registered Sports Club Dossier · Estd. {clubProfile.establishedYear}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {language === 'si' ? clubProfile.nameSinhala : clubProfile.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 italic">
                "{language === 'si' ? clubProfile.mottoSinhala : clubProfile.motto}"
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 space-y-1 hidden sm:block font-mono">
            <div>Document Ref: YSSC-MASTER-{clubProfile.establishedYear}</div>
            <div>Grounds: {clubProfile.village}</div>
            <div className="text-emerald-700 font-bold">● Status: Live Reactive Record</div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------
            SECTION 1: CLUB PROFILE, VISION & MISSION
        --------------------------------------------------------------------- */}
        <section id="doc-sec-profile" className="space-y-6 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Shield className="w-5 h-5 text-amber-700" />
              <span>1. Club Official Identity, Vision & Mission</span>
            </div>
            <span className="text-xs text-slate-400">Edits update Club page instantly</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Club Name (English)</label>
              <input
                type="text"
                value={clubProfile.name}
                onChange={(e) => updateClubProfile({ name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ක්‍රීඩා සමාජයේ නම (Sinhala)</label>
              <input
                type="text"
                value={clubProfile.nameSinhala}
                onChange={(e) => updateClubProfile({ nameSinhala: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Club Motto / Tagline (English)</label>
              <input
                type="text"
                value={clubProfile.motto}
                onChange={(e) => updateClubProfile({ motto: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">තේමා පාඨය (Sinhala Motto)</label>
              <input
                type="text"
                value={clubProfile.mottoSinhala}
                onChange={(e) => updateClubProfile({ mottoSinhala: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ground Address & Village</label>
              <input
                type="text"
                value={clubProfile.groundAddress}
                onChange={(e) => updateClubProfile({ groundAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone / WhatsApp</label>
              <input
                type="text"
                value={clubProfile.phone}
                onChange={(e) => updateClubProfile({ phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Vision Statement */}
          <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/70 space-y-3">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              🎯 Vision Statement (අපගේ දැක්ම)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Vision in English:</label>
                <textarea
                  rows={3}
                  value={clubProfile.vision}
                  onChange={(e) => updateClubProfile({ vision: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-slate-800 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">දැක්ම සිංහලෙන්:</label>
                <textarea
                  rows={3}
                  value={clubProfile.visionSinhala}
                  onChange={(e) => updateClubProfile({ visionSinhala: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-slate-800 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Mission Statement Bullets */}
          <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                🚀 Mission Goals List (අපගේ මෙහෙවර)
              </span>
              <button
                type="button"
                onClick={() => setIsAddingNewMission(!isAddingNewMission)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Goal</span>
              </button>
            </div>

            {isAddingNewMission && (
              <form onSubmit={handleAddMission} className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Mission goal in English..."
                  value={newMissionEn}
                  onChange={(e) => setNewMissionEn(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
                <input
                  type="text"
                  placeholder="මෙහෙවර ඉලක්කය සිංහලෙන්..."
                  value={newMissionSi}
                  onChange={(e) => setNewMissionSi(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewMission(false)}
                    className="px-2.5 py-1 text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold"
                  >
                    Save Goal
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {clubProfile.missionList.map((mEn, idx) => {
                const mSi = clubProfile.missionListSinhala[idx] || mEn;
                return (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-emerald-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="font-medium text-slate-800">💪 {mEn}</div>
                      <div className="text-slate-600 font-sinhala text-[11px]">{mSi}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteMission(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      title="Remove mission item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            SECTION 2: EXECUTIVE MANAGEMENT COMMITTEE (LEADERS)
        --------------------------------------------------------------------- */}
        <section id="doc-sec-leaders" className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Users className="w-5 h-5 text-amber-700" />
              <span>2. Executive Management Committee & Leaders</span>
            </div>
            <button
              onClick={() => setIsAddingLeader(!isAddingLeader)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Leader</span>
            </button>
          </div>

          {isAddingLeader && (
            <form onSubmit={handleAddLeader} className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3 text-xs">
              <span className="font-bold text-amber-900 block">Add New Committee Member</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Leader Name (English)"
                  value={newLeaderName}
                  onChange={(e) => setNewLeaderName(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="නම (සිංහල)"
                  value={newLeaderNameSi}
                  onChange={(e) => setNewLeaderNameSi(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Designation (e.g. President, Secretary)"
                  value={newLeaderDesig}
                  onChange={(e) => setNewLeaderDesig(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="තනතුර (e.g. සභාපති, ලේකම්)"
                  value={newLeaderDesigSi}
                  onChange={(e) => setNewLeaderDesigSi(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Phone number"
                  value={newLeaderPhone}
                  onChange={(e) => setNewLeaderPhone(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <select
                  value={newLeaderCat}
                  onChange={(e: any) => setNewLeaderCat(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="executive">Executive</option>
                  <option value="coaching">Coaching</option>
                  <option value="captains">Team Captain</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingLeader(false)}
                  className="px-3 py-1.5 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Add Leader to Dossier
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Designation / Role</th>
                  <th className="p-3">Official Name</th>
                  <th className="p-3">Sinhala Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {managementLeaders.map((ldr) => (
                  <tr key={ldr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-semibold text-slate-900">
                      <input
                        type="text"
                        value={ldr.designation}
                        onChange={(e) => updateLeader(ldr.id, { designation: e.target.value })}
                        className="w-full p-1 rounded-md border border-slate-200 focus:border-amber-500 font-bold"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={ldr.name}
                        onChange={(e) => updateLeader(ldr.id, { name: e.target.value })}
                        className="w-full p-1 rounded-md border border-slate-200 focus:border-amber-500"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={ldr.nameSinhala || ''}
                        onChange={(e) => updateLeader(ldr.id, { nameSinhala: e.target.value })}
                        className="w-full p-1 rounded-md border border-slate-200 focus:border-amber-500 font-sinhala"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={ldr.phone || ''}
                        onChange={(e) => updateLeader(ldr.id, { phone: e.target.value })}
                        className="w-full p-1 rounded-md border border-slate-200 focus:border-amber-500 font-mono text-[11px]"
                      />
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        {ldr.category}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteLeader(ldr.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Remove leader"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            SECTION 3: MEMBER DIRECTORY & CRICKET CAREER DETAILS
        --------------------------------------------------------------------- */}
        <section id="doc-sec-members" className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <User className="w-5 h-5 text-amber-700" />
                <span>3. Member Directory & Cricket Career Profiles</span>
              </div>
              <p className="text-xs text-slate-500">
                {memberRecords.length} registered club members. Edit details or retype in real time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter member..."
                  value={memberFilter}
                  onChange={(e) => setMemberFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs w-44"
                />
              </div>
              <button
                onClick={() => setIsAddingMemberInline(!isAddingMemberInline)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          {isAddingMemberInline && (
            <form onSubmit={handleAddMember} className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3 text-xs">
              <span className="font-bold text-emerald-900 block">Register New Member with Cricket Profile</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (English)"
                  value={newMemName}
                  onChange={(e) => setNewMemName(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="සම්පූර්ණ නම (සිංහල)"
                  value={newMemNameSi}
                  onChange={(e) => setNewMemNameSi(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Phone number"
                  value={newMemPhone}
                  onChange={(e) => setNewMemPhone(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <select
                  value={newMemRole}
                  onChange={(e) => setNewMemRole(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="All-rounder">All-rounder (තුන් ඉරියව්)</option>
                  <option value="Top-order Batsman">Top-order Batsman</option>
                  <option value="Fast Bowler">Fast Bowler</option>
                  <option value="Spin Bowler">Spin Bowler</option>
                  <option value="Wicketkeeper">Wicketkeeper</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMemberInline(false)}
                  className="px-3 py-1.5 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Register Member
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-slate-100 text-slate-700 uppercase font-bold text-[10px] z-10">
                <tr>
                  <th className="p-2.5">Code</th>
                  <th className="p-2.5">Member Name</th>
                  <th className="p-2.5">Phone</th>
                  <th className="p-2.5">Role</th>
                  <th className="p-2.5">Matches</th>
                  <th className="p-2.5">Runs</th>
                  <th className="p-2.5">High Score</th>
                  <th className="p-2.5">Wickets</th>
                  <th className="p-2.5">Dues Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredMembers.map((m) => {
                  return (
                    <tr key={m.memberId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2 font-mono font-bold text-slate-600 text-[11px]">
                        {m.memberCode}
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => updateMemberDetails(m.memberId, { name: e.target.value })}
                          className="w-36 p-1 rounded-md border border-slate-200 text-xs font-semibold"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={m.phone}
                          onChange={(e) => updateMemberDetails(m.memberId, { phone: e.target.value })}
                          className="w-28 p-1 rounded-md border border-slate-200 text-[11px] font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={m.playerRole || 'All-rounder'}
                          onChange={(e) => updateMemberDetails(m.memberId, { playerRole: e.target.value })}
                          className="w-28 p-1 rounded-md border border-slate-200 text-[11px]"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={m.careerMatches ?? 12}
                          onChange={(e) => updateMemberDetails(m.memberId, { careerMatches: Number(e.target.value) })}
                          className="w-14 p-1 rounded-md border border-slate-200 text-center font-bold"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={m.careerRuns ?? (m.totalPaid ? m.totalPaid / 4 : 150)}
                          onChange={(e) => updateMemberDetails(m.memberId, { careerRuns: Number(e.target.value) })}
                          className="w-16 p-1 rounded-md border border-slate-200 text-center font-bold text-amber-800"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={m.careerHighScore ?? 48}
                          onChange={(e) => updateMemberDetails(m.memberId, { careerHighScore: Number(e.target.value) })}
                          className="w-14 p-1 rounded-md border border-slate-200 text-center font-semibold"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={m.careerWickets ?? 8}
                          onChange={(e) => updateMemberDetails(m.memberId, { careerWickets: Number(e.target.value) })}
                          className="w-14 p-1 rounded-md border border-slate-200 text-center font-bold text-emerald-800"
                        />
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'good'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {m.status === 'good' ? 'Up to date' : `Due Rs ${m.totalOwed}`}
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <button
                          onClick={() => deleteMember(m.memberId)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          title="Delete member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            SECTION 4: DAILY CRICKET PERFORMANCE SCORE LEDGER
        --------------------------------------------------------------------- */}
        <section id="doc-sec-cricket" className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Trophy className="w-5 h-5 text-amber-700" />
                <span>4. Daily Cricket Performance Log (Runs & Wickets)</span>
              </div>
              <p className="text-xs text-slate-500">
                Logged innings from daily net practice, club matches, and tournaments. Instant live charts update!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Filter player / date..."
                value={cricketFilter}
                onChange={(e) => setCricketFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs w-44"
              />
              <button
                onClick={() => setIsAddingCricketEntry(!isAddingCricketEntry)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record Innings</span>
              </button>
            </div>
          </div>

          {isAddingCricketEntry && (
            <form onSubmit={handleAddCricketEntry} className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3 text-xs">
              <span className="font-bold text-amber-900 block">Record Daily Match / Practice Performance</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Player</label>
                  <select
                    value={entryMemberId}
                    onChange={(e) => setEntryMemberId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {memberRecords.map(m => (
                      <option key={m.memberId} value={m.memberId}>
                        {m.memberCode} - {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Match Type</label>
                  <select
                    value={entryMatchType}
                    onChange={(e: any) => setEntryMatchType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Daily Practice">Daily Practice</option>
                    <option value="Club Match">Club Match</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Friendly">Friendly Match</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Runs Scored</label>
                  <input
                    type="number"
                    value={entryRuns}
                    onChange={(e) => setEntryRuns(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Balls Faced</label>
                  <input
                    type="number"
                    value={entryBalls}
                    onChange={(e) => setEntryBalls(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">4s / 6s</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="4s"
                      value={entry4s}
                      onChange={(e) => setEntry4s(e.target.value)}
                      className="w-1/2 px-2 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                    <input
                      type="number"
                      placeholder="6s"
                      value={entry6s}
                      onChange={(e) => setEntry6s(e.target.value)}
                      className="w-1/2 px-2 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Wickets Taken</label>
                  <input
                    type="number"
                    value={entryWickets}
                    onChange={(e) => setEntryWickets(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Overs Bowled</label>
                  <input
                    type="text"
                    value={entryOvers}
                    onChange={(e) => setEntryOvers(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={entryNotOut}
                    onChange={(e) => setEntryNotOut(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span className="font-semibold text-slate-700">Not Out (*)</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCricketEntry(false)}
                    className="px-3 py-1.5 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Save Score Entry
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="overflow-x-auto max-h-[450px] overflow-y-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-slate-100 text-slate-700 uppercase font-bold text-[10px] z-10">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Player</th>
                  <th className="p-2.5">Format</th>
                  <th className="p-2.5">Runs (Balls)</th>
                  <th className="p-2.5">Boundaries</th>
                  <th className="p-2.5">Overs</th>
                  <th className="p-2.5">Wickets</th>
                  <th className="p-2.5">Notes</th>
                  <th className="p-2.5 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredCricket.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-2 font-mono text-[11px] text-slate-600">
                      <input
                        type="date"
                        value={c.date}
                        onChange={(e) => addOrUpdateCricketEntry({ ...c, date: e.target.value }, c.id)}
                        className="p-1 rounded border border-slate-200 text-[11px]"
                      />
                    </td>
                    <td className="p-2 font-semibold text-slate-900">
                      {c.memberName} <span className="text-[10px] font-mono text-slate-400">({c.memberCode})</span>
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-800">
                        {c.matchType}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1 font-bold text-amber-900">
                        <input
                          type="number"
                          value={c.runsScored}
                          onChange={(e) => addOrUpdateCricketEntry({ ...c, runsScored: Number(e.target.value) }, c.id)}
                          className="w-12 p-0.5 rounded border border-slate-200 text-center font-bold text-amber-900"
                        />
                        <span>({c.ballsFaced}b)</span>
                        {c.isNotOut && <span className="text-emerald-600 font-extrabold">*</span>}
                      </div>
                    </td>
                    <td className="p-2 text-slate-600">
                      {c.fours}x4, {c.sixes}x6
                    </td>
                    <td className="p-2 font-mono">
                      {c.oversBowled} ov
                    </td>
                    <td className="p-2 font-bold text-emerald-800">
                      <input
                        type="number"
                        value={c.wicketsTaken}
                        onChange={(e) => addOrUpdateCricketEntry({ ...c, wicketsTaken: Number(e.target.value) }, c.id)}
                        className="w-10 p-0.5 rounded border border-slate-200 text-center font-bold text-emerald-800"
                      />
                    </td>
                    <td className="p-2 text-[11px] text-slate-500 italic max-w-xs truncate">
                      {c.notes || '-'}
                    </td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => deleteCricketEntry(c.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Delete innings log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            SECTION 5: FINANCIAL BALANCE SHEET & WEEKLY DUES MATRIX
        --------------------------------------------------------------------- */}
        <section id="doc-sec-finances" className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <DollarSign className="w-5 h-5 text-amber-700" />
              <span>5. Financial Accounts, Treasury & Member Weekly Dues</span>
            </div>
            <button
              onClick={() => setIsAddingExpense(!isAddingExpense)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Expense</span>
            </button>
          </div>

          {/* Quick Summary Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-900 uppercase block mb-1">Total Income (Rs)</span>
              <input
                type="number"
                value={financeSummary.totalIncome}
                onChange={(e) => updateFinanceSummary({ totalIncome: Number(e.target.value) })}
                className="w-full text-lg font-black text-emerald-800 bg-transparent border-b border-emerald-400 focus:outline-hidden"
              />
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
              <span className="text-[11px] font-bold text-rose-900 uppercase block mb-1">Total Expenses (Rs)</span>
              <input
                type="number"
                value={financeSummary.totalExpenses}
                onChange={(e) => updateFinanceSummary({ totalExpenses: Number(e.target.value) })}
                className="w-full text-lg font-black text-rose-800 bg-transparent border-b border-rose-400 focus:outline-hidden"
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-[11px] font-bold text-blue-900 uppercase block mb-1">Net Treasury Balance (Rs)</span>
              <div className="text-lg font-black text-blue-900">
                Rs. {(financeSummary.totalIncome - financeSummary.totalExpenses).toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-[11px] font-bold text-amber-900 uppercase block mb-1">Weekly Fee / Member</span>
              <input
                type="number"
                value={financeSummary.weeklyFee}
                onChange={(e) => updateFinanceSummary({ weeklyFee: Number(e.target.value) })}
                className="w-full text-lg font-black text-amber-900 bg-transparent border-b border-amber-400 focus:outline-hidden"
              />
            </div>
          </div>

          {isAddingExpense && (
            <form onSubmit={handleAddExpense} className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-3 text-xs">
              <span className="font-bold text-slate-900 block">Record New Club Expense Voucher</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Expense Details / Purpose"
                  value={newExpDetails}
                  onChange={(e) => setNewExpDetails(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount (Rs)"
                  value={newExpAmount}
                  onChange={(e) => setNewExpAmount(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  required
                />
                <select
                  value={newExpCat}
                  onChange={(e) => setNewExpCat(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Ground Maintenance">Ground Maintenance</option>
                  <option value="Cricket Equipment">Cricket Equipment</option>
                  <option value="Refreshments">Refreshments</option>
                  <option value="Tournament Entry">Tournament Entry</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingExpense(false)}
                  className="px-3 py-1.5 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Post Expense
                </button>
              </div>
            </form>
          )}

          {/* Expenses Log Table */}
          {expenses.length > 0 && (
            <div className="overflow-x-auto max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Expense Details</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Amount (Rs)</th>
                    <th className="p-2.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/80">
                      <td className="p-2 font-mono text-[11px] text-slate-600">{exp.date}</td>
                      <td className="p-2 font-medium text-slate-900">{exp.expenseDetails}</td>
                      <td className="p-2 text-slate-500">{exp.category}</td>
                      <td className="p-2 font-bold text-rose-700">Rs. {exp.amount.toLocaleString()}</td>
                      <td className="p-2 text-right">
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ---------------------------------------------------------------------
            SECTION 6: MATCH ORGANIZING & WHATSAPP SQUAD POLL
        --------------------------------------------------------------------- */}
        <section id="doc-sec-match" className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <MessageSquare className="w-5 h-5 text-amber-700" />
              <span>6. Cricket Match Organizing & WhatsApp-style Poll</span>
            </div>
            <button
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              {copiedWhatsApp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWhatsApp ? 'Copied!' : 'Copy for WhatsApp'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Match Title</label>
              <input
                type="text"
                value={matchOrganizing.title}
                onChange={(e) => updateMatchOrganizing({ title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Match Date & Time</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={matchOrganizing.matchDate}
                  onChange={(e) => updateMatchOrganizing({ matchDate: e.target.value })}
                  className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
                <input
                  type="text"
                  value={matchOrganizing.matchTime}
                  onChange={(e) => updateMatchOrganizing({ matchTime: e.target.value })}
                  className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Venue / Ground</label>
              <input
                type="text"
                value={matchOrganizing.venue}
                onChange={(e) => updateMatchOrganizing({ venue: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Opponent Team</label>
              <input
                type="text"
                value={matchOrganizing.opponentTeam}
                onChange={(e) => updateMatchOrganizing({ opponentTeam: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Overs & Format</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={matchOrganizing.overs}
                  onChange={(e) => updateMatchOrganizing({ overs: Number(e.target.value) })}
                  className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold"
                />
                <select
                  value={matchOrganizing.format}
                  onChange={(e: any) => updateMatchOrganizing({ format: e.target.value })}
                  className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-semibold"
                >
                  <option value="T20">T20</option>
                  <option value="10-Over">10-Over</option>
                  <option value="One Day">One Day</option>
                  <option value="Box Cricket">Box Cricket</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dress Code & Entry Fee</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={matchOrganizing.kitDressCode}
                  onChange={(e) => updateMatchOrganizing({ kitDressCode: e.target.value })}
                  className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
                <input
                  type="number"
                  value={matchOrganizing.entryFeePerPlayer}
                  onChange={(e) => updateMatchOrganizing({ entryFeePerPlayer: Number(e.target.value) })}
                  className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Poll Question & Options */}
          <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200/80 space-y-3">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide block">
              💬 WhatsApp Poll Question (English & Sinhala)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Poll Question in English:</label>
                <input
                  type="text"
                  value={matchOrganizing.pollQuestion}
                  onChange={(e) => updateMatchOrganizing({ pollQuestion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">ඡන්ද විමසුම් ප්‍රශ්නය (Sinhala):</label>
                <input
                  type="text"
                  value={matchOrganizing.pollQuestionSinhala}
                  onChange={(e) => updateMatchOrganizing({ pollQuestionSinhala: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white font-sinhala"
                />
              </div>
            </div>

            {/* Poll Votes Tally */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {matchOrganizing.pollOptions.map((opt) => (
                <div key={opt.id} className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{opt.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
                      {opt.votes.length} Votes
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sinhala">{opt.labelSinhala}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            SECTION 7: CLUB OFFICIAL ANNOUNCEMENTS
        --------------------------------------------------------------------- */}
        <section id="doc-sec-announcements" className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Share2 className="w-5 h-5 text-amber-700" />
              <span>7. Official Club Announcements & Circulars</span>
            </div>
            <button
              onClick={() => setIsAddingAnn(!isAddingAnn)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Announcement</span>
            </button>
          </div>

          {isAddingAnn && (
            <form onSubmit={handleAddAnnouncement} className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3 text-xs">
              <span className="font-bold text-amber-900 block">Post New Official Announcement</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Announcement Title (English)"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="නිවේදන මාතෘකාව (Sinhala)"
                  value={newAnnTitleSi}
                  onChange={(e) => setNewAnnTitleSi(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <textarea
                  rows={2}
                  placeholder="Announcement content..."
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white sm:col-span-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAnn(false)}
                  className="px-3 py-1.5 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 flex items-start justify-between gap-4 text-xs hover:border-amber-300 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ann.priority.toUpperCase()}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{ann.title}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    By {ann.author} · {ann.date}
                  </div>
                </div>
                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  title="Delete announcement"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            SECTION 8: OFFICIAL DOCUMENTS & GOOGLE DRIVE ARCHIVE
        --------------------------------------------------------------------- */}
        <section id="doc-sec-docs" className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <FolderOpen className="w-5 h-5 text-amber-700" />
              <span>8. Official Documents & Google Drive File Archive</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openGoogleDriveDirectly}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Open Google Drive</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => setIsAddingDoc(!isAddingDoc)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Link Document</span>
              </button>
            </div>
          </div>

          {/* Google Drive Folder URL Configuration */}
          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-2 text-xs">
            <label className="block font-bold text-blue-900">
              Permanent Google Drive Folder Link (Official Club Cloud Archive)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={googleDriveUrl}
                onChange={(e) => updateGoogleDriveUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-blue-300 bg-white font-mono text-[11px]"
              />
              <button
                onClick={openGoogleDriveDirectly}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Visit Drive
              </button>
            </div>
            <span className="text-[11px] text-blue-700 block">
              Default: https://drive.google.com/drive/u/1/home
            </span>
          </div>

          {isAddingDoc && (
            <form onSubmit={handleAddDocument} className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-3 text-xs">
              <span className="font-bold text-slate-900 block">Link New Document from Google Drive</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Document Title (English)"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="ලේඛන නාමය (Sinhala)"
                  value={newDocTitleSi}
                  onChange={(e) => setNewDocTitleSi(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <select
                  value={newDocCat}
                  onChange={(e: any) => setNewDocCat(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="financial">Financial Report</option>
                  <option value="policies">Constitution & Rules</option>
                  <option value="minutes">Meeting Minutes</option>
                  <option value="fixtures">Fixtures & Matches</option>
                  <option value="forms">Registration Forms</option>
                </select>
                <input
                  type="text"
                  placeholder="Google Drive File / Folder URL"
                  value={newDocUrl}
                  onChange={(e) => setNewDocUrl(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono text-[11px] sm:col-span-3"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDoc(false)}
                  className="px-3 py-1.5 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Document Link
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 flex items-start justify-between gap-3 hover:border-amber-300 transition-colors"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{doc.title}</div>
                  <div className="text-[11px] text-slate-500 font-sinhala">{doc.titleSinhala}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Category: {doc.category} · Size: {doc.size}
                  </div>
                  <a
                    href={doc.driveUrl || googleDriveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold underline pt-1"
                  >
                    <span>View in Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  title="Remove document link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Living Document Footer Sign-off */}
        <div className="pt-8 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Young Star Sports Club - Gamudawa Official Master Record Dossier</span>
          </div>
          <div className="font-mono text-[11px]">
            Synchronized with: Google Drive & Google Sheet
          </div>
        </div>

      </div>
    </div>
  );
};
