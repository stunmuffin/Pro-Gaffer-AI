import { Team, Position, Manager } from "./types";

export const FORMATIONS: Record<string, {x: number, y: number}[]> = {
    '4-3-3': [
        {x: 50, y: 88}, // GK
        {x: 15, y: 72}, {x: 38, y: 75}, {x: 62, y: 75}, {x: 85, y: 72}, // DEF
        {x: 50, y: 58}, // CDM
        {x: 35, y: 45}, {x: 65, y: 45}, // CM
        {x: 15, y: 25}, {x: 50, y: 18}, {x: 85, y: 25} // FWD
    ],
    '4-4-2': [
        {x: 50, y: 88},
        {x: 15, y: 72}, {x: 38, y: 75}, {x: 62, y: 75}, {x: 85, y: 72},
        {x: 15, y: 45}, {x: 38, y: 45}, {x: 62, y: 45}, {x: 85, y: 45},
        {x: 35, y: 20}, {x: 65, y: 20}
    ],
    '4-2-3-1': [
        {x: 50, y: 88},
        {x: 15, y: 72}, {x: 38, y: 75}, {x: 62, y: 75}, {x: 85, y: 72},
        {x: 40, y: 60}, {x: 60, y: 60},
        {x: 20, y: 35}, {x: 50, y: 38}, {x: 80, y: 35},
        {x: 50, y: 15}
    ],
    '5-4-1': [
        {x: 50, y: 88},
        {x: 10, y: 72}, {x: 30, y: 75}, {x: 50, y: 75}, {x: 70, y: 75}, {x: 90, y: 72},
        {x: 20, y: 50}, {x: 40, y: 50}, {x: 60, y: 50}, {x: 80, y: 50},
        {x: 50, y: 25}
    ]
};

export const COMMENTARY_TEMPLATES = {
    EN: {
        goal: [
            "GOAL! {player} smashes it home for {team}!",
            "It's in! {player} finishes a beautiful move.",
            "GOAL! The stadium erupts as {player} finds the net!",
            "Unstoppable! {player} fires it past the keeper.",
            "{team} take the lead thanks to {player}!"
        ],
        miss: [
            "{player} shoots wide! A wasted opportunity for {team}.",
            "Great save! {player} denied.",
            "{player} hits the post! So close for {team}.",
            "The shot from {player} goes over the bar."
        ],
        possession: [
            "{team} are controlling the tempo nicely.",
            "Good spell of possession for {team}.",
            "Midfield battle intensifying as {team} press high."
        ]
    },
    TR: {
        goal: [
            "GOL! {player} topu ağlara gönderiyor!",
            "Muhteşem bir gol! {player} affetmedi.",
            "GOL GOL GOL! {player} sahnede!",
            "{player} kaleciyi çaresiz bıraktı.",
            "{team} öne geçiyor!"
        ],
        miss: [
            "{player} dışarı vurdu! İnanılmaz.",
            "Kaleci kurtardı! {player} üzgün.",
            "Direkten döndü! Şanssızlık.",
            "{player} çerçeveyi bulamadı."
        ],
        possession: [
            "{team} oyunu kontrol ediyor.",
            "Orta alanda büyük mücadele var.",
            "{team} baskıyı arttırdı."
        ]
    },
    ES: {
        goal: [
            "¡GOLAZO! ¡{player} marca para {team}!",
            "¡Al fondo de la red! {player} no perdona.",
            "¡GOOOL! ¡Qué definición de {player}!",
            "{team} se adelanta con este tanto de {player}."
        ],
        miss: [
            "¡Fuera! {player} desperdicia la ocasión.",
            "¡Paradón del portero a tiro de {player}!",
            "¡Al palo! {player} casi marca.",
            "El disparo de {player} se va alto."
        ],
        possession: [
            "{team} domina la posesión.",
            "Buen movimiento de balón de {team}.",
            "Lucha intensa en el medio campo."
        ]
    },
    DE: {
        goal: [
            "TOR! {player} trifft für {team}!",
            "Drin ist er! {player} mit dem Abschluss.",
            "Was für ein Tor von {player}!",
            "{team} geht in Führung durch {player}."
        ],
        miss: [
            "{player} schießt daneben! Chance vertan.",
            "Gehalten! {player} scheitert am Torwart.",
            "Pfosten! Pech für {player}.",
            "Der Schuss von {player} geht drüber."
        ],
        possession: [
            "{team} kontrolliert das Spiel.",
            "Gute Ballbesitzphase für {team}.",
            "Hartes Duell im Mittelfeld."
        ]
    },
    FR: {
        goal: [
            "BUT! {player} marque pour {team}!",
            "C'est au fond! {player} ne tremble pas.",
            "Quel but de {player}!",
            "{team} prend l'avantage grâce à {player}."
        ],
        miss: [
            "{player} tire à côté! Quel dommage.",
            "Arrêt du gardien devant {player}!",
            "Poteau! {player} manque de chance.",
            "La frappe de {player} s'envole."
        ],
        possession: [
            "{team} maîtrise le ballon.",
            "Bonne séquence de possession pour {team}.",
            "Bataille au milieu de terrain."
        ]
    },
    IT: {
        goal: [
            "GOL! {player} segna per {team}!",
            "Rete! {player} non sbaglia.",
            "Che gol di {player}!",
            "{team} in vantaggio con {player}."
        ],
        miss: [
            "{player} tira fuori! Occasione sprecata.",
            "Parata! {player} fermato dal portiere.",
            "Palo! {player} sfortunato.",
            "Il tiro di {player} finisce alto."
        ],
        possession: [
            "{team} controlla il gioco.",
            "Buon possesso palla per {team}.",
            "Battaglia a centrocampo."
        ]
    }
};

export const TRANSLATIONS = {
    EN: {
        dashboard: 'Home',
        squad: 'Squad',
        tactics: 'Tactics',
        training: 'Training',
        transfers: 'Scouting',
        scouting: 'Scouting',
        finances: 'Finances',
        facilities: 'Club Info',
        stats: 'Data Hub',
        competitions: 'Schedule',
        matchCenter: 'Match Day',
        career: 'My Job',
        profile: 'Profile',
        saveGame: 'Save Game',
        loadGame: 'Load Game',
        nextMatch: 'Play Match',
        resumeMatch: 'Resume',
        matchFinished: 'Full Time',
        startSecondHalf: 'Start 2nd Half',
        startGame: 'New Career',
        managerProfile: 'Manager Profile',
        selectLeague: 'Select League',
        selectClub: 'Select Club',
        welcome: 'Welcome',
        back: 'Back',
        next: 'Continue',
        enterName: 'Enter Name',
        tacticalPhilosophy: 'Philosophy',
        identity: 'Identity',
        compArea: 'Competition',
        newHome: 'Your Club',
        saveSuccess: 'Game Saved',
        loadSuccess: 'Game Loaded',
        inbox: 'Inbox',
        news: 'News',
        upcoming: 'Schedule',
        standings: 'Table',
        teamReport: 'Team Report'
    },
    TR: {
        dashboard: 'Ana Sayfa',
        squad: 'Kadro',
        tactics: 'Taktik',
        training: 'Antrenman',
        transfers: 'Gözlemcilik',
        scouting: 'Gözlemcilik',
        finances: 'Mali Durum',
        facilities: 'Kulüp Bilgisi',
        stats: 'Veri Merkezi',
        competitions: 'Fikstür',
        matchCenter: 'Maç Günü',
        career: 'Kariyer',
        profile: 'Profil',
        saveGame: 'Kaydet',
        loadGame: 'Yükle',
        nextMatch: 'Maça Git',
        resumeMatch: 'Devam Et',
        matchFinished: 'Maç Sonu',
        startSecondHalf: '2. Yarı',
        startGame: 'Yeni Kariyer',
        managerProfile: 'Menajer',
        selectLeague: 'Lig Seç',
        selectClub: 'Takım Seç',
        welcome: 'Hoşgeldin',
        back: 'Geri',
        next: 'Devam',
        enterName: 'İsim Girin',
        tacticalPhilosophy: 'Felsefe',
        identity: 'Kimlik',
        compArea: 'Turnuva',
        newHome: 'Kulübün',
        saveSuccess: 'Kaydedildi',
        loadSuccess: 'Yüklendi',
        inbox: 'Gelen Kutusu',
        news: 'Haberler',
        upcoming: 'Fikstür',
        standings: 'Puan Durumu',
        teamReport: 'Takım Raporu'
    },
    ES: {
        dashboard: 'Inicio',
        squad: 'Plantilla',
        tactics: 'Tácticas',
        training: 'Entreno',
        transfers: 'Ojeo',
        scouting: 'Ojeo',
        finances: 'Economía',
        facilities: 'Club',
        stats: 'Datos',
        competitions: 'Calendario',
        matchCenter: 'Partido',
        career: 'Mi Trabajo',
        profile: 'Perfil',
        saveGame: 'Guardar',
        loadGame: 'Cargar',
        nextMatch: 'Jugar',
        resumeMatch: 'Continuar',
        matchFinished: 'Final',
        startSecondHalf: '2ª Parte',
        startGame: 'Nueva Partida',
        managerProfile: 'Perfil Mánager',
        selectLeague: 'Elegir Liga',
        selectClub: 'Elegir Club',
        welcome: 'Bienvenido',
        back: 'Atrás',
        next: 'Continuar',
        enterName: 'Nombre',
        tacticalPhilosophy: 'Filosofía',
        identity: 'Identidad',
        compArea: 'Competición',
        newHome: 'Tu Club',
        saveSuccess: 'Guardado',
        loadSuccess: 'Cargado',
        inbox: 'Buzón',
        news: 'Noticias',
        upcoming: 'Calendario',
        standings: 'Clasificación',
        teamReport: 'Informe Equipo'
    },
    DE: {
        dashboard: 'Startseite',
        squad: 'Kader',
        tactics: 'Taktik',
        training: 'Training',
        transfers: 'Scouting',
        scouting: 'Scouting',
        finances: 'Finanzen',
        facilities: 'Verein',
        stats: 'Datenzentrale',
        competitions: 'Spielplan',
        matchCenter: 'Spieltag',
        career: 'Mein Job',
        profile: 'Profil',
        saveGame: 'Speichern',
        loadGame: 'Laden',
        nextMatch: 'Spielen',
        resumeMatch: 'Weiter',
        matchFinished: 'Spielende',
        startSecondHalf: '2. Halbzeit',
        startGame: 'Neues Spiel',
        managerProfile: 'Managerprofil',
        selectLeague: 'Liga wählen',
        selectClub: 'Verein wählen',
        welcome: 'Willkommen',
        back: 'Zurück',
        next: 'Weiter',
        enterName: 'Name eingeben',
        tacticalPhilosophy: 'Philosophie',
        identity: 'Identität',
        compArea: 'Wettbewerb',
        newHome: 'Dein Verein',
        saveSuccess: 'Gespeichert',
        loadSuccess: 'Geladen',
        inbox: 'Posteingang',
        news: 'Nachrichten',
        upcoming: 'Termine',
        standings: 'Tabelle',
        teamReport: 'Mannschaftsbericht'
    },
    FR: {
        dashboard: 'Accueil',
        squad: 'Effectif',
        tactics: 'Tactique',
        training: 'Entraînement',
        transfers: 'Recrutement',
        scouting: 'Recrutement',
        finances: 'Finances',
        facilities: 'Club',
        stats: 'Centre de données',
        competitions: 'Calendrier',
        matchCenter: 'Match',
        career: 'Mon Emploi',
        profile: 'Profil',
        saveGame: 'Sauvegarder',
        loadGame: 'Charger',
        nextMatch: 'Jouer',
        resumeMatch: 'Reprendre',
        matchFinished: 'Fin du match',
        startSecondHalf: '2ème mi-temps',
        startGame: 'Nouvelle Carrière',
        managerProfile: 'Profil Manager',
        selectLeague: 'Choisir Ligue',
        selectClub: 'Choisir Club',
        welcome: 'Bienvenue',
        back: 'Retour',
        next: 'Continuer',
        enterName: 'Entrer Nom',
        tacticalPhilosophy: 'Philosophie',
        identity: 'Identité',
        compArea: 'Compétition',
        newHome: 'Votre Club',
        saveSuccess: 'Sauvegardé',
        loadSuccess: 'Chargé',
        inbox: 'Boîte de réception',
        news: 'Actualités',
        upcoming: 'Calendrier',
        standings: 'Classement',
        teamReport: 'Rapport Équipe'
    },
    IT: {
        dashboard: 'Home',
        squad: 'Rosa',
        tactics: 'Tattiche',
        training: 'Allenamento',
        transfers: 'Osservatori',
        scouting: 'Osservatori',
        finances: 'Finanze',
        facilities: 'Club',
        stats: 'Dati',
        competitions: 'Calendario',
        matchCenter: 'Partita',
        career: 'Carriera',
        profile: 'Profilo',
        saveGame: 'Salva',
        loadGame: 'Carica',
        nextMatch: 'Gioca',
        resumeMatch: 'Riprendi',
        matchFinished: 'Fine Partita',
        startSecondHalf: '2° Tempo',
        startGame: 'Nuova Carriera',
        managerProfile: 'Profilo Manager',
        selectLeague: 'Scegli Lega',
        selectClub: 'Scegli Club',
        welcome: 'Benvenuto',
        back: 'Indietro',
        next: 'Avanti',
        enterName: 'Inserisci Nome',
        tacticalPhilosophy: 'Filosofia',
        identity: 'Identità',
        compArea: 'Competizione',
        newHome: 'Il Tuo Club',
        saveSuccess: 'Salvato',
        loadSuccess: 'Caricato',
        inbox: 'Posta in arrivo',
        news: 'Notizie',
        upcoming: 'Prossime',
        standings: 'Classifica',
        teamReport: 'Rapporto Squadra'
    }
};

export const STARTING_MANAGER: Manager = {
  name: 'Pep G',
  age: 52,
  nationality: 'Spain',
  level: 1,
  xp: 0,
  nextLevelXp: 1000,
  reputation: 25,
  skillPoints: 1,
  stats: {
      matchesManaged: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      trophies: 0
  },
  history: [],
  skills: [
      { id: 'negotiation', name: 'Silver Tongue', level: 1, maxLevel: 10, description: 'Reduces transfer fees by 2% per level.' },
      { id: 'training', name: 'Drill Sergeant', level: 1, maxLevel: 10, description: 'Increases training effectiveness by 2% per level.' },
      { id: 'motivation', name: 'Man Management', level: 1, maxLevel: 10, description: 'Reduces morale decay after losses.' },
      { id: 'tactics', name: 'Tactical Genius', level: 1, maxLevel: 10, description: 'Increases team understanding of formations.' }
  ],
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  personality: 'Idealist',
  tacticalStyle: 'Possession'
};

export const STARTING_TEAM: Team = {
  id: 'user-team',
  name: 'Gemini United',
  primaryColor: '#3b82f6', // blue-500
  secondaryColor: '#1e293b', // slate-800
  manager: STARTING_MANAGER,
  tactics: {
    formation: '4-3-3',
    mentality: 'Balanced',
    passingStyle: 'Short',
    pressingIntensity: 60,
    defensiveLine: 50,
    width: 50,
    setPieces: {
      penalty: null,
      freeKick: null,
      corner: null,
      captain: null
    }
  },
  training: {
    currentFocus: 'Balanced',
    intensity: 'Normal'
  },
  facilities: {
      stadiumLevel: 6, 
      trainingLevel: 4,
      youthLevel: 3,
      medicalLevel: 4,
      scoutingLevel: 3
  },
  staff: [],
  stats: { played: 0, won: 0, drawn: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0 },
  clubDetails: {
    stadium: 'The Neural Arena',
    capacity: 62500,
    country: 'United Kingdom',
    foundedYear: 2023,
    reputation: 85, 
    fanBase: 2500000
  },
  records: [],
  finances: {
    balance: 50000000,
    transferBudget: 20000000,
    wageBudget: 200000,
    ffpStatus: 'Compliant',
    ytdProfitLoss: 0,
    transactions: [],
    sponsors: []
  },
  boardObjectives: [],
  players: []
};

// --- REAL WORLD DATASETS ---

export interface LeagueData {
    id: string;
    name: string;
    country: string;
    teams: { name: string; primary: string; secondary: string; reputation: number }[];
}

export const REAL_WORLD_LEAGUES: LeagueData[] = [
    {
        id: 'epl',
        name: 'Premier League',
        country: 'England',
        teams: [
            { name: 'Arsenal', primary: '#EF0107', secondary: '#FFFFFF', reputation: 88 },
            { name: 'Man City', primary: '#6CABDD', secondary: '#1C2C5B', reputation: 92 },
            { name: 'Liverpool', primary: '#C8102E', secondary: '#00B2A9', reputation: 90 },
            { name: 'Man Utd', primary: '#DA291C', secondary: '#000000', reputation: 87 },
            { name: 'Chelsea', primary: '#034694', secondary: '#FFFFFF', reputation: 85 },
            { name: 'Tottenham', primary: '#FFFFFF', secondary: '#132257', reputation: 84 },
            { name: 'Newcastle', primary: '#241F20', secondary: '#FFFFFF', reputation: 82 },
            { name: 'Aston Villa', primary: '#95BFE5', secondary: '#670E36', reputation: 80 }
        ]
    },
    {
        id: 'laliga',
        name: 'La Liga',
        country: 'Spain',
        teams: [
            { name: 'Real Madrid', primary: '#FEBE10', secondary: '#FFFFFF', reputation: 93 },
            { name: 'Barcelona', primary: '#A50044', secondary: '#004D98', reputation: 91 },
            { name: 'Atlético Madrid', primary: '#CB3524', secondary: '#272E61', reputation: 86 },
            { name: 'Real Sociedad', primary: '#0067B1', secondary: '#FFFFFF', reputation: 81 },
            { name: 'Athletic Club', primary: '#EE2523', secondary: '#FFFFFF', reputation: 80 },
            { name: 'Real Betis', primary: '#0BB363', secondary: '#FFFFFF', reputation: 79 }
        ]
    },
    {
        id: 'serie_a',
        name: 'Serie A',
        country: 'Italy',
        teams: [
            { name: 'Inter Milan', primary: '#010E80', secondary: '#000000', reputation: 89 },
            { name: 'AC Milan', primary: '#FB090B', secondary: '#000000', reputation: 87 },
            { name: 'Juventus', primary: '#000000', secondary: '#FFFFFF', reputation: 88 },
            { name: 'Napoli', primary: '#12A0D7', secondary: '#FFFFFF', reputation: 85 },
            { name: 'AS Roma', primary: '#8E1F2F', secondary: '#F0BC42', reputation: 82 }
        ]
    },
    {
        id: 'bundesliga',
        name: 'Bundesliga',
        country: 'Germany',
        teams: [
            { name: 'Bayern Munich', primary: '#DC052D', secondary: '#FFFFFF', reputation: 92 },
            { name: 'Dortmund', primary: '#FDE100', secondary: '#000000', reputation: 86 },
            { name: 'Bayer Leverkusen', primary: '#E32219', secondary: '#000000', reputation: 84 },
            { name: 'Leipzig', primary: '#FFFFFF', secondary: '#DD0741', reputation: 83 }
        ]
    },
    {
        id: 'ligue1',
        name: 'Ligue 1',
        country: 'France',
        teams: [
            { name: 'PSG', primary: '#004170', secondary: '#DA291C', reputation: 89 },
            { name: 'Marseille', primary: '#009DDC', secondary: '#FFFFFF', reputation: 81 },
            { name: 'Lyon', primary: '#122F67', secondary: '#D80E2F', reputation: 79 },
            { name: 'AS Monaco', primary: '#E51B22', secondary: '#FFFFFF', reputation: 80 }
        ]
    },
    {
        id: 'super_lig',
        name: 'Süper Lig',
        country: 'Turkey',
        teams: [
            { name: 'Galatasaray', primary: '#A90432', secondary: '#FDB912', reputation: 80 },
            { name: 'Fenerbahce', primary: '#002D72', secondary: '#FFF200', reputation: 80 },
            { name: 'Besiktas', primary: '#000000', secondary: '#FFFFFF', reputation: 78 },
            { name: 'Trabzonspor', primary: '#831D40', secondary: '#6BB5E3', reputation: 76 }
        ]
    }
];