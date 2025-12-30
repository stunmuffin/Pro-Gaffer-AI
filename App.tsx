import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import SquadView from './components/SquadView';
import MatchCenter from './components/MatchCenter';
import TacticsBoard from './components/TacticsBoard';
import ProfileSettings from './components/ProfileSettings';
import TransferMarket from './components/TransferMarket';
import ScoutingCenter from './components/ScoutingCenter';
import TrainingGround from './components/TrainingGround';
import FinancesOffice from './components/FinancesOffice';
import FacilitiesManager from './components/FacilitiesManager';
import CareerHub from './components/CareerHub';
import StatsHub from './components/StatsHub';
import CompetitionsHub from './components/CompetitionsHub';
import Tooltip from './components/Tooltip';
import ClubBadge from './components/ClubBadge';
import NewGameSetup from './components/NewGameSetup';
import { AppView, Team, Manager, Player, Finances, PlayerAttributes, Fixture, FinancialTransaction, ClubFacilities, JobOffer, MatchEvent, ManagerPersonality, Language, MatchState, PitchEntity, Position, TransactionType } from './types';
import { STARTING_TEAM, STARTING_MANAGER, TRANSLATIONS, COMMENTARY_TEMPLATES, FORMATIONS } from './constants';
import { generateLeague, generateFixtures, simulateMatch, generateTransferMarket } from './services/geminiService';
import { processMatchTick, calculatePitchPositions } from './services/matchEngine';
import { Trophy, Calendar, DollarSign, Activity, Save, Upload, Briefcase, TrendingUp, CheckCircle, AlertTriangle, Info, Bell, ChevronRight, Zap, History, Mail, Newspaper } from 'lucide-react';

interface NotificationState {
    message: string;
    type: 'success' | 'error' | 'info';
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [userTeam, setUserTeam] = useState<Team>(STARTING_TEAM);
  const [manager, setManager] = useState<Manager>(STARTING_MANAGER);
  const [language, setLanguage] = useState<Language>('EN');
  
  // League State
  const [leagueTeams, setLeagueTeams] = useState<Team[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [currentGameweek, setCurrentGameweek] = useState(1);
  const [nextOpponent, setNextOpponent] = useState<Team | null>(null);

  const [marketPlayers, setMarketPlayers] = useState<Player[]>([]);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [showNewGameWizard, setShowNewGameWizard] = useState(true); 

  // --- GLOBAL MATCH STATE ---
  const [matchState, setMatchState] = useState<MatchState>({
    isPlaying: false,
    isFinished: false,
    isHalfTime: false,
    minute: 0,
    homeScore: 0,
    awayScore: 0,
    events: [],
    homeTeam: STARTING_TEAM, 
    awayTeam: STARTING_TEAM,
    homeStats: { possession: 50, shots: 0, shotsOnTarget: 0, xg: 0, corners: 0, fouls: 0, yellowCards: 0, redCards: 0 },
    awayStats: { possession: 50, shots: 0, shotsOnTarget: 0, xg: 0, corners: 0, fouls: 0, yellowCards: 0, redCards: 0 },
    ballPosition: { x: 50, y: 50 },
    sidesSwapped: false,
    possessionSide: 'home'
  });
  const [pitchPlayers, setPitchPlayers] = useState<PitchEntity[]>([]);
  const [simSpeed, setSimSpeed] = useState(100); 

  const t = TRANSLATIONS[language];

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
  };

  const saveGame = (manual: boolean = false) => {
      const saveData = {
          userTeam,
          manager,
          leagueTeams,
          fixtures,
          currentGameweek,
          nextOpponent,
          marketPlayers,
          matchState: { ...matchState, isPlaying: false } // Pause on save
      };
      localStorage.setItem('proGafferSave', JSON.stringify(saveData));
      if(manual) showNotification(t.saveSuccess, 'success');
  };

  const loadGame = () => {
      const saved = localStorage.getItem('proGafferSave');
      if (saved) {
          try {
              const data = JSON.parse(saved);
              setUserTeam(data.userTeam);
              setManager(data.manager);
              setLeagueTeams(data.leagueTeams);
              setFixtures(data.fixtures);
              setCurrentGameweek(data.currentGameweek);
              setNextOpponent(data.nextOpponent);
              setMarketPlayers(data.marketPlayers || []);
              if (data.matchState) setMatchState(data.matchState);
              
              setIsGameLoaded(true);
              setShowNewGameWizard(false);
              showNotification(t.loadSuccess, 'success');
          } catch (e) {
              console.error(e);
              showNotification("Failed to load save file.", 'error');
          }
      } else {
          showNotification("No save file found.", 'error');
      }
  };

  const handleResign = () => {
      localStorage.removeItem('proGafferSave');
      setShowNewGameWizard(true);
      setIsGameLoaded(false);
      setUserTeam(STARTING_TEAM);
      setManager(STARTING_MANAGER);
      setLeagueTeams([]);
      setFixtures([]);
      setCurrentGameweek(1);
      setNextOpponent(null);
      setCurrentView(AppView.DASHBOARD);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('proGafferSave');
    if (savedData) {
        // Option to load logic here
    }
  }, []);

  // --- GLOBAL SIMULATION LOOP ---
  useEffect(() => {
    let interval: any;

    if (matchState.isPlaying && !matchState.isFinished && !matchState.isHalfTime) {
      
      interval = setInterval(() => {
        setMatchState(prev => processMatchTick(prev, language, pitchPlayers));
      }, simSpeed);
    }

    return () => clearInterval(interval);
  }, [matchState.isPlaying, matchState.isFinished, matchState.isHalfTime, simSpeed, language, pitchPlayers]); 
  
  // --- VISUAL UPDATE EFFECT ---
  // Synchronize pitch players with ball and instruction logic using the engine
  useEffect(() => {
      if (matchState.isPlaying) {
          setPitchPlayers(prev => calculatePitchPositions(prev, matchState, userTeam));
      }
  }, [matchState.ballPosition, matchState.isPlaying, matchState.sidesSwapped, matchState.possessionSide]);

  // --- INITIALIZATION HELPERS ---
  
  const setupPitch = (home: Team, away: Team, swapped: boolean) => {
      const initPlayers: PitchEntity[] = [];
      
      const addTeam = (t: Team, side: 'home' | 'away') => {
          // Use tactics formation or default to 4-4-2
          const formation = t.tactics?.formation || '4-4-2';
          const layout = FORMATIONS[formation] || FORMATIONS['4-4-2'];

          t.players.slice(0, 11).forEach((p, i) => {
              // 1. Determine Tactical Position (0-100 X, 0-100 Y, Y=100 is Bottom/OwnGoal)
              let tacticPos = layout[i] || { x: 50, y: 50 };
              
              // Override with custom position if User Team and dragged
              if (t.id === userTeam.id && t.tactics.customPositions?.[p.id]) {
                  tacticPos = t.tactics.customPositions[p.id];
              }

              // 2. Transform to Pitch Coordinates (Horizontal Match Engine)
              // Home defends X=0 (Left). Away defends X=100 (Right).
              // Tactics Board: Y=88 is GK.
              // Home GK (Y=88) -> Match X ~ 10. Home FWD (Y=15) -> Match X ~ 85.
              
              let baseX = 50;
              let baseY = 50;

              const isHomeEnd = (side === 'home' && !swapped) || (side === 'away' && swapped);

              if (isHomeEnd) {
                  // Home Logic (Left to Right)
                  baseX = (100 - tacticPos.y); 
                  baseY = tacticPos.x;
              } else {
                  // Away Logic (Right to Left)
                  baseX = tacticPos.y;
                  baseY = 100 - tacticPos.x; // Mirror width
              }

              initPlayers.push({
                  id: p.id,
                  name: p.name,
                  x: baseX,
                  y: baseY,
                  baseX: baseX,
                  baseY: baseY,
                  targetX: baseX,
                  targetY: baseY,
                  color: t.primaryColor,
                  side,
                  role: p.position as any,
                  number: i + 1
              });
          });
      };
      
      addTeam(home, 'home');
      addTeam(away, 'away');
      setPitchPlayers(initPlayers);
  };

  const initMatchState = (home: Team, away: Team) => {
      const newState: MatchState = {
        isPlaying: false,
        isFinished: false,
        isHalfTime: false,
        minute: 0,
        homeScore: 0,
        awayScore: 0,
        events: [],
        homeTeam: JSON.parse(JSON.stringify(home)),
        awayTeam: JSON.parse(JSON.stringify(away)),
        homeStats: { possession: 50, shots: 0, shotsOnTarget: 0, xg: 0, corners: 0, fouls: 0, yellowCards: 0, redCards: 0 },
        awayStats: { possession: 50, shots: 0, shotsOnTarget: 0, xg: 0, corners: 0, fouls: 0, yellowCards: 0, redCards: 0 },
        ballPosition: { x: 50, y: 50 },
        sidesSwapped: false,
        possessionSide: 'home'
      };
      setMatchState(newState);
      setupPitch(home, away, false);
  };

  const handleStartSecondHalf = () => {
      setMatchState(prev => ({
          ...prev,
          isHalfTime: false,
          isPlaying: true,
          minute: 45,
          sidesSwapped: true, // Flip sides
          ballPosition: { x: 50, y: 50 }, // Reset ball to center
          events: [...prev.events, { minute: 45, type: 'WHISTLE', description: 'Second Half Begins!', teamId: undefined }],
          possessionSide: 'away' // Kickoff for away team
      }));
      setupPitch(matchState.homeTeam, matchState.awayTeam, true);
  };

  const enterMatch = () => {
      if (nextOpponent) {
          // Re-initialize match state to capture latest tactical changes
          initMatchState(userTeam, nextOpponent);
          setCurrentView(AppView.MATCH);
      }
  };

  const handleStartNewGame = async (managerName: string, personality: ManagerPersonality, leagueId: string, teamTemplate: {name: string, primary: string, secondary: string, reputation: number}) => {
      const newManager: Manager = {
          ...STARTING_MANAGER,
          name: managerName,
          personality: personality,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${managerName}`
      };
      const allTeams = await generateLeague('user-team', leagueId);
      let newUserTeam = allTeams.find(t => t.name === teamTemplate.name);
      if (!newUserTeam) newUserTeam = allTeams[0];
      newUserTeam = {
          ...newUserTeam,
          id: 'user-team',
          manager: newManager,
          finances: {
              ...newUserTeam.finances!,
              balance: teamTemplate.reputation * 1000000,
              transferBudget: teamTemplate.reputation * 500000
          }
      };
      const finalLeagueTeams = allTeams.map(t => t.name === teamTemplate.name ? newUserTeam! : t);
      const seasonFixtures = generateFixtures(finalLeagueTeams);
      const mkt = await generateTransferMarket(12);

      setManager(newManager);
      setUserTeam(newUserTeam);
      setLeagueTeams(finalLeagueTeams);
      setFixtures(seasonFixtures);
      setMarketPlayers(mkt);
      setCurrentGameweek(1);
      
      updateNextOpponent(newUserTeam.id, seasonFixtures, 1, finalLeagueTeams);
      initMatchState(newUserTeam, newUserTeam); 

      setIsGameLoaded(true);
      setShowNewGameWizard(false);
      showNotification(`${t.welcome} ${newUserTeam.name}, Boss!`, 'success');
      saveGame(true);
  };

  const updateNextOpponent = (userId: string, fixturesList: Fixture[], gw: number, teams: Team[]) => {
      const nextFixture = fixturesList.find(f => f.gameweek === gw && (f.homeTeamId === userId || f.awayTeamId === userId));
      if (nextFixture) {
          const oppId = nextFixture.homeTeamId === userId ? nextFixture.awayTeamId : nextFixture.homeTeamId;
          const opp = teams.find(t => t.id === oppId);
          setNextOpponent(opp || null);
      } else {
          setNextOpponent(null); 
      }
  };

  const handleTeamUpdate = (updatedTeam: Team) => {
    setUserTeam(updatedTeam);
    setLeagueTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
  };

  const handleManagerUpdate = (updatedManager: Manager) => { setManager(updatedManager); };

  const handleMatchFinish = (homeScore: number, awayScore: number, matchEvents: MatchEvent[]) => {
      setMatchState(prev => ({ ...prev, isFinished: false, isPlaying: false, minute: 0, events: [], sidesSwapped: false }));

      let updatedFixtures = [...fixtures];
      const userMatchIndex = updatedFixtures.findIndex(f => f.gameweek === currentGameweek && (f.homeTeamId === userTeam.id || f.awayTeamId === userTeam.id));
      
      let userWon = false;
      let userDrawn = false;

      if (userMatchIndex > -1) {
          const match = updatedFixtures[userMatchIndex];
          match.isPlayed = true;
          if (match.homeTeamId === userTeam.id) {
            match.homeScore = homeScore;
            match.awayScore = awayScore;
            if(homeScore > awayScore) userWon = true;
            if(homeScore === awayScore) userDrawn = true;
          } else {
            match.homeScore = awayScore;
            match.awayScore = homeScore;
            if(awayScore > homeScore) userWon = true;
            if(awayScore === homeScore) userDrawn = true;
          }
          updatedFixtures[userMatchIndex] = match;
      }

      const otherMatches = updatedFixtures.filter(f => f.gameweek === currentGameweek && !f.isPlayed);
      let updatedLeagueTeams = [...leagueTeams]; 

      otherMatches.forEach(match => {
          const homeT = updatedLeagueTeams.find(t => t.id === match.homeTeamId)!;
          const awayT = updatedLeagueTeams.find(t => t.id === match.awayTeamId)!;
          const result = simulateMatch(homeT, awayT);
          
          const idx = updatedFixtures.findIndex(f => f.id === match.id);
          updatedFixtures[idx] = { ...match, isPlayed: true, homeScore: result.homeScore, awayScore: result.awayScore };
          
          result.homeScorers.forEach(pid => {
              const p = homeT.players.find(pl => pl.id === pid);
              if (p) p.seasonStats.goals++;
          });
          result.awayScorers.forEach(pid => {
              const p = awayT.players.find(pl => pl.id === pid);
              if (p) p.seasonStats.goals++;
          });
      });

      setFixtures(updatedFixtures);
      updatedLeagueTeams = updateLeagueTable(updatedLeagueTeams, updatedFixtures);
      const newUserStats = updatedLeagueTeams.find(t => t.id === userTeam.id)?.stats;
      
      let newManager = { ...manager };
      newManager.stats.matchesManaged++;
      newManager.stats.goalsFor += userTeam.id === updatedFixtures[userMatchIndex].homeTeamId ? homeScore : awayScore;
      newManager.stats.goalsAgainst += userTeam.id === updatedFixtures[userMatchIndex].homeTeamId ? awayScore : homeScore;
      
      if (userWon) {
          newManager.stats.wins++;
          newManager.reputation = Math.min(100, newManager.reputation + 1);
          newManager.xp += 500;
      } else if (userDrawn) {
          newManager.stats.draws++;
          newManager.xp += 200;
      } else {
          newManager.stats.losses++;
          newManager.reputation = Math.max(0, newManager.reputation - 0.5);
          newManager.xp += 100;
      }
      
      if (newManager.xp >= newManager.nextLevelXp) {
          newManager.level++;
          newManager.xp -= newManager.nextLevelXp;
          newManager.nextLevelXp = Math.round(newManager.nextLevelXp * 1.2);
          newManager.skillPoints++;
          showNotification(`Manager Level Up! You are now Level ${newManager.level}`, 'success');
      }
      setManager(newManager);

      const ticketRevenue = (userTeam.clubDetails?.capacity || 20000) * 40; 
      const winBonus = homeScore > awayScore ? 500000 : 0;
      const weeklyWages = userTeam.players.reduce((acc, p) => acc + p.contract.salary, 0);
      const newTransactions: FinancialTransaction[] = [
          { id: `tr-${Date.now()}-1`, gameweek: currentGameweek, type: 'Match Revenue', amount: ticketRevenue, description: `Matchday Income` },
          { id: `tr-${Date.now()}-3`, gameweek: currentGameweek, type: 'Wages', amount: -weeklyWages, description: `Player Wages` }
      ];
      if(winBonus > 0) newTransactions.push({ id: `tr-${Date.now()}-2`, gameweek: currentGameweek, type: 'Prize Money', amount: winBonus, description: `Win Bonus` });

      const netProfit = ticketRevenue + winBonus - weeklyWages;
      const updatedFinances = {
          ...userTeam.finances!,
          balance: userTeam.finances!.balance + netProfit,
          transactions: [...userTeam.finances!.transactions, ...newTransactions],
          ytdProfitLoss: userTeam.finances!.ytdProfitLoss + netProfit
      };

      const updatedUserTeam = { ...userTeam, stats: newUserStats, finances: updatedFinances };
      setUserTeam(updatedUserTeam);
      setLeagueTeams(updatedLeagueTeams.map(t => t.id === userTeam.id ? updatedUserTeam : t));

      const nextWeek = currentGameweek + 1;
      setCurrentGameweek(nextWeek);
      updateNextOpponent(userTeam.id, updatedFixtures, nextWeek, updatedLeagueTeams);
      
      showNotification(`${t.matchFinished}! Revenue (net): ${netProfit > 0 ? '+' : ''}£${(netProfit/1000000).toFixed(2)}M`, 'success');
      setCurrentView(AppView.DASHBOARD);
  };

  const handleBuyPlayer = (player: Player, fee: number, wage: number) => {
      const finances = userTeam.finances!;
      const newPlayer = { ...player, contract: { ...player.contract, salary: wage }, isListed: false };
      
      const transaction: FinancialTransaction = { 
          id: `tr-${Date.now()}`, 
          gameweek: currentGameweek, 
          type: 'Transfer Fee' as TransactionType, 
          amount: -fee, 
          description: `Signed ${player.name}` 
      };

      const updatedUserTeam = {
          ...userTeam,
          players: [...userTeam.players, newPlayer],
          finances: {
              ...finances,
              balance: finances.balance - fee,
              transferBudget: finances.transferBudget - fee,
              transactions: [...finances.transactions, transaction]
          }
      };
      handleTeamUpdate(updatedUserTeam);
      setMarketPlayers(prev => prev.filter(p => p.id !== player.id));
      showNotification(`Signed ${player.name}`, 'success');
  };
  const handleSellPlayer = (playerId: string) => handleTeamUpdate({ ...userTeam, players: userTeam.players.filter(p => p.id !== playerId) });
  const handleUpdateFinances = (finances: Finances) => handleTeamUpdate({ ...userTeam, finances });
  const handleUpgradeFacility = (type: keyof ClubFacilities, cost: number) => { 
      const currentLevel = userTeam.facilities[type];
      const updatedUserTeam = {
          ...userTeam,
          facilities: { ...userTeam.facilities, [type]: currentLevel + 1 },
          finances: { ...userTeam.finances!, balance: userTeam.finances!.balance - cost }
      };
      handleTeamUpdate(updatedUserTeam);
      showNotification(`${type} upgraded!`, 'success');
  };
  const handleAcceptJob = (offer: JobOffer) => { /* ... existing logic ... */ };
  const handleSkillUpgrade = (id: string) => { 
      setManager(prev => ({...prev, skillPoints: prev.skillPoints - 1}));
  };

  const updateLeagueTable = (teams: Team[], fixturesList: Fixture[]) => {
      return teams.map(t => {
          const played = fixturesList.filter(f => f.isPlayed && (f.homeTeamId === t.id || f.awayTeamId === t.id));
          const stats = { played: 0, won: 0, drawn: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0 };
          played.forEach(f => {
              stats.played++;
              const isHome = f.homeTeamId === t.id;
              const gf = isHome ? f.homeScore! : f.awayScore!;
              const ga = isHome ? f.awayScore! : f.homeScore!;
              stats.goalsFor += gf;
              stats.goalsAgainst += ga;
              if (gf > ga) { stats.won++; stats.points += 3; }
              else if (gf === ga) { stats.drawn++; stats.points += 1; }
              else { stats.lost++; }
          });
          return { ...t, stats };
      });
  };

  const renderContent = () => {
    switch(currentView) {
      case AppView.SQUAD:
        return <SquadView players={userTeam.players} />;
      case AppView.TACTICS:
        return <TacticsBoard team={userTeam} onUpdateTeam={handleTeamUpdate} />;
      case AppView.MATCH:
         if (!nextOpponent && currentGameweek > 38) return <div className="p-8 text-center text-slate-500">Season Finished</div>;
         if (!nextOpponent) return <div className="p-8 text-center text-slate-500">No Match Scheduled</div>;
         
         return (
            <MatchCenter 
                userTeam={userTeam} 
                opponentTeam={nextOpponent} 
                onMatchComplete={handleMatchFinish}
                onStartSecondHalf={handleStartSecondHalf}
                matchState={matchState}
                pitchPlayers={pitchPlayers}
                simSpeed={simSpeed}
                setMatchState={setMatchState}
                setSimSpeed={setSimSpeed}
            />
         );
      case AppView.TRANSFERS:
        return <TransferMarket marketPlayers={marketPlayers} userTeamPlayers={userTeam.players} finances={userTeam.finances!} onBuyPlayer={handleBuyPlayer} onSellPlayer={handleSellPlayer} onUpdateFinances={handleUpdateFinances} />;
      case AppView.SCOUTING:
          return <ScoutingCenter onSignYouth={(p) => handleBuyPlayer(p, 0, p.contract.salary)} team={userTeam} onUpdateTeam={handleTeamUpdate} />;
      case AppView.TRAINING:
          return <TrainingGround team={userTeam} onUpdateTeam={handleTeamUpdate} />;
      case AppView.FINANCES:
          return <FinancesOffice team={userTeam} onUpdateTeam={handleTeamUpdate} />;
      case AppView.FACILITIES:
          return <FacilitiesManager team={userTeam} onUpgradeFacility={handleUpgradeFacility} />;
      case AppView.CAREER:
          return <CareerHub manager={manager} leagueTeams={leagueTeams} onAcceptJob={handleAcceptJob} onUpgradeSkill={handleSkillUpgrade} />;
      case AppView.STATS:
          return <StatsHub userTeam={userTeam} leagueTeams={leagueTeams} fixtures={fixtures} />;
      case AppView.COMPETITIONS:
            return (
                <CompetitionsHub 
                    leagueTeams={leagueTeams} 
                    fixtures={fixtures} 
                    currentGameweek={currentGameweek} 
                />
            );
      case AppView.PROFILE:
          return (
            <ProfileSettings 
                manager={manager} 
                team={userTeam} 
                onUpdateManager={handleManagerUpdate} 
                onUpdateTeam={handleTeamUpdate} 
                onResign={handleResign}
                language={language}
                setLanguage={setLanguage}
            />
          );
      case AppView.DASHBOARD:
      default:
        const leaguePos = leagueTeams.sort((a,b) => (b.stats?.points||0) - (a.stats?.points||0)).findIndex(t => t.id === userTeam.id) + 1;
        const totalPoints = userTeam.stats?.points || 0;
        
        return (
            <div className="space-y-6 animate-fadeIn pb-8 max-w-7xl mx-auto">
                {/* --- HEADER: Inbox Style --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-700/50 pb-6">
                    <div>
                        <div className="text-xs text-purple-400 font-bold mb-1 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="w-3 h-3" /> {t.inbox} (3 Unread)
                        </div>
                        <h2 className="text-4xl font-header font-black text-white flex items-center gap-3">
                             <ClubBadge team={userTeam} size="lg" />
                             <span className="uppercase italic tracking-wide">{t.dashboard}</span>
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => saveGame(true)}
                            className="bg-[#1f2937] hover:bg-[#374151] border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                        >
                            <Save className="w-4 h-4" /> {t.saveGame}
                        </button>
                        {nextOpponent && (
                            <button 
                                onClick={enterMatch} 
                                className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2"
                            >
                                {t.nextMatch} <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* --- INBOX / WIDGET GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT COL: Next Match Card (Big) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Next Fixture Panel */}
                        <div className="bg-[#1f2937] border-l-4 border-purple-500 rounded-r-xl shadow-xl overflow-hidden group">
                            <div className="p-6 relative">
                                {/* Background texture */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent opacity-50 pointer-events-none"></div>
                                
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h3 className="font-header font-bold text-2xl text-white uppercase tracking-wide flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-purple-400" /> {t.upcoming}
                                    </h3>
                                    <span className="bg-purple-900/50 text-purple-200 text-xs font-bold px-3 py-1 rounded border border-purple-500/30">
                                        Gameweek {currentGameweek}
                                    </span>
                                </div>

                                {nextOpponent ? (
                                    <div className="flex items-center justify-between gap-4 relative z-10">
                                        <div className="flex-1 text-center">
                                            <ClubBadge team={userTeam} size="lg" className="mx-auto mb-2" />
                                            <div className="font-header font-bold text-xl text-white uppercase">{userTeam.name}</div>
                                            <div className="text-xs text-slate-400 font-bold">POS: {leaguePos}</div>
                                        </div>
                                        
                                        <div className="flex flex-col items-center px-4">
                                            <div className="text-3xl font-header font-black text-slate-500">VS</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Kick Off 15:00</div>
                                        </div>

                                        <div className="flex-1 text-center">
                                            <ClubBadge team={nextOpponent} size="lg" className="mx-auto mb-2" />
                                            <div className="font-header font-bold text-xl text-white uppercase">{nextOpponent.name}</div>
                                            <div className="text-xs text-slate-400 font-bold">
                                                POS: {leagueTeams.sort((a,b) => (b.stats?.points||0) - (a.stats?.points||0)).findIndex(t => t.id === nextOpponent.id) + 1}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500 italic">No upcoming fixture scheduled.</div>
                                )}
                            </div>
                            {/* Footer Action */}
                            <div className="bg-[#111827]/50 p-3 flex justify-between items-center border-t border-slate-700/50">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.teamReport} Available</span>
                                <button className="text-xs text-purple-400 hover:text-white font-bold uppercase tracking-wider transition-colors">View Analysis &rarr;</button>
                            </div>
                        </div>

                        {/* Recent News / Inbox Items */}
                        <div className="bg-[#1f2937] border border-slate-700 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-slate-700 bg-[#111827]/50 flex justify-between items-center">
                                <h3 className="font-header font-bold text-lg text-white uppercase tracking-wide flex items-center gap-2">
                                    <Newspaper className="w-4 h-4 text-blue-400" /> {t.news}
                                </h3>
                            </div>
                            <div className="divide-y divide-slate-700/50">
                                {userTeam.finances?.transactions.slice().reverse().slice(0, 3).map((tr) => (
                                    <div key={tr.id} className="p-4 hover:bg-slate-700/20 transition-colors flex gap-4 cursor-pointer group">
                                        <div className={`w-1 h-auto rounded-full ${tr.amount > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-200 text-sm group-hover:text-white">{tr.type} Update</h4>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase">GW {tr.gameweek}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{tr.description}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-4 hover:bg-slate-700/20 transition-colors flex gap-4 cursor-pointer group">
                                    <div className="w-1 h-auto rounded-full bg-blue-500"></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-slate-200 text-sm group-hover:text-white">Scouting Report Ready</h4>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase">Today</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">Chief Scout has finished the assignment in South America.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL: Quick Stats & Table */}
                    <div className="space-y-6">
                        
                        {/* League Table Mini */}
                        <div className="bg-[#1f2937] border border-slate-700 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-slate-700 bg-[#111827]/50">
                                <h3 className="font-header font-bold text-lg text-white uppercase tracking-wide flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-400" /> {t.standings}
                                </h3>
                            </div>
                            <table className="w-full text-xs text-left">
                                <thead className="text-slate-500 bg-[#111827] uppercase font-bold">
                                    <tr>
                                        <th className="p-3 w-8 text-center">#</th>
                                        <th className="p-3">Club</th>
                                        <th className="p-3 text-center">P</th>
                                        <th className="p-3 text-center">Pts</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {leagueTeams.sort((a,b) => (b.stats?.points||0) - (a.stats?.points||0)).slice(0, 5).map((team, i) => (
                                        <tr key={team.id} className={`${team.id === userTeam.id ? 'bg-purple-900/20' : ''}`}>
                                            <td className="p-3 text-center font-bold text-slate-400">{i+1}</td>
                                            <td className={`p-3 font-bold ${team.id === userTeam.id ? 'text-white' : 'text-slate-300'}`}>
                                                {team.name}
                                            </td>
                                            <td className="p-3 text-center text-slate-500">{team.stats?.played}</td>
                                            <td className="p-3 text-center font-bold text-white">{team.stats?.points}</td>
                                        </tr>
                                    ))}
                                    {/* Show user team if not in top 5 */}
                                    {leaguePos > 5 && (
                                        <>
                                            <tr className="border-t border-slate-700"><td colSpan={4} className="text-center text-slate-600 py-1">...</td></tr>
                                            <tr className="bg-purple-900/20">
                                                <td className="p-3 text-center font-bold text-slate-400">{leaguePos}</td>
                                                <td className="p-3 font-bold text-white">{userTeam.name}</td>
                                                <td className="p-3 text-center text-slate-500">{userTeam.stats?.played}</td>
                                                <td className="p-3 text-center font-bold text-white">{userTeam.stats?.points}</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Finances Quick View */}
                        <div className="bg-[#1f2937] border border-slate-700 rounded-xl p-5">
                            <h3 className="font-header font-bold text-lg text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-yellow-400" /> {t.finances}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Transfer Budget</div>
                                    <div className="text-2xl font-header font-bold text-green-400">
                                        £{(userTeam.finances?.transferBudget/1000000).toFixed(1)}M
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Wage Budget</div>
                                    <div className="text-2xl font-header font-bold text-blue-400">
                                        £{(userTeam.finances?.wageBudget/1000).toFixed(0)}k <span className="text-sm text-slate-500 font-sans">p/w</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
  };

  if (showNewGameWizard) {
      return (
          <>
            <NewGameSetup onStartGame={handleStartNewGame} onLoadGame={loadGame} language={language} setLanguage={setLanguage} />
            {notification && (
                <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-fade-in-up z-50 ${
                    notification.type === 'success' ? 'bg-[#1f2937] border-green-500 text-green-400' :
                    notification.type === 'error' ? 'bg-[#1f2937] border-red-500 text-red-400' :
                    'bg-[#1f2937] border-blue-500 text-blue-400'
                }`}>
                    {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {notification.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                    {notification.type === 'info' && <Info className="w-5 h-5" />}
                    <span className="font-bold text-white">{notification.message}</span>
                </div>
            )}
          </>
      );
  }

  return (
    <div className="flex bg-[#0f172a] min-h-screen font-sans selection:bg-purple-500/30 relative text-slate-200">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} manager={manager} language={language} setLanguage={setLanguage} />
      <main className="flex-1 p-4 lg:p-8 h-screen overflow-hidden overflow-y-auto scrollbar-hide bg-[#111827] relative">
        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#111827] to-black pointer-events-none -z-10"></div>
        {renderContent()}
      </main>
      
      {notification && (
          <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-fade-in-up z-50 ${
              notification.type === 'success' ? 'bg-[#1f2937] border-green-500 text-green-400' :
              notification.type === 'error' ? 'bg-[#1f2937] border-red-500 text-red-400' :
              'bg-[#1f2937] border-blue-500 text-blue-400'
          }`}>
              {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {notification.type === 'error' && <AlertTriangle className="w-5 h-5" />}
              {notification.type === 'info' && <Info className="w-5 h-5" />}
              <span className="font-bold text-white">{notification.message}</span>
          </div>
      )}
    </div>
  );
}

export default App;