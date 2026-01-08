
import React from 'react';
import { TeamStats } from '../types';

interface DashboardProps {
  stats: TeamStats[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Tabela Principal de Classificação - Otimizada para evitar rolagem horizontal */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="px-4 py-6 border-b border-slate-800 bg-slate-800/40 flex justify-between items-center">
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Classificação Geral</h3>
          <span className="hidden sm:inline-block text-[10px] font-bold text-slate-500 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
            Tempo Real
          </span>
        </div>
        
        <div className="w-full">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-950/50 text-slate-500 text-[10px] md:text-sm uppercase tracking-widest font-black">
                <th className="w-[10%] px-1 py-5 text-center">#</th>
                <th className="w-[35%] px-1 py-5">Equipe</th>
                <th className="w-[15%] px-1 py-5 text-center">P</th>
                <th className="w-[10%] px-1 py-5 text-center">J</th>
                <th className="w-[10%] px-1 py-5 text-center">V</th>
                <th className="w-[10%] px-1 py-5 text-center">E</th>
                <th className="w-[10%] px-1 py-5 text-center text-red-500/80">D</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {stats.map((team, idx) => (
                <tr key={team.teamId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-1 py-4 md:py-6 text-lg md:text-xl font-black text-slate-600 text-center">
                    {idx + 1}º
                  </td>
                  <td className="px-1 py-4 md:py-6 overflow-hidden">
                    <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                      <div className="w-1.5 h-6 md:h-8 rounded-full flex-shrink-0" style={{ backgroundColor: team.teamColor }} />
                      <span className="text-sm md:text-xl font-black text-white truncate">{team.teamName}</span>
                    </div>
                  </td>
                  <td className="px-1 py-4 md:py-6 text-center">
                    <span className="text-blue-400 font-black text-2xl md:text-4xl">{team.points}</span>
                  </td>
                  <td className="px-1 py-4 md:py-6 text-center text-slate-400 text-sm md:text-lg font-bold">{team.played}</td>
                  <td className="px-1 py-4 md:py-6 text-center text-slate-300 text-sm md:text-lg font-bold">{team.wins}</td>
                  <td className="px-1 py-4 md:py-6 text-center text-slate-300 text-sm md:text-lg font-bold">{team.draws}</td>
                  <td className="px-1 py-4 md:py-6 text-center">
                    <span className="text-red-500/80 font-black text-sm md:text-lg">{team.losses}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resumo de Gols (SG) */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/20">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Resumo de Gols</h3>
          </div>
          <div className="p-6 md:p-8 space-y-6 md:space-y-8">
            {stats.map((team) => (
              <div key={team.teamId} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white/20 flex-shrink-0 shadow-lg" style={{ backgroundColor: team.teamColor }} />
                  <span className="text-base md:text-xl font-black text-slate-100 truncate">{team.teamName}</span>
                </div>
                <div className="flex gap-4 md:gap-8 items-center flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[8px] md:text-xs text-slate-600 font-black uppercase">Pró/Contra</p>
                    <p className="text-sm md:text-xl text-slate-400 font-mono font-bold tracking-tighter">
                      {team.goalsFor}<span className="text-slate-700 mx-0.5">/</span>{team.goalsAgainst}
                    </p>
                  </div>
                  <div className={`w-10 md:w-12 text-center font-black text-lg md:text-2xl ${team.goalDifference > 0 ? 'text-emerald-500' : team.goalDifference < 0 ? 'text-red-500' : 'text-slate-600'}`}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aproveitamento (%) */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/20">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Eficiência</h3>
          </div>
          <div className="p-6 md:p-8 space-y-8 md:space-y-10">
            {stats.map((team) => {
                const totalPointsPossible = team.played * 3;
                const pct = totalPointsPossible === 0 ? 0 : Math.round((team.points / totalPointsPossible) * 100);
                return (
                    <div key={team.teamId} className="space-y-2 md:space-y-3">
                        <div className="flex justify-between items-end gap-2">
                            <span className="text-xs md:text-base font-black text-slate-400 uppercase truncate pr-4">{team.teamName}</span>
                            <span className="text-base md:text-xl font-black text-white">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-800/50 rounded-full h-2 md:h-3 overflow-hidden border border-white/5 p-0.5">
                            <div 
                                className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
                                style={{ 
                                  width: `${pct}%`, 
                                  backgroundColor: team.teamColor,
                                  opacity: pct === 0 ? 0.3 : 1
                                }}
                            />
                        </div>
                    </div>
                )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
