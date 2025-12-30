export enum Position {
  GK = 'GK',
  DEF = 'DEF',
  MID = 'MID',
  FWD = 'FWD'
}

export type Language = 'EN' | 'TR' | 'ES' | 'DE' | 'FR' | 'IT';

export interface PlayerHistory {
  match: number;
  rating: number;
  fitness: number;
  morale: number;
}

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface PlayerContract {
  salary: number; // Weekly
  expiresIn: number; // Weeks/Matches remaining
  releaseClause?: number;
}

export interface PlayerStatus {
  isInjured: boolean;
  injuryType?: string;
  weeksOut?: number;
  isSuspended: boolean;
  cards: {
    yellow: number;
    red: number;
  };
}

export interface PlayerSeasonStats {
    apps: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    mom: number; // Man of Match awards
    avgRating: number;
}

export type PlayerTrainingFocus = 'Balanced' | 'Pace' | 'Shooting' | 'Passing' | 'Defending' | 'Physical' | 'Recovery';

export interface Player {
  id: string;
  name: string;
  nationality: string;
  position: Position;
  rating: number; // Overall 1-100
  attributes: PlayerAttributes;
  potential: number; // 1-100
  age: number;
  fitness: number; // 0-100
  morale: number; // 0-100
  bio?: string;
  contract: PlayerContract;
  status: PlayerStatus;
  history: PlayerHistory[];
  seasonStats: PlayerSeasonStats;
  instruction?: string; // e.g., 'Cut Inside', 'Stay Back'
  marketValue?: number; // Estimated value
  isListed?: boolean; // If true, available for transfer
  individualTraining?: PlayerTrainingFocus;
}

export type ManagerPersonality = 'Pragmatic' | 'Idealist' | 'Ruthless' | 'Developer';
export type TacticalStyle = 'Possession' | 'Counter' | 'Park the Bus' | 'High Press' | 'Balanced';

export interface ManagerStats {
    matchesManaged: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    trophies: number;
}

export interface ManagerHistoryItem {
    year: number;
    teamName: string;
    leaguePosition: number;
    achievements: string[];
}

export interface ManagerSkill {
    id: string;
    name: string;
    level: number;
    maxLevel: number;
    description: string;
}

export interface JobOffer {
    id: string;
    teamId: string;
    teamName: string;
    leaguePosition: number;
    wageBudget: number;
    transferBudget: number;
    contractOffer: number; // Personal salary
    reputation: number;
}

export interface Manager {
  name: string;
  age: number;
  nationality: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  reputation: number; // 0-100
  avatarUrl: string; // URL or placeholder string
  personality?: ManagerPersonality;
  tacticalStyle?: TacticalStyle;
  stats: ManagerStats;
  history: ManagerHistoryItem[];
  skills: ManagerSkill[];
  skillPoints: number;
}

export interface LeagueStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface ClubRecord {
    id: string;
    description: string;
    value: string | number;
    holderName: string;
    year: number;
}

export interface ClubDetails {
  stadium: string;
  capacity: number;
  country: string;
  foundedYear: number;
  reputation: number; // 0-100
  fanBase: number;
}

export type TransactionType = 'Transfer Fee' | 'Wages' | 'Sponsorship' | 'Match Revenue' | 'Prize Money' | 'Facilities' | 'Staff Costs';

export interface FinancialTransaction {
    id: string;
    gameweek: number;
    type: TransactionType;
    amount: number; // Positive for income, negative for expense
    description: string;
}

export interface Sponsor {
    id: string;
    name: string;
    industry: string; // e.g., "Tech", "Airline"
    dealType: 'Shirt' | 'Stadium' | 'Kit' | 'Partner';
    amountPerSeason: number;
    duration: number; // Years/Seasons
    isActive: boolean;
}

export interface ClubFacilities {
    stadiumLevel: number; // 1-10
    trainingLevel: number; // 1-10
    youthLevel: number; // 1-10
    medicalLevel: number; // 1-10
    scoutingLevel: number; // 1-10
}

export interface Finances {
  balance: number;
  transferBudget: number;
  wageBudget: number; // Weekly
  transactions: FinancialTransaction[];
  sponsors: Sponsor[];
  ffpStatus: 'Compliant' | 'At Risk' | 'Breach';
  ytdProfitLoss: number;
}

export interface BoardObjective {
  id: string;
  type: 'League' | 'Cup' | 'Financial' | 'Development';
  description: string;
  target: string;
  status: 'On Track' | 'At Risk' | 'Failed' | 'Completed';
  priority: 'Critical' | 'High' | 'Medium';
}

export interface SetPieceTakers {
  penalty: string | null; // Player ID
  freeKick: string | null;
  corner: string | null;
  captain: string | null;
}

export interface TeamTactics {
  formation: string;
  mentality: 'Defensive' | 'Balanced' | 'Attacking'; 
  passingStyle: 'Short' | 'Direct' | 'Mixed';
  pressingIntensity: number; // 0-100 (Low to High)
  defensiveLine: number; // 0-100 (Deep to High)
  width: number; // 0-100 (Narrow to Wide)
  setPieces: SetPieceTakers;
  customPositions?: Record<string, { x: number, y: number }>; // Map of PlayerID to {x,y} percentages
}

export type TeamTrainingFocus = 'Balanced' | 'Attack' | 'Defense' | 'Possession' | 'Physical' | 'Technical';
export type TrainingIntensity = 'Light' | 'Normal' | 'Heavy';

export type StaffRole = 'Assistant Manager' | 'Coach' | 'Scout' | 'Physio';

export interface StaffMember {
    id: string;
    name: string;
    role: StaffRole;
    rating: number; // 1-5 stars
    age: number;
    nationality: string;
    salary: number; // Weekly
    specialty: string; // "Attack", "South America", "Muscle Injuries"
}

export interface TeamTrainingState {
    currentFocus: TeamTrainingFocus;
    intensity: TrainingIntensity;
}

export interface Team {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  manager?: Manager; // AI Manager
  players: Player[];
  staff: StaffMember[];
  stats?: LeagueStats;
  clubDetails?: ClubDetails;
  records?: ClubRecord[];
  finances?: Finances;
  facilities: ClubFacilities;
  boardObjectives?: BoardObjective[];
  tactics: TeamTactics;
  training?: TeamTrainingState;
}

export interface MatchEvent {
  minute: number;
  description: string;
  type: 'GOAL' | 'MISS' | 'CARD' | 'SUB' | 'COMMENTARY' | 'WHISTLE' | 'INJURY' | 'TACTICS';
  teamId?: string; // If relevant to a specific team
  scorer?: string;
  secondaryPlayer?: string; // Assist or card recipient
}

export interface MatchStatistics {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  xg: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
}

export interface MatchState {
  isPlaying: boolean;
  isFinished: boolean;
  isHalfTime: boolean;
  minute: number;
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  homeTeam: Team;
  awayTeam: Team;
  homeStats: MatchStatistics;
  awayStats: MatchStatistics;
  ballPosition: { x: number; y: number }; // 0-100
  sidesSwapped: boolean; // true if 2nd half
  possessionSide: 'home' | 'away' | null;
}

export interface PitchEntity {
  id: string;
  x: number;
  y: number;
  baseX: number; // Formation home X
  baseY: number; // Formation home Y
  targetX: number;
  targetY: number;
  color: string;
  side: 'home' | 'away';
  role: 'GK' | 'DEF' | 'MID' | 'FWD';
  number: number;
  name: string;
}

export type Region = 'Europe' | 'South America' | 'Asia' | 'Africa' | 'North America';

export interface Scout {
    id: string;
    name: string;
    region: Region;
    expertise: number; // 1-5 stars
    isBusy: boolean;
}

export interface Fixture {
    id: string;
    gameweek: number;
    homeTeamId: string;
    awayTeamId: string;
    homeScore?: number;
    awayScore?: number;
    isPlayed: boolean;
    competition: 'League' | 'Cup';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SQUAD = 'SQUAD',
  TACTICS = 'TACTICS',
  MATCH = 'MATCH',
  TRANSFERS = 'TRANSFERS',
  SCOUTING = 'SCOUTING',
  TRAINING = 'TRAINING',
  FINANCES = 'FINANCES',
  FACILITIES = 'FACILITIES',
  CAREER = 'CAREER',
  STATS = 'STATS',
  COMPETITIONS = 'COMPETITIONS',
  PROFILE = 'PROFILE'
}