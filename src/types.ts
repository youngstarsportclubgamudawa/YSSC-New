export interface MemberRecord {
  memberId: string;
  memberCode: string;
  name: string;
  nameSinhala: string;
  phone: string;
  category: 'Senior' | 'Junior' | 'Honorary';
  categorySinhala: string;
  weeks: Record<number, 'paid' | 'due'>;
  totalPaid: number;
  totalOwed: number;
  status: 'good' | 'due' | 'overdue';
  lastPaymentDate?: string;
  lastPaymentMethod?: string;
  rawRow?: Record<string, string>;
  // Cricket career details
  playerRole?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  careerMatches?: number;
  careerRuns?: number;
  careerHighScore?: number;
  career50s?: number;
  career100s?: number;
  careerWickets?: number;
  bestBowling?: string;
  careerEconomy?: number;
}

export interface ClubProfile {
  name: string;
  nameSinhala: string;
  establishedYear: string;
  village: string;
  motto: string;
  mottoSinhala: string;
  groundAddress: string;
  groundAddressSinhala: string;
  phone: string;
  email: string;
  whatsappGroupLink: string;
  vision: string;
  visionSinhala: string;
  missionList: string[];
  missionListSinhala: string[];
  googleDriveUrl: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  expenseDetails: string;
  amount: number;
  category: string;
  receiptNumber: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  weeklyDuesCollected: number;
  weeklyDuesPending: number;
  currency: string;
  weeklyFee: number;
  lastSyncTime: string;
}

export interface ManagementLeader {
  id: string;
  name: string;
  nameSinhala: string;
  designation: string;
  designationSinhala?: string;
  phone?: string;
  category: 'executive' | 'coaching' | 'captains';
  badge?: string;
  badgeSinhala?: string;
  term?: string;
  bio?: string;
  bioSinhala?: string;
  photoUrl?: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  titleSinhala: string;
  description: string;
  descriptionSinhala: string;
  sportCategory: string;
  date: string;
  time: string;
  location: string;
  locationSinhala: string;
  coach: string;
  maxParticipants: number;
  registeredMembers: string[];
  badge: string;
  badgeSinhala: string;
}

export interface WeeklyDrill {
  id: string;
  day: string;
  daySinhala: string;
  session: string;
  sessionSinhala: string;
  time: string;
  coach: string;
  targetGroup: string;
  targetGroupSinhala: string;
}

export interface ClubDoc {
  id: string;
  title: string;
  titleSinhala: string;
  category: 'policies' | 'financial' | 'minutes' | 'fixtures' | 'forms';
  fileType: 'pdf' | 'sheet' | 'doc';
  size: string;
  updatedDate: string;
  driveUrl: string;
  uploadedBy: string;
  description: string;
  descriptionSinhala: string;
}

export interface ParsedSheetData {
  sheetId: string;
  gid: string;
  sourceUrl: string;
  headers: string[];
  rawRows: string[][];
  members: MemberRecord[];
  expenses: ExpenseRecord[];
  totalCollected: number;
  totalExpenses: number;
  netBalance: number;
  totalPending: number;
  memberCount: number;
  syncedAt: string;
}

// Daily Cricket Career Performance Entry
export interface DailyCricketEntry {
  id: string;
  date: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  matchType: 'Daily Practice' | 'Club Match' | 'Tournament' | 'Friendly';
  runsScored: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  isNotOut: boolean;
  oversBowled: number;
  maidens: number;
  runsConceded: number;
  wicketsTaken: number;
  catches: number;
  stumpings: number;
  notes?: string;
  syncedToSheet?: boolean;
}

// Cricket Match Organization & WhatsApp-Style Poll
export interface CricketMatchPollOption {
  id: string;
  label: string;
  labelSinhala: string;
  votes: string[]; // memberIds who voted for this option
}

export interface CricketMatchOrganizing {
  id: string;
  title: string;
  titleSinhala: string;
  matchDate: string;
  matchTime: string;
  venue: string;
  venueSinhala: string;
  opponentTeam: string;
  overs: number;
  format: 'T20' | '10-Over' | 'One Day' | 'Box Cricket';
  entryFeePerPlayer: number;
  kitDressCode: string;
  pollQuestion: string;
  pollQuestionSinhala: string;
  pollOptions: CricketMatchPollOption[];
  confirmedSquad: string[]; // memberIds
  teamA: {
    name: string;
    captainId?: string;
    playerIds: string[];
  };
  teamB: {
    name: string;
    captainId?: string;
    playerIds: string[];
  };
  status: 'planning' | 'voting' | 'squad_announced' | 'completed';
}

// Club Official Announcement
export interface ClubAnnouncement {
  id: string;
  title: string;
  titleSinhala: string;
  content: string;
  contentSinhala: string;
  priority: 'urgent' | 'normal' | 'info';
  date: string;
  author: string;
  targetGroup: string;
}

