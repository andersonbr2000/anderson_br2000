
import React, { useState, useMemo, useCallback } from 'react';
import { Team, Match, TeamStats } from './types';
import TeamSetup from './components/TeamSetup';
import MatchTable from './components/MatchTable';
import Dashboard from './components/Dashboard';
import FinalResult from './components/FinalResult';

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [step, setStep] = useState<'setup' | 'tournament'>('setup');
  const [finalScores, setFinalScores] = useState<{home: number | null, away: number | null}>({ home: null, away: null });
  const [setupKey, setSetupKey] = useState<number>(Date.now());

  const handleTeamsSubmit = (selectedTeams: Team[]) => {
    setTeams(selectedTeams);
    
    const t = selectedTeams;
    const schedule = [
      { round: 1, home: t[0], away: t[1] }, { round: 1, home: t[2], away: t[3] },
      { round: 2, home: t[0], away: t[2] }, { round: 2, home: t[1], away: t[3] },
      { round: 3, home: t[0], away: t[3] }, { round: 3, home: t[1], away: t[2] },
      { round: 4, home: t[1], away: t[0] }, { round: 4, home: t[3], away: t[2] },
      { round: 5, home: t[2], away: t[0] }, { round: 5, home: t[3], away: t[1] },
      { round: 6, home: t[3], away: t[0] }, { round: 6, home: t[2], away: t[1] },
    ];

    const newMatches: Match[] = schedule.map((item, index) => ({
      id: `match-${index}`,
      homeTeamId: item.home.id,
      awayTeamId: item.away.id,
      homeScore: null,
      awayScore: null,
      isPlayed: false,
      round: item.round,
    }));
    
    setMatches(newMatches);
    setStep('tournament');
  };

  const handleUpdateScore = (matchId: string, homeScore: number | null, awayScore: number | null) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        const isPlayed = homeScore !== null && awayScore !== null;
        return { ...m, homeScore, awayScore, isPlayed };
      }
      return m;
    }));
  };

  const handleReset = useCallback(() => {
    setTeams([]);
    setMatches([]);
    setFinalScores({ home: null, away: null });
    setStep('setup');
    setSetupKey(Date.now());
  }, []);

  const stats = useMemo(() => {
    const statsMap: Record<string, TeamStats> = {};
    teams.forEach(team => {
      statsMap[team.id] = {
        teamId: team.id,
        teamName: team.name,
        teamColor: team.color,
        points: 0,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
      };
    });

    matches.forEach(match => {
      if (match.isPlayed && match.homeScore !== null && match.awayScore !== null) {
        const home = statsMap[match.homeTeamId];
        const away = statsMap[match.awayTeamId];
        home.played += 1;
        away.played += 1;
        home.goalsFor += match.homeScore;
        home.goalsAgainst += match.awayScore;
        away.goalsFor += match.awayScore;
        away.goalsAgainst += match.homeScore;
        if (match.homeScore > match.awayScore) {
          home.points += 3; home.wins += 1; away.losses += 1;
        } else if (match.homeScore < match.awayScore) {
          away.points += 3; away.wins += 1; home.losses += 1;
        } else {
          home.points += 1; away.points += 1; home.draws += 1; away.draws += 1;
        }
      }
    });

    return Object.values(statsMap).map(s => ({
      ...s,
      goalDifference: s.goalsFor - s.goalsAgainst
    })).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.goalDifference - a.goalDifference;
    });
  }, [teams, matches]);

  const allPlayed = matches.length > 0 && matches.every(m => m.isPlayed);

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 selection:bg-blue-500 selection:text-white">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col items-center relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tighter">
            SUPER PLACAR 4
          </h1>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">Gestão Automática de Resultados</p>
        
        <button 
          onClick={handleReset}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-red-500 hover:border-red-500 text-slate-500 hover:text-white rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest group"
        >
          <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reiniciar Aplicativo
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        {step === 'setup' ? (
          <div key={setupKey}>
            <TeamSetup onSubmit={handleTeamsSubmit} />
          </div>
        ) : (
          <div className="flex flex-col gap-10 animate-in fade-in duration-500">
            
            {/* Seção de Confrontos no TOPO */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse"></span>
                  Confrontos
                </h2>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">Próxima Partida em Foco</span>
              </div>
              <MatchTable teams={teams} matches={matches} onUpdateScore={handleUpdateScore} />
            </section>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

            {/* Dashboard e Final abaixo */}
            <section className="space-y-12">
              <Dashboard stats={stats} />
              
              {allPlayed && (
                <FinalResult 
                  stats={stats} 
                  finalScores={finalScores} 
                  onUpdateFinalScore={(h, a) => setFinalScores({home: h, away: a})} 
                />
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto mt-20 pb-12 text-center">
        <div className="h-px w-10 bg-slate-800 mx-auto mb-6"></div>
        <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.4em]">
          Gerenciador Profissional • 2024
        </p>
      </footer>
    </div>
  );
};

export default App;
