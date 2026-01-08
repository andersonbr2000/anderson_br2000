
import React, { useState } from 'react';
import { Team } from '../types';

interface ColorOption {
  name: string;
  hex: string;
}

const AVAILABLE_COLORS: ColorOption[] = [
  { name: 'Azul', hex: '#3b82f6' },
  { name: 'Amarelo', hex: '#eab308' },
  { name: 'Preto', hex: '#000000' },
  { name: 'Verde', hex: '#22c55e' },
  { name: 'Branco', hex: '#ffffff' },
];

const TeamSetup: React.FC<{ onSubmit: (teams: Team[]) => void }> = ({ onSubmit }) => {
  const [selections, setSelections] = useState<(ColorOption | null)[]>([null, null, null, null]);

  const handleSelectColor = (slotIdx: number, color: ColorOption) => {
    const newSelections = [...selections];
    newSelections[slotIdx] = color;
    setSelections(newSelections);
  };

  const isColorTaken = (hex: string) => {
    return selections.some(s => s?.hex === hex);
  };

  const handleSubmit = () => {
    if (selections.some(s => s === null)) {
      alert('Por favor, selecione uma cor para cada um dos 4 times.');
      return;
    }

    const finalTeams: Team[] = selections.map((s, idx) => ({
      id: `team-${idx}`,
      name: `Time ${s!.name}`,
      color: s!.hex
    }));

    onSubmit(finalTeams);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Definição de Times</h2>
        <p className="text-slate-500 text-sm font-medium tracking-wide">Selecione uma cor para cada equipe abaixo</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {selections.map((selectedColor, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-4">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Entrada {idx + 1}</span>
            
            {/* Caixa de Entrada Visual */}
            <div 
              className="w-full h-20 rounded-2xl flex items-center justify-center text-sm font-black uppercase tracking-widest transition-all duration-500 shadow-2xl border-2"
              style={{ 
                backgroundColor: selectedColor?.hex || 'rgba(15, 23, 42, 0.8)',
                borderColor: selectedColor ? selectedColor.hex : '#1e293b',
                color: selectedColor?.hex === '#ffffff' || selectedColor?.hex === '#eab308' ? '#0f172a' : '#ffffff',
                boxShadow: selectedColor ? `0 10px 40px ${selectedColor.hex}20` : 'none'
              }}
            >
              {selectedColor ? selectedColor.name : '---'}
            </div>

            {/* Seleção de Cores Abaixo */}
            <div className="flex gap-2.5 p-3 bg-slate-900/50 rounded-2xl border border-slate-800">
              {AVAILABLE_COLORS.map((c) => {
                const isSelectedInThisSlot = selectedColor?.hex === c.hex;
                const isTakenByOther = isColorTaken(c.hex) && !isSelectedInThisSlot;

                return (
                  <button
                    key={c.hex}
                    disabled={isTakenByOther}
                    onClick={() => handleSelectColor(idx, c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all transform hover:scale-125 active:scale-90
                      ${isSelectedInThisSlot ? 'border-white scale-110 ring-4 ring-white/10' : 'border-slate-700'}
                      ${isTakenByOther ? 'opacity-10 grayscale cursor-not-allowed' : 'opacity-100'}
                    `}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-6 bg-white text-black font-black rounded-2xl hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.3)] uppercase tracking-[0.2em] text-sm group"
      >
        Gerar Tabela de Confrontos
      </button>
    </div>
  );
};

export default TeamSetup;
