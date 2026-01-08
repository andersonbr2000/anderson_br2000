
import React, { useEffect, useRef } from 'react';
import { Team, Match } from '../types';

interface MatchTableProps {
  teams: Team[];
  matches: Match[];
  onUpdateScore: (matchId: string, homeScore: number | null, awayScore: number | null) => void;
}

const MatchTable: React.FC<MatchTableProps> = ({ teams, matches, onUpdateScore }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const matchRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const getTeam = (id: string) => teams.find(t => t.id === id);

  // Encontrar a primeira partida que ainda não foi jogada para focar nela
  const firstUnplayedMatch = matches.find(m => !m.isPlayed);

  // Efeito para rolar automaticamente para a próxima partida
  useEffect(() => {
    if (firstUnplayedMatch && matchRefs.current[firstUnplayedMatch.id]) {
      setTimeout(() => {
        matchRefs.current[firstUnplayedMatch.id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [matches, firstUnplayedMatch?.id]);

  const rounds = Array.from(new Set(matches.map(m => m.round))).sort((a: number, b: number) => a - b);

  return (
    <div 
      ref={containerRef}
      className="bg-slate-900/40 p-4 rounded-3xl border border-slate-800/60 shadow-inner max-h-[450px] overflow-y-auto custom-scrollbar"
    >
      <div className="space-y-8 pb-10">
        {rounds.map(roundNum => (
          <div key={roundNum} className="space-y-3">
            <div className="flex items-center gap-3 sticky top-0 bg-slate-950/80 backdrop-blur-sm z-20 py-2 -mx-2 px-2 rounded-lg">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                Rodada {roundNum}
              </span>
              <div className="h-px flex-1 bg-slate-800"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matches.filter(m => m.round === roundNum).map((match) => {
                const homeTeam = getTeam(match.homeTeamId);
                const awayTeam = getTeam(match.awayTeamId);
                const isCurrent = firstUnplayedMatch?.id === match.id;

                if (!homeTeam || !awayTeam) return null;

                return (
                  <div 
                    key={match.id} 
                    ref={el => matchRefs.current[match.id] = el}
                    className={`
                      relative group border transition-all duration-500 rounded-2xl p-4 flex items-center justify-between
                      ${match.isPlayed 
                        ? 'bg-slate-900/40 border-slate-800 opacity-60 grayscale-[0.5]' 
                        : isCurrent 
                          ? 'bg-slate-800 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-2 ring-blue-500/10' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }
                    `}
                  >
                    {isCurrent && (
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full animate-ping z-10" />
                    )}

                    <div className="flex-1 flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white/20 shadow-sm" style={{ backgroundColor: homeTeam.color }} />
                      <span className="text-xs font-black truncate text-slate-100 uppercase tracking-tight">{homeTeam.name}</span>
                    </div>

                    <div className="flex items-center gap-2 px-4">
                      <input
                        type="number"
                        min="0"
                        placeholder="-"
                        value={match.homeScore === null ? '' : match.homeScore}
                        onChange={(e) => {
                            const val = e.target.value === '' ? null : parseInt(e.target.value);
                            onUpdateScore(match.id, val, match.awayScore);
                        }}
                        className="w-12 h-10 bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center rounded-xl text-base font-black text-blue-400 outline-none transition-all"
                      />
                      <span className="text-slate-700 text-[10px] font-black italic">VS</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="-"
                        value={match.awayScore === null ? '' : match.awayScore}
                        onChange={(e) => {
                            const val = e.target.value === '' ? null : parseInt(e.target.value);
                            onUpdateScore(match.id, match.homeScore, val);
                        }}
                        className="w-12 h-10 bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center rounded-xl text-base font-black text-emerald-400 outline-none transition-all"
                      />
                    </div>

                    <div className="flex-1 flex items-center justify-end gap-4 text-right">
                      <span className="text-xs font-black truncate text-slate-100 uppercase tracking-tight">{awayTeam.name}</span>
                      <div className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white/20 shadow-sm" style={{ backgroundColor: awayTeam.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default MatchTable;
