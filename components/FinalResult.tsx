
import React from 'react';
import { TeamStats } from '../types';

interface FinalResultProps {
  stats: TeamStats[];
  finalScores: { home: number | null; away: number | null };
  onUpdateFinalScore: (home: number | null, away: number | null) => void;
}

const FinalResult: React.FC<FinalResultProps> = ({ stats, finalScores, onUpdateFinalScore }) => {
  const topTwo = stats.slice(0, 2);
  const homeTeam = topTwo[0];
  const awayTeam = topTwo[1];

  const hasWinner = finalScores.home !== null && finalScores.away !== null;
  const winner = hasWinner 
    ? (finalScores.home! > finalScores.away! ? homeTeam : (finalScores.away! > finalScores.home! ? awayTeam : null))
    : null;

  return (
    <div className="bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 p-1 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.3)] animate-fadeIn mt-8">
      <div className="bg-slate-950 rounded-[22px] p-6 md:p-10 text-center relative overflow-hidden">
        {/* Efeito de luz de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-yellow-500/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-block p-4 rounded-full bg-slate-900 border-2 border-yellow-500/50 mb-4 shadow-xl">
            <span className="text-4xl">🏆</span>
          </div>
          
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-2 tracking-tighter uppercase">
            A GRANDE FINAL
          </h2>
          <p className="text-slate-400 mb-10 text-sm font-medium uppercase tracking-[0.2em]">O Confronto dos Gigantes</p>

          {/* Área do Jogo da Final */}
          <div className="max-w-2xl mx-auto bg-slate-900/40 border border-slate-800 rounded-3xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Time de Casa (1º Colocado) */}
              <div className="flex-1 flex flex-col items-center gap-3">
                <div 
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black shadow-lg transition-transform ${winner?.teamId === homeTeam.teamId ? 'scale-110 ring-4 ring-yellow-500 rotate-3' : ''}`}
                  style={{ backgroundColor: homeTeam.teamColor }}
                >
                  {homeTeam.teamName.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">{homeTeam.teamName}</h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">1º na Fase de Grupos</span>
              </div>

              {/* Placar Interativo */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={finalScores.home === null ? '' : finalScores.home}
                    onChange={(e) => onUpdateFinalScore(e.target.value === '' ? null : parseInt(e.target.value), finalScores.away)}
                    className="w-16 h-20 md:w-20 md:h-24 bg-slate-950 border-2 border-slate-700 rounded-2xl text-center text-4xl font-black text-yellow-400 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 outline-none transition-all shadow-inner"
                  />
                  <span className="text-3xl font-black text-slate-600">×</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={finalScores.away === null ? '' : finalScores.away}
                    onChange={(e) => onUpdateFinalScore(finalScores.home, e.target.value === '' ? null : parseInt(e.target.value))}
                    className="w-16 h-20 md:w-20 md:h-24 bg-slate-950 border-2 border-slate-700 rounded-2xl text-center text-4xl font-black text-yellow-400 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="px-4 py-1 bg-slate-800 rounded-full text-[10px] text-slate-400 font-bold uppercase mt-4">
                  Digite os gols para decidir o título
                </div>
              </div>

              {/* Time Visitante (2º Colocado) */}
              <div className="flex-1 flex flex-col items-center gap-3">
                <div 
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black shadow-lg transition-transform ${winner?.teamId === awayTeam.teamId ? 'scale-110 ring-4 ring-yellow-500 -rotate-3' : ''}`}
                  style={{ backgroundColor: awayTeam.teamColor }}
                >
                  {awayTeam.teamName.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">{awayTeam.teamName}</h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">2º na Fase de Grupos</span>
              </div>

            </div>
          </div>

          {/* Anúncio do Campeão */}
          {hasWinner && (
            <div className="animate-bounce-slow">
              {winner ? (
                <div className="py-6 px-10 bg-yellow-500/10 border border-yellow-500/30 rounded-full inline-flex flex-col items-center gap-2">
                  <span className="text-yellow-500 text-xs font-black uppercase tracking-[0.3em]">O Grande Campeão é</span>
                  <span className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
                    {winner.teamName}!
                  </span>
                </div>
              ) : (
                <div className="py-6 px-10 bg-slate-800 border border-slate-700 rounded-full inline-block">
                    <span className="text-white text-xl font-bold uppercase italic">Empate na Final! (Decisão nos Pênaltis)</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-12 flex justify-center gap-8 text-slate-500">
            <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-slate-400">Torneio Concluído</span>
                </div>
            </div>
            <div className="w-[1px] h-10 bg-slate-800"></div>
            <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Classificação</p>
                <span className="text-xs font-medium text-slate-400">Top 2 Selecionados</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `}</style>
    </div>
  );
};

export default FinalResult;
