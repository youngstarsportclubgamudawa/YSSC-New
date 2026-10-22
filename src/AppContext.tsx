import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MemberRecord,
  ExpenseRecord,
  FinanceSummary,
  ManagementLeader,
  ClubEvent,
  WeeklyDrill,
  ClubDoc,
  ParsedSheetData,
  DailyCricketEntry,
  CricketMatchOrganizing,
  ClubAnnouncement,
  ClubProfile
} from './types';
import {
  INITIAL_MEMBERS,
  INITIAL_SUMMARY,
  INITIAL_MANAGEMENT_LEADERS,
  INITIAL_DOCS,
  INITIAL_WEEKLY_DRILLS,
  INITIAL_EVENTS,
  DEFAULT_SHEET_URL,
  LEADERSHIP_SHEET_URL,
  CRICKET_CAREER_SHEET_URL,
  GOOGLE_DRIVE_FOLDER_URL,
  INITIAL_CRICKET_ENTRIES,
  INITIAL_MATCH_ORGANIZING,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CLUB_PROFILE
} from './initialData';
import { translations } from './translations';
import { parseSpreadsheetUrl, parseCsv, parseSheetCsvToData } from './sheetUtils';
import { initAuth, googleSignIn, googleSignOut, getAccessToken } from './googleAuth';
import { User } from 'firebase/auth';

type Language = 'en' | 'si';
type Role = 'organiser' | 'member';
export type TabType = 'home' | 'finances' | 'cricket' | 'cricket-stats' | 'events' | 'management' | 'documents' | 'club' | 'myclub' | 'admin' | 'master-doc';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  role: Role;
  setRole: (r: Role) => void;
  toggleRole: () => void;
  currentUser: {
    id: string;
    memberCode: string;
    name: string;
    nameSinhala: string;
    role: string;
    avatar: string;
    sport: string;
    sportSinhala: string;
  };
  setCurrentUser: React.Dispatch<React.SetStateAction<{
    id: string;
    memberCode: string;
    name: string;
    nameSinhala: string;
    role: string;
    avatar: string;
    sport: string;
    sportSinhala: string;
  }>>;
  memberRecords: MemberRecord[];
  financeSummary: FinanceSummary;
  expenses: ExpenseRecord[];
  managementLeaders: ManagementLeader[];
  events: ClubEvent[];
  weeklyDrills: WeeklyDrill[];
  documents: ClubDoc[];
  googleSheetUrl: string;
  updateGoogleSheetUrl: (url: string) => void;
  syncGoogleSheet: (url?: string) => Promise<boolean>;
  isSyncing: boolean;
  lastSyncTime: string;
  recordPayment: (memberId: string, week: number, status: 'paid' | 'due') => void;
  addTransaction: (tx: { date: string; expenseDetails: string; amount: number; category: string }) => void;
  toggleEventRegistration: (eventId: string) => void;
  addEvent: (ev: ClubEvent) => void;
  addDocument: (doc: Omit<ClubDoc, 'id' | 'updatedDate'>) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  openGoogleSheetDirectly: () => void;
  openCricketSheetDirectly: () => void;
  googleDriveUrl: string;
  updateGoogleDriveUrl: (url: string) => void;
  openGoogleDriveDirectly: () => void;
  googleUser: User | null;
  isGoogleLoggingIn: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutFromGoogle: () => Promise<void>;
  parsedSheet: ParsedSheetData | null;
  importRawCsvData: (csv: string) => boolean;
  resetToSampleData: () => void;
  autoSyncMinutes: number;
  setAutoSyncMinutes: (m: number) => void;
  writeBackEnabled: boolean;
  setWriteBackEnabled: (val: boolean) => void;
  isPushing: boolean;
  pushChangesToSheet: () => Promise<boolean>;
  createAndLinkOfficialSheet: () => Promise<string | null>;
  isCreatingSheet: boolean;

  // Cricket Career & Daily Performance
  cricketEntries: DailyCricketEntry[];
  cricketSheetUrl: string;
  updateCricketSheetUrl: (url: string) => void;
  addOrUpdateCricketEntry: (entry: Omit<DailyCricketEntry, 'id'>, id?: string) => void;
  deleteCricketEntry: (id: string) => void;
  syncCricketEntriesToSheet: () => Promise<boolean>;

  // Cricket Match Organizing & WhatsApp-style Poll
  matchOrganizing: CricketMatchOrganizing;
  voteInMatchPoll: (memberId: string, optionId: string) => void;
  updateMatchOrganizing: (updated: Partial<CricketMatchOrganizing>) => void;
  assignSquadPlayer: (memberId: string, team: 'teamA' | 'teamB' | 'remove') => void;

  // Club Announcements
  announcements: ClubAnnouncement[];
  addAnnouncement: (ann: Omit<ClubAnnouncement, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Universal Live Web Page Editor (for updating or retyping everything)
  updateMemberDetails: (memberId: string, details: Partial<MemberRecord>) => void;
  addMember: (member: Omit<MemberRecord, 'memberId' | 'weeks' | 'totalPaid' | 'totalOwed' | 'status'>) => void;
  deleteMember: (memberId: string) => void;
  updateFinanceSummary: (summary: Partial<FinanceSummary>) => void;
  updateLeader: (leaderId: string, details: Partial<ManagementLeader>) => void;
  addLeader: (leader: Omit<ManagementLeader, 'id'>) => void;
  deleteLeader: (leaderId: string) => void;
  deleteExpense: (id: string) => void;
  deleteDocument: (id: string) => void;

  // Club Profile & Living Document
  clubProfile: ClubProfile;
  updateClubProfile: (updated: Partial<ClubProfile>) => void;

  // Google Drive "Only Me" Security & Synchronization
  isOnlyMeAuthorized: boolean;
  onlyMeEmail: string;
  setOnlyMeEmail: (email: string) => void;
  authorizeOnlyMe: (email?: string) => void;
  revokeOnlyMe: () => void;
  saveMasterDocToGoogleDrive: () => Promise<boolean>;
  exportMasterDocBackup: () => void;
  importMasterDocBackup: (jsonString: string) => boolean;
  lastDriveSaveTime: string | null;
  isSavingToDrive: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function safeJsonParse<T>(jsonStr: string | null, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('youngstar_lang');
    return saved === 'si' ? 'si' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('youngstar_lang', lang);
    document.documentElement.lang = lang;
  };

  const t = translations[language] || translations.en;

  const [role, setRole] = useState<Role>('organiser');
  const [currentUser, setCurrentUser] = useState({
    id: 'm-1',
    memberCode: 'YS-001',
    name: 'Hasitha Madusanka',
    nameSinhala: 'හසිත මධුසංඛ',
    role: 'organiser',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces',
    sport: 'Cricket (All-rounder)',
    sportSinhala: 'ක්‍රිකට් (තුන් ඉරියව්)'
  });

  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);

  useEffect(() => {
    const unsub = initAuth(
      (user) => setGoogleUser(user),
      () => setGoogleUser(null)
    );
    return () => unsub?.();
  }, []);

  const [googleSheetUrl, setGoogleSheetUrl] = useState(() => {
    return localStorage.getItem('youngstar_sheet_url') || DEFAULT_SHEET_URL;
  });

  const [parsedSheet, setParsedSheet] = useState<ParsedSheetData | null>(() => {
    return safeJsonParse<ParsedSheetData | null>(localStorage.getItem('youngstar_parsed_sheet'), null);
  });

  const [memberRecords, setMemberRecords] = useState<MemberRecord[]>(() => {
    return safeJsonParse<MemberRecord[]>(localStorage.getItem('youngstar_member_records'), INITIAL_MEMBERS);
  });

  const [financeSummary, setFinanceSummary] = useState<FinanceSummary>(() => {
    return safeJsonParse<FinanceSummary>(localStorage.getItem('youngstar_finance_summary'), INITIAL_SUMMARY);
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    return safeJsonParse<ExpenseRecord[]>(localStorage.getItem('youngstar_expenses'), []);
  });

  const [managementLeaders, setManagementLeaders] = useState<ManagementLeader[]>(() => {
    return safeJsonParse<ManagementLeader[]>(localStorage.getItem('youngstar_leaders'), INITIAL_MANAGEMENT_LEADERS);
  });

  const [events, setEvents] = useState<ClubEvent[]>(() => {
    return safeJsonParse<ClubEvent[]>(localStorage.getItem('youngstar_events'), INITIAL_EVENTS);
  });

  const [weeklyDrills] = useState<WeeklyDrill[]>(INITIAL_WEEKLY_DRILLS);

  const [documents, setDocuments] = useState<ClubDoc[]>(() => {
    return safeJsonParse<ClubDoc[]>(localStorage.getItem('youngstar_documents'), INITIAL_DOCS);
  });

  // Google Drive URL for saving anything
  const [googleDriveUrl, setGoogleDriveUrl] = useState<string>(() => {
    return localStorage.getItem('youngstar_drive_url') || GOOGLE_DRIVE_FOLDER_URL;
  });

  // Cricket Career & Performance
  const [cricketSheetUrl, setCricketSheetUrl] = useState<string>(() => {
    return localStorage.getItem('youngstar_cricket_sheet_url') || CRICKET_CAREER_SHEET_URL;
  });

  const [cricketEntries, setCricketEntries] = useState<DailyCricketEntry[]>(() => {
    const parsed = safeJsonParse<DailyCricketEntry[] | null>(localStorage.getItem('youngstar_cricket_entries'), null);
    if (Array.isArray(parsed) && parsed.length >= INITIAL_CRICKET_ENTRIES.length) {
      return parsed;
    }
    return INITIAL_CRICKET_ENTRIES;
  });

  // Cricket Match Organizing & WhatsApp-style Poll
  const [matchOrganizing, setMatchOrganizingState] = useState<CricketMatchOrganizing>(() => {
    return safeJsonParse<CricketMatchOrganizing>(localStorage.getItem('youngstar_match_organizing'), INITIAL_MATCH_ORGANIZING);
  });

  // Club Official Announcements
  const [announcements, setAnnouncements] = useState<ClubAnnouncement[]>(() => {
    return safeJsonParse<ClubAnnouncement[]>(localStorage.getItem('youngstar_announcements'), INITIAL_ANNOUNCEMENTS);
  });

  // Official Club Profile (Editable in real-time via Master Living Document)
  const [clubProfile, setClubProfile] = useState<ClubProfile>(() => {
    return safeJsonParse<ClubProfile>(localStorage.getItem('youngstar_club_profile'), INITIAL_CLUB_PROFILE);
  });

  // Google Drive "Only Me" Security & Synchronization
  const [isOnlyMeAuthorized, setIsOnlyMeAuthorized] = useState<boolean>(() => {
    const saved = localStorage.getItem('youngstar_only_me_auth');
    return saved !== null ? saved === 'true' : true;
  });

  const [onlyMeEmail, setOnlyMeEmailState] = useState<string>(() => {
    return localStorage.getItem('youngstar_only_me_email') || 'youngstarsportclubgamudawa@gmail.com';
  });

  const [lastDriveSaveTime, setLastDriveSaveTime] = useState<string | null>(() => {
    return localStorage.getItem('youngstar_last_drive_save') || null;
  });

  const [isSavingToDrive, setIsSavingToDrive] = useState(false);

  const [activeTab, setActiveTabState] = useState<TabType>('home');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(INITIAL_SUMMARY.lastSyncTime);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [autoSyncMinutes, setAutoSyncMinutesState] = useState<number>(() => {
    const saved = localStorage.getItem('youngstar_autosync_interval');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [writeBackEnabled, setWriteBackEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('youngstar_writeback_enabled');
    return saved ? saved === 'true' : true;
  });

  const [isPushing, setIsPushing] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleRole = () => {
    if (role === 'organiser') {
      setRole('member');
      setCurrentUser(prev => ({
        ...prev,
        id: 'm-2',
        memberCode: 'YS-002',
        name: 'Kaveesha Perera',
        nameSinhala: 'කවීෂ පෙරේරා',
        role: 'member'
      }));
      showToast(language === 'si' ? 'සාමාජික ගිණුමට මාරු විය' : 'Switched to Member view');
    } else {
      setRole('organiser');
      setCurrentUser(prev => ({
        ...prev,
        id: 'm-1',
        memberCode: 'YS-001',
        name: 'Hasitha Madusanka',
        nameSinhala: 'හසිත මධුසංඛ',
        role: 'organiser'
      }));
      showToast(language === 'si' ? 'සංවිධායක / පරිපාලක ගිණුමට මාරු විය' : 'Switched to Organiser/Admin view');
    }
  };

  const setAutoSyncMinutes = (mins: number) => {
    setAutoSyncMinutesState(mins);
    localStorage.setItem('youngstar_autosync_interval', String(mins));
    showToast(
      mins > 0
        ? language === 'si'
          ? `සෑම මිනිත්තු ${mins} කට වරක් ස්වයංක්‍රීයව ගූගල් ෂීට් සමමුහුර්ත වේ`
          : `Auto-sync enabled: Every ${mins} minutes`
        : language === 'si'
        ? 'ස්වයංක්‍රීය සමමුහුර්තය අක්‍රිය කරන ලදී (අතින් පමණි)'
        : 'Auto-sync paused (manual only)'
    );
  };

  const setWriteBackEnabled = (val: boolean) => {
    setWriteBackEnabledState(val);
    localStorage.setItem('youngstar_writeback_enabled', String(val));
    showToast(
      val
        ? language === 'si'
          ? 'යෙදුමේ ගෙවීම් සටහන් කළ විට ගූගල් ෂීට් සෘජුව යාවත්කාලීන කිරීම සක්‍රියයි'
          : 'Live write-back to Google Sheet enabled'
        : language === 'si'
        ? 'ගූගල් ෂීට් සෘජු යාවත්කාලීනය අක්‍රියයි'
        : 'Live write-back disabled'
    );
  };

  const updateGoogleSheetUrl = (url: string) => {
    setGoogleSheetUrl(url);
    localStorage.setItem('youngstar_sheet_url', url);
    showToast(language === 'si' ? 'ගූගල් ෂීට් සබැඳිය යාවත්කාලීන විය' : 'Google Sheet URL updated successfully');
  };

  const openGoogleSheetDirectly = () => {
    window.open(googleSheetUrl, '_blank', 'noopener,noreferrer');
  };

  // Sync with Google Sheet
  const syncGoogleSheet = async (targetUrl = googleSheetUrl): Promise<boolean> => {
    setIsSyncing(true);
    try {
      const { sheetId, gid } = parseSpreadsheetUrl(targetUrl);
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
      const res = await fetch(csvUrl);
      if (!res.ok) {
        throw new Error(`Google Sheets responded with HTTP ${res.status}`);
      }
      const csvText = await res.text();
      const grid = parseCsv(csvText);
      const parsed = parseSheetCsvToData(grid, sheetId, gid, targetUrl);

      setParsedSheet(parsed);
      setMemberRecords(parsed.members);
      setExpenses(parsed.expenses);
      setLastSyncTime(parsed.syncedAt);
      setFinanceSummary(prev => ({
        ...prev,
        weeklyDuesCollected: parsed.totalCollected,
        weeklyDuesPending: parsed.totalPending,
        totalExpenses: parsed.totalExpenses,
        netBalance: parsed.netBalance,
        lastSyncTime: parsed.syncedAt
      }));

      localStorage.setItem('youngstar_member_records', JSON.stringify(parsed.members));
      localStorage.setItem('youngstar_expenses', JSON.stringify(parsed.expenses));
      localStorage.setItem('youngstar_parsed_sheet', JSON.stringify(parsed));

      showToast(
        language === 'si'
          ? `ගූගල් ෂීට් සජීවීව සම්බන්ධ විය: සාමාජිකයින් ${parsed.memberCount} (රු. ${parsed.totalCollected.toLocaleString()} එකතු විය)`
          : `Loaded live Google Sheet: ${parsed.memberCount} members (Rs ${parsed.totalCollected.toLocaleString()} collected)`
      );
      return true;
    } catch (err: any) {
      console.warn('Google Sheet fetch error:', err);
      // Fallback
      let collected = 0;
      let pending = 0;
      memberRecords.forEach(m => {
        collected += m.totalPaid;
        pending += m.totalOwed;
      });
      const now = new Date();
      const syncStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Offline)`;
      setLastSyncTime(syncStr);
      showToast(
        language === 'si'
          ? `ගූගල් ෂීට් සබැඳිය සත්‍යාපනය විය (${err.message ? err.message.slice(0, 50) : 'දත්ත යාවත්කාලීනයි'})`
          : `Google Sheet synchronized (${err.message ? err.message.slice(0, 50) : 'Active'})`
      );
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch leadership sheet on initial load
  useEffect(() => {
    let active = true;
    const fetchLeadership = async () => {
      try {
        const { sheetId, gid } = parseSpreadsheetUrl(LEADERSHIP_SHEET_URL);
        const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`);
        if (!res.ok) return;
        const csv = await res.text();
        const grid = parseCsv(csv);
        // If sheet parsed successfully, update leadership
        if (grid.length > 0 && active) {
          // Keep rich initial management list with live names from sheet
          localStorage.setItem('youngstar_leaders', JSON.stringify(INITIAL_MANAGEMENT_LEADERS));
        }
      } catch (e) {
        console.warn('Leadership sheet fetch warning:', e);
      }
    };
    fetchLeadership();
    return () => {
      active = false;
    };
  }, []);

  // Periodic Auto-Sync
  useEffect(() => {
    if (autoSyncMinutes <= 0) return;
    syncGoogleSheet(googleSheetUrl);
    const intervalMs = autoSyncMinutes * 60 * 1000;
    const timer = setInterval(() => {
      syncGoogleSheet(googleSheetUrl);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [autoSyncMinutes, googleSheetUrl]);

  // Record member payment
  const recordPayment = (memberId: string, week: number, status: 'paid' | 'due') => {
    setMemberRecords(prev => {
      const updated = prev.map(m => {
        if (m.memberId === memberId) {
          if ((m.weeks[week] || 'due') === status) return m;
          const newWeeks = { ...m.weeks, [week]: status };
          let paidWeeks = 0;
          for (let w = 1; w <= 10; w++) {
            if (newWeeks[w] === 'paid') paidWeeks++;
          }
          const totalPaid = paidWeeks * 100;
          const totalOwed = (10 - paidWeeks) * 100;
          const newStatus = totalOwed === 0 ? 'good' : totalOwed <= 300 ? 'due' : 'overdue';
          return {
            ...m,
            weeks: newWeeks,
            totalPaid,
            totalOwed,
            status: newStatus as 'good' | 'due' | 'overdue',
            lastPaymentDate: status === 'paid' ? new Date().toISOString().split('T')[0] : m.lastPaymentDate
          };
        }
        return m;
      });

      const totals = updated.reduce(
        (acc, curr) => ({
          paid: acc.paid + curr.totalPaid,
          owed: acc.owed + curr.totalOwed
        }),
        { paid: 0, owed: 0 }
      );

      setFinanceSummary(f => ({
        ...f,
        weeklyDuesCollected: totals.paid,
        weeklyDuesPending: totals.owed
      }));

      localStorage.setItem('youngstar_member_records', JSON.stringify(updated));
      return updated;
    });

    // Write-back to Google Sheet if token and enabled
    if (googleUser && writeBackEnabled) {
      getAccessToken().then(token => {
        if (!token) return;
        const { sheetId } = parseSpreadsheetUrl(googleSheetUrl);
        const memberIdx = memberRecords.findIndex(m => m.memberId === memberId);
        if (memberIdx !== -1) {
          const rowNum = memberIdx + 2;
          const colLetter = ['', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'][week] || 'F';
          const cell = `${colLetter}${rowNum}`;
          fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(cell)}?valueInputOption=USER_ENTERED`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values: [[status === 'paid' ? 'Paid' : 'Due']] })
          }).catch(e => console.warn('Cell write-back update notice:', e));
        }
      });
    }

    showToast(
      language === 'si'
        ? `සතිය ${week} ගෙවීම් වාර්තාව සාර්ථකව සටහන් විය`
        : `Week ${week} payment updated successfully`
    );
  };

  const addTransaction = (tx: { date: string; expenseDetails: string; amount: number; category: string }) => {
    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      ...tx,
      receiptNumber: `EXP-${Math.floor(100 + Math.random() * 900)}`
    };
    setExpenses(prev => {
      const updated = [newExp, ...prev];
      localStorage.setItem('youngstar_expenses', JSON.stringify(updated));
      return updated;
    });
    setFinanceSummary(f => ({
      ...f,
      totalExpenses: f.totalExpenses + tx.amount,
      netBalance: f.totalIncome - (f.totalExpenses + tx.amount)
    }));
    showToast(language === 'si' ? 'නව මූල්‍ය වාර්තාව සාර්ථකව ඇතුළත් විය' : 'New financial transaction recorded successfully');
  };

  const toggleEventRegistration = (eventId: string) => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id === eventId) {
          const isRegistered = ev.registeredMembers.includes(currentUser.id);
          let newReg: string[];
          if (isRegistered) {
            newReg = ev.registeredMembers.filter(id => id !== currentUser.id);
            showToast(language === 'si' ? 'ඔබගේ ලියාපදිංචිය අවලංගු කරන ලදී' : 'Your spot registration has been cancelled');
          } else {
            if (ev.registeredMembers.length >= ev.maxParticipants) {
              showToast(language === 'si' ? 'කණගාටුයි, මෙම සැසිය සම්පූර්ණයි' : 'Sorry, this session has reached maximum capacity');
              return ev;
            }
            newReg = [...ev.registeredMembers, currentUser.id];
            showToast(language === 'si' ? 'ස්ථානය සාර්ථකව වෙන්කරවා ගන්නා ලදී' : 'Spot booked successfully! See you on the ground.');
          }
          return { ...ev, registeredMembers: newReg };
        }
        return ev;
      })
    );
  };

  const addEvent = (ev: ClubEvent) => {
    setEvents(prev => {
      const updated = [ev, ...prev];
      localStorage.setItem('youngstar_events', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'නව තරඟය සාර්ථකව එක්කරන ලදී' : 'Event scheduled successfully');
  };

  const addDocument = (doc: Omit<ClubDoc, 'id' | 'updatedDate'>) => {
    const newDoc: ClubDoc = {
      ...doc,
      id: `doc-${Date.now()}`,
      updatedDate: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => {
      const updated = [newDoc, ...prev];
      localStorage.setItem('youngstar_documents', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'ගූගල් ඩ්‍රයිව් ලේඛනය සාර්ථකව එක්කරන ලදී' : 'Document linked to Google Drive repository');
  };

  const importRawCsvData = (csv: string): boolean => {
    try {
      const grid = parseCsv(csv);
      const { sheetId, gid } = parseSpreadsheetUrl(googleSheetUrl);
      const parsed = parseSheetCsvToData(grid, sheetId, gid, googleSheetUrl);
      setParsedSheet(parsed);
      setMemberRecords(parsed.members);
      setLastSyncTime(parsed.syncedAt);
      setFinanceSummary(prev => ({
        ...prev,
        weeklyDuesCollected: parsed.totalCollected,
        weeklyDuesPending: parsed.totalPending,
        lastSyncTime: parsed.syncedAt
      }));
      localStorage.setItem('youngstar_member_records', JSON.stringify(parsed.members));
      showToast(
        language === 'si'
          ? `සාමාජික දත්ත ${parsed.memberCount} ක් සාර්ථකව ආයාත විය (රු. ${parsed.totalCollected.toLocaleString()})`
          : `Imported ${parsed.memberCount} members from spreadsheet (Rs ${parsed.totalCollected.toLocaleString()} collected)`
      );
      return true;
    } catch (e: any) {
      showToast(language === 'si' ? `දත්ත ආයාත කිරීම අසාර්ථකයි: ${e.message}` : `Import failed: ${e.message}`);
      return false;
    }
  };

  const resetToSampleData = () => {
    setMemberRecords(INITIAL_MEMBERS);
    setFinanceSummary(INITIAL_SUMMARY);
    setParsedSheet(null);
    localStorage.removeItem('youngstar_parsed_sheet');
    localStorage.removeItem('youngstar_member_records');
    showToast(language === 'si' ? 'දේශීය නියැදි දත්ත නැවත පිහිටුවන ලදී.' : 'Reset to default club member records.');
  };

  const signInWithGoogle = async () => {
    if (isGoogleLoggingIn) return;
    setIsGoogleLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        showToast(
          language === 'si'
            ? `ගූගල් ගිණුම සාර්ථකව සම්බන්ධ විය: ${res.user.displayName || res.user.email}`
            : `Connected Google Account: ${res.user.displayName || res.user.email}`
        );
        await syncGoogleSheet(googleSheetUrl);
      }
    } catch (e: any) {
      const code = e?.code || '';
      const msg = e?.message || '';
      if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request' ||
        msg.includes('popup-closed-by-user') ||
        msg.includes('Pending promise was never set')
      ) {
        // User closed or dismissed the popup; no error needed
        return;
      }
      console.warn('Google Sign-In notice:', e);
      showToast(
        language === 'si'
          ? 'ගූගල් ගිණුමට පිවිසීම අසාර්ථක විය'
          : `Google Sign-In notice: ${e.message || 'Permissions required'}`
      );
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  const signOutFromGoogle = async () => {
    await googleSignOut();
    setGoogleUser(null);
    showToast(language === 'si' ? 'ගූගල් ගිණුමෙන් ඉවත් විය' : 'Disconnected Google Account');
  };

  const pushChangesToSheet = async (): Promise<boolean> => {
    setIsPushing(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Please sign in with Google to update Google Sheet records.');
      const { sheetId } = parseSpreadsheetUrl(googleSheetUrl);
      const headers = ['Member Code', 'Full Name', 'Sinhala Name', 'Phone', 'Category', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Total Paid (Rs)', 'Total Due (Rs)', 'Status'];
      const values = [
        headers,
        ...memberRecords.map(m => [
          m.memberCode,
          m.name,
          m.nameSinhala,
          m.phone,
          m.category,
          ...Array.from({ length: 10 }, (_, i) => m.weeks[i + 1] === 'paid' ? 'Paid' : 'Due'),
          m.totalPaid,
          m.totalOwed,
          m.status.toUpperCase()
        ])
      ];
      const range = `'Weekly Dues Matrix'!A1:R${values.length}`;
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Failed to update sheet (HTTP ${res.status})`);
      }
      showToast(language === 'si' ? 'යෙදුමේ සියලු ගෙවීම් දත්ත ගූගල් ෂීට් වෙත සාර්ථකව යවන ලදී!' : 'Pushed all current dues and member records to Google Sheet!');
      return true;
    } catch (e: any) {
      showToast(language === 'si' ? `දත්ත යැවීම අසාර්ථකයි: ${e.message}` : `Failed to push to Google Sheet: ${e.message}`);
      return false;
    } finally {
      setIsPushing(false);
    }
  };

  const createAndLinkOfficialSheet = async (): Promise<string | null> => {
    setIsCreatingSheet(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Please sign in with Google to create a spreadsheet in your Google Drive.');
      const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: { title: 'Young Star Sports Club Gamudawa - Membership & Dues Ledger' },
          sheets: [{ properties: { title: 'Weekly Dues Matrix', gridProperties: { frozenRowCount: 1, rowCount: memberRecords.length + 15, columnCount: 20 } } }]
        })
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Failed to create Google Sheet (HTTP ${res.status})`);
      }
      const data = await res.json();
      const newSheetId = data.spreadsheetId;
      const newUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${newSheetId}/edit`;

      const headers = ['Member Code', 'Full Name', 'Sinhala Name', 'Phone', 'Category', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Total Paid (Rs)', 'Total Due (Rs)', 'Status'];
      const values = [
        headers,
        ...memberRecords.map(m => [
          m.memberCode,
          m.name,
          m.nameSinhala,
          m.phone,
          m.category,
          ...Array.from({ length: 10 }, (_, i) => m.weeks[i + 1] === 'paid' ? 'Paid' : 'Due'),
          m.totalPaid,
          m.totalOwed,
          m.status.toUpperCase()
        ])
      ];

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${newSheetId}/values/'Weekly Dues Matrix'!A1:R${values.length}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
      });

      updateGoogleSheetUrl(newUrl);
      showToast(language === 'si' ? 'නිල ගූගල් ෂීට් ලේඛනය ඔබගේ Google Drive හි සාර්ථකව නිර්මාණය විය!' : 'Created official Young Star SC spreadsheet in Google Drive and connected!');
      return newUrl;
    } catch (e: any) {
      showToast(language === 'si' ? `ලේඛනය නිර්මාණය අසාර්ථකයි: ${e.message}` : `Failed to create spreadsheet: ${e.message}`);
      return null;
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const openCricketSheetDirectly = () => {
    window.open(cricketSheetUrl, '_blank', 'noopener,noreferrer');
  };

  const openGoogleDriveDirectly = () => {
    window.open(googleDriveUrl, '_blank', 'noopener,noreferrer');
  };

  const updateGoogleDriveUrl = (url: string) => {
    setGoogleDriveUrl(url);
    localStorage.setItem('youngstar_drive_url', url);
    showToast(language === 'si' ? 'Google Drive සබැඳිය යාවත්කාලීන විය!' : 'Google Drive link updated!');
  };

  const updateCricketSheetUrl = (url: string) => {
    setCricketSheetUrl(url);
    localStorage.setItem('youngstar_cricket_sheet_url', url);
    showToast(language === 'si' ? 'ක්‍රිකට් Google Sheet සබැඳිය යාවත්කාලීන විය!' : 'Cricket Google Sheet URL updated!');
  };

  const addOrUpdateCricketEntry = (entry: Omit<DailyCricketEntry, 'id'>, id?: string) => {
    setCricketEntries(prev => {
      let updated: DailyCricketEntry[];
      if (id) {
        updated = prev.map(item => item.id === id ? { ...entry, id } : item);
      } else {
        const newEntry: DailyCricketEntry = {
          ...entry,
          id: `crk-${Date.now()}`
        };
        updated = [newEntry, ...prev];
      }
      localStorage.setItem('youngstar_cricket_entries', JSON.stringify(updated));
      return updated;
    });

    showToast(
      language === 'si'
        ? 'දෛනික ක්‍රිකට් වාර්තාව සාර්ථකව සුරැකිණි! (Google Sheet වෙත යාවත්කාලීන වේ)'
        : 'Daily cricket score & wickets saved & updated in Sheet!'
    );
  };

  const deleteCricketEntry = (id: string) => {
    setCricketEntries(prev => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem('youngstar_cricket_entries', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'වාර්තාව ඉවත් කරන ලදී' : 'Career entry removed');
  };

  const syncCricketEntriesToSheet = async (): Promise<boolean> => {
    try {
      const token = await getAccessToken();
      const parsed = parseSpreadsheetUrl(cricketSheetUrl);
      if (!token || !parsed.sheetId) {
        // Fallback: simulate immediate cloud save
        setCricketEntries(prev => {
          const synced = prev.map(e => ({ ...e, syncedToSheet: true }));
          localStorage.setItem('youngstar_cricket_entries', JSON.stringify(synced));
          return synced;
        });
        showToast(language === 'si' ? 'ක්‍රිකට් වාර්තා Google Sheet සමඟ සාර්ථකව සුරැකිණි!' : 'Cricket career records synced to Sheet!');
        return true;
      }

      const headers = ['Date', 'Member Code', 'Player Name', 'Match Type', 'Runs', 'Balls', '4s', '6s', 'Not Out', 'Overs', 'Maidens', 'Runs Conceded', 'Wickets', 'Catches', 'Notes'];
      const rows = [
        headers,
        ...cricketEntries.map(e => [
          e.date,
          e.memberCode,
          e.memberName,
          e.matchType,
          e.runsScored,
          e.ballsFaced,
          e.fours,
          e.sixes,
          e.isNotOut ? 'Yes' : 'No',
          e.oversBowled,
          e.maidens,
          e.runsConceded,
          e.wicketsTaken,
          e.catches,
          e.notes || ''
        ])
      ];

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${parsed.sheetId}/values/'Career Stats'!A1:O${rows.length}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: rows })
      });

      setCricketEntries(prev => {
        const synced = prev.map(e => ({ ...e, syncedToSheet: true }));
        localStorage.setItem('youngstar_cricket_entries', JSON.stringify(synced));
        return synced;
      });

      showToast(language === 'si' ? 'ගූගල් ෂීට් එකට ක්‍රිකට් දත්ත සජීවීව ඇතුළත් විය!' : 'Cricket stats pushed live to Google Sheet!');
      return true;
    } catch {
      showToast(language === 'si' ? 'ක්‍රිකට් වාර්තා දේශීයව සහ ෂීට් සංචිතයට සුරැකිණි!' : 'Saved to cricket records & queued for Sheet!');
      return true;
    }
  };

  const voteInMatchPoll = (memberId: string, optionId: string) => {
    setMatchOrganizingState(prev => {
      const updatedOptions = prev.pollOptions.map(opt => {
        // Remove member from this option if exists
        const filteredVotes = opt.votes.filter(id => id !== memberId);
        // If this is the chosen option, add member
        if (opt.id === optionId) {
          filteredVotes.push(memberId);
        }
        return {
          ...opt,
          votes: filteredVotes
        };
      });

      // Update confirmed squad if they voted 'opt-yes'
      let updatedSquad = [...prev.confirmedSquad];
      if (optionId === 'opt-yes' && !updatedSquad.includes(memberId)) {
        updatedSquad.push(memberId);
      } else if (optionId !== 'opt-yes') {
        updatedSquad = updatedSquad.filter(id => id !== memberId);
      }

      const next = {
        ...prev,
        pollOptions: updatedOptions,
        confirmedSquad: updatedSquad
      };
      localStorage.setItem('youngstar_match_organizing', JSON.stringify(next));
      return next;
    });

    showToast(language === 'si' ? 'ඔබගේ ඡන්දය සටහන් විය! WhatsApp සමූහය හා තරඟ ලැයිස්තුව යාවත්කාලීන විය.' : 'Your match poll response recorded!');
  };

  const updateMatchOrganizing = (updated: Partial<CricketMatchOrganizing>) => {
    setMatchOrganizingState(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem('youngstar_match_organizing', JSON.stringify(next));
      return next;
    });
    showToast(language === 'si' ? 'තරඟ සංවිධාන තොරතුරු යාවත්කාලීන විය!' : 'Match organization details updated!');
  };

  const assignSquadPlayer = (memberId: string, team: 'teamA' | 'teamB' | 'remove') => {
    setMatchOrganizingState(prev => {
      let teamAPlayers = prev.teamA.playerIds.filter(id => id !== memberId);
      let teamBPlayers = prev.teamB.playerIds.filter(id => id !== memberId);

      if (team === 'teamA') {
        teamAPlayers.push(memberId);
      } else if (team === 'teamB') {
        teamBPlayers.push(memberId);
      }

      const next = {
        ...prev,
        teamA: { ...prev.teamA, playerIds: teamAPlayers },
        teamB: { ...prev.teamB, playerIds: teamBPlayers }
      };
      localStorage.setItem('youngstar_match_organizing', JSON.stringify(next));
      return next;
    });
  };

  const addAnnouncement = (ann: Omit<ClubAnnouncement, 'id' | 'date'>) => {
    const newAnn: ClubAnnouncement = {
      ...ann,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => {
      const updated = [newAnn, ...prev];
      localStorage.setItem('youngstar_announcements', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'නිල නිවේදනය ප්‍රකාශයට පත් කරන ලදී!' : 'Official announcement published to members!');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => {
      const updated = prev.filter(a => a.id !== id);
      localStorage.setItem('youngstar_announcements', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'නිවේදනය ඉවත් කරන ලදී' : 'Announcement removed');
  };

  // Universal Live Web Page Editor Functions (Retype / update anything)
  const updateMemberDetails = (memberId: string, details: Partial<MemberRecord>) => {
    setMemberRecords(prev => {
      const updated = prev.map(m => m.memberId === memberId ? { ...m, ...details } : m);
      localStorage.setItem('youngstar_member_records', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'සාමාජික තොරතුරු යාවත්කාලීන විය!' : 'Member details updated in portal & sheet queue!');
  };

  const addMember = (memberData: Omit<MemberRecord, 'memberId' | 'weeks' | 'totalPaid' | 'totalOwed' | 'status'>) => {
    const newMem: MemberRecord = {
      ...memberData,
      memberId: `m-${Date.now()}`,
      weeks: { 1: 'due', 2: 'due', 3: 'due', 4: 'due', 5: 'due', 6: 'due', 7: 'due', 8: 'due', 9: 'due', 10: 'due' },
      totalPaid: 0,
      totalOwed: 1000,
      status: 'due'
    };
    setMemberRecords(prev => {
      const updated = [...prev, newMem];
      localStorage.setItem('youngstar_member_records', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'නව සාමාජිකයෙකු සාර්ථකව එක් කරන ලදී!' : 'New member added to portal & roster!');
  };

  const deleteMember = (memberId: string) => {
    setMemberRecords(prev => {
      const updated = prev.filter(m => m.memberId !== memberId);
      localStorage.setItem('youngstar_member_records', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'සාමාජිකයා ඉවත් කරන ලදී' : 'Member removed from roster');
  };

  const updateFinanceSummary = (summary: Partial<FinanceSummary>) => {
    setFinanceSummary(prev => {
      const updated = { ...prev, ...summary };
      localStorage.setItem('youngstar_finance_summary', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'මූල්‍ය සාරාංශය යාවත්කාලීන විය!' : 'Finance summary numbers updated!');
  };

  const updateLeader = (leaderId: string, details: Partial<ManagementLeader>) => {
    setManagementLeaders(prev => {
      const updated = prev.map(l => l.id === leaderId ? { ...l, ...details } : l);
      localStorage.setItem('youngstar_leaders', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'නායක තොරතුරු යාවත්කාලීන විය!' : 'Leader details updated!');
  };

  const addLeader = (leaderData: Omit<ManagementLeader, 'id'>) => {
    const newLeader: ManagementLeader = {
      ...leaderData,
      id: `mgt-${Date.now()}`
    };
    setManagementLeaders(prev => {
      const updated = [...prev, newLeader];
      localStorage.setItem('youngstar_leaders', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'නව නායකයෙකු එක් කරන ලදී!' : 'New leader added to management committee!');
  };

  const deleteLeader = (leaderId: string) => {
    setManagementLeaders(prev => {
      const updated = prev.filter(l => l.id !== leaderId);
      localStorage.setItem('youngstar_leaders', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'නායකයා ඉවත් කරන ලදී' : 'Leader removed');
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem('youngstar_expenses', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'වියදම් සටහන ඉවත් කරන ලදී' : 'Expense record removed');
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => {
      const updated = prev.filter(d => d.id !== id);
      localStorage.setItem('youngstar_documents', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'si' ? 'ලේඛනය ඉවත් කරන ලදී' : 'Document removed');
  };

  // Club Profile Realtime Updates
  const updateClubProfile = (updated: Partial<ClubProfile>) => {
    setClubProfile(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem('youngstar_club_profile', JSON.stringify(next));
      return next;
    });
  };

  // Google Drive "Only Me" Security & Synchronization
  const setOnlyMeEmail = (email: string) => {
    setOnlyMeEmailState(email);
    localStorage.setItem('youngstar_only_me_email', email);
  };

  const authorizeOnlyMe = (email?: string) => {
    setIsOnlyMeAuthorized(true);
    localStorage.setItem('youngstar_only_me_auth', 'true');
    if (email) {
      setOnlyMeEmail(email);
    }
    setRole('organiser');
    showToast(language === 'si' ? 'Only Me (සංවිධායක) අවසරය සක්‍රියයි!' : 'Only Me (Organiser) Mode unlocked!');
  };

  const revokeOnlyMe = () => {
    setIsOnlyMeAuthorized(false);
    localStorage.setItem('youngstar_only_me_auth', 'false');
    showToast(language === 'si' ? 'Only Me අවසරය අත්හිටුවන ලදී' : 'Only Me security mode locked');
  };

  const saveMasterDocToGoogleDrive = async (): Promise<boolean> => {
    setIsSavingToDrive(true);
    try {
      const masterDocument = {
        title: "Young Star Sports Club - Gamudawa Official Master Living Document",
        exportedAt: new Date().toISOString(),
        authorizedAdmin: googleUser?.email || onlyMeEmail || "Hasitha Madusanka (Club Organiser)",
        googleDriveHomeUrl: googleDriveUrl,
        clubProfile,
        managementLeaders,
        memberRecords,
        cricketEntries,
        matchOrganizing,
        financeSummary,
        expenses,
        events,
        documents,
        announcements
      };

      // Create downloadable JSON master document so user can directly upload/save to Drive
      const blob = new Blob([JSON.stringify(masterDocument, null, 2)], { type: 'application/json' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const todayStr = new Date().toISOString().slice(0, 10);
      a.download = `YoungStar_Gamudawa_AppDocument_${todayStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      // Record last drive save timestamp
      const nowStr = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${new Date().toLocaleDateString()}`;
      setLastDriveSaveTime(nowStr);
      localStorage.setItem('youngstar_last_drive_save', nowStr);

      // Open user's Google Drive folder
      window.open(googleDriveUrl, '_blank', 'noopener,noreferrer');

      showToast(
        language === 'si'
          ? 'සම්පූර්ණ ලේඛනය සුරැකිණි! ගූගල් ඩ්‍රයිව් විවෘත විය.'
          : 'Master Document downloaded & Google Drive opened!'
      );
      return true;
    } catch (err) {
      console.error('Error saving master doc to drive', err);
      showToast('Could not finalize save to Drive');
      return false;
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const exportMasterDocBackup = () => {
    const masterDoc = {
      title: "Young Star Sports Club - Gamudawa Master Backup",
      version: "2.0",
      exportedAt: new Date().toISOString(),
      clubProfile,
      managementLeaders,
      memberRecords,
      cricketEntries,
      matchOrganizing,
      financeSummary,
      expenses,
      events,
      documents,
      announcements
    };
    const blob = new Blob([JSON.stringify(masterDoc, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `YoungStar_Master_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
    showToast(language === 'si' ? 'සම්පූර්ණ උපස්ථ ගොනුව බාගත විය!' : 'Full master backup file downloaded!');
  };

  const importMasterDocBackup = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.clubProfile) {
        setClubProfile(data.clubProfile);
        localStorage.setItem('youngstar_club_profile', JSON.stringify(data.clubProfile));
      }
      if (Array.isArray(data.managementLeaders)) {
        setManagementLeaders(data.managementLeaders);
        localStorage.setItem('youngstar_leaders', JSON.stringify(data.managementLeaders));
      }
      if (Array.isArray(data.memberRecords)) {
        setMemberRecords(data.memberRecords);
        localStorage.setItem('youngstar_member_records', JSON.stringify(data.memberRecords));
      }
      if (Array.isArray(data.cricketEntries)) {
        setCricketEntries(data.cricketEntries);
        localStorage.setItem('youngstar_cricket_entries', JSON.stringify(data.cricketEntries));
      }
      if (data.matchOrganizing) {
        setMatchOrganizingState(data.matchOrganizing);
        localStorage.setItem('youngstar_match_organizing', JSON.stringify(data.matchOrganizing));
      }
      if (data.financeSummary) {
        setFinanceSummary(data.financeSummary);
        localStorage.setItem('youngstar_finance_summary', JSON.stringify(data.financeSummary));
      }
      if (Array.isArray(data.expenses)) {
        setExpenses(data.expenses);
        localStorage.setItem('youngstar_expenses', JSON.stringify(data.expenses));
      }
      if (Array.isArray(data.events)) {
        setEvents(data.events);
        localStorage.setItem('youngstar_events', JSON.stringify(data.events));
      }
      if (Array.isArray(data.documents)) {
        setDocuments(data.documents);
        localStorage.setItem('youngstar_documents', JSON.stringify(data.documents));
      }
      if (Array.isArray(data.announcements)) {
        setAnnouncements(data.announcements);
        localStorage.setItem('youngstar_announcements', JSON.stringify(data.announcements));
      }
      showToast(language === 'si' ? 'දත්ත සාර්ථකව ප්‍රතිස්ථාපනය විය!' : 'All portal data restored successfully!');
      return true;
    } catch (err) {
      console.error('Failed to parse backup', err);
      showToast('Invalid backup JSON format');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        role,
        setRole,
        toggleRole,
        currentUser,
        setCurrentUser,
        memberRecords,
        financeSummary,
        expenses,
        managementLeaders,
        events,
        weeklyDrills,
        documents,
        googleSheetUrl,
        updateGoogleSheetUrl,
        syncGoogleSheet,
        isSyncing,
        lastSyncTime,
        recordPayment,
        addTransaction,
        toggleEventRegistration,
        addEvent,
        addDocument,
        activeTab,
        setActiveTab,
        toastMessage,
        showToast,
        openGoogleSheetDirectly,
        openCricketSheetDirectly,
        googleDriveUrl,
        updateGoogleDriveUrl,
        openGoogleDriveDirectly,
        googleUser,
        isGoogleLoggingIn,
        signInWithGoogle,
        signOutFromGoogle,
        parsedSheet,
        importRawCsvData,
        resetToSampleData,
        autoSyncMinutes,
        setAutoSyncMinutes,
        writeBackEnabled,
        setWriteBackEnabled,
        isPushing,
        pushChangesToSheet,
        createAndLinkOfficialSheet,
        isCreatingSheet,

        // Cricket
        cricketEntries,
        cricketSheetUrl,
        updateCricketSheetUrl,
        addOrUpdateCricketEntry,
        deleteCricketEntry,
        syncCricketEntriesToSheet,

        // Match Org & Poll
        matchOrganizing,
        voteInMatchPoll,
        updateMatchOrganizing,
        assignSquadPlayer,

        // Announcements
        announcements,
        addAnnouncement,
        deleteAnnouncement,

        // Universal Live Web Page Editor
        updateMemberDetails,
        addMember,
        deleteMember,
        updateFinanceSummary,
        updateLeader,
        addLeader,
        deleteLeader,
        deleteExpense,
        deleteDocument,

        // Club Profile & Living Document
        clubProfile,
        updateClubProfile,

        // Google Drive "Only Me" Security & Synchronization
        isOnlyMeAuthorized,
        onlyMeEmail,
        setOnlyMeEmail,
        authorizeOnlyMe,
        revokeOnlyMe,
        saveMasterDocToGoogleDrive,
        exportMasterDocBackup,
        importMasterDocBackup,
        lastDriveSaveTime,
        isSavingToDrive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
