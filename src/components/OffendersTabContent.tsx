import React from 'react';
import { Shield, Sparkles, User, Users, AlertTriangle, CheckSquare, Target } from 'lucide-react';
import { OffenderProfile } from '../types';
import { playTerminalBeep } from './AudioSynthesizer';

interface OffendersTabContentProps {
  lang: 'EN' | 'KN';
  selectedOffender: string;
  setSelectedOffender: (id: string) => void;
  activeOffenderDetails: OffenderProfile;
  MOCK_OFFENDERS: OffenderProfile[];
}

export default function OffendersTabContent({
  lang,
  selectedOffender,
  setSelectedOffender,
  activeOffenderDetails,
  MOCK_OFFENDERS
}: OffendersTabContentProps) {
  return (
    <div className="flex flex-col gap-5 font-sans" id="habitual-offenders-radar-deck">
      
      {/* Alert Ribbon Header */}
      <div className="bg-[#ff007f]/10 border border-[#ff007f]/40 p-3 rounded-md text-xs flex justify-between items-center text-[#ff007f]">
        <span className="font-bold flex items-center gap-1.5 font-mono tracking-wide">
          <Shield className="w-4 h-4 animate-pulse text-[#ff007f]" />
          {lang === 'EN' 
            ? "HIGH-RISK HABITUAL OFFENDER REGISTRY MODULE" 
            : "ರಾಜ್ಯ ಕಾನೂನು ಸುವ್ಯವಸ್ಥೆ ಹಳೆ ಮತ್ತು ವಂಚಕ ಅಪರಾಧಿಗಳ ಪಟ್ಟಿ"}
        </span>
        <span className="text-[11px] bg-black text-[#00f0ff] font-mono px-2 py-0.5 rounded border border-[#00f0ff]/20 font-bold">
          {lang === 'EN' ? `SUBJECTS CLASSIFIED: ${MOCK_OFFENDERS.length}` : `ವಂಚಕ ಸಂಖ್ಯೆ: ${MOCK_OFFENDERS.length}`}
        </span>
      </div>

      {/* Selector pills list - Styled beautifully as a responsive grid or scrollable flexbox */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-[#00f0ff] font-mono font-bold uppercase tracking-wider block mb-1">
          {lang === 'EN' ? "Active Register Dossiers:" : "ನೋಂದಾಯಿತ ಅಪರಾಧಿ ಡೋಸಿಯರ್‌ಗಳು:"}
        </span>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-stone-800 pb-4">
          {MOCK_OFFENDERS.map((o) => {
            const isSelected = selectedOffender === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => { 
                  setSelectedOffender(o.id); 
                  playTerminalBeep('click'); 
                }}
                className={`flex flex-col p-2 border rounded text-left transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-[#ff007f]/10 border-[#ff007f] shadow-[0_0_8px_rgba(255,0,127,0.3)]'
                    : 'bg-black border-stone-800 text-stone-300 hover:border-stone-600'
                }`}
              >
                <div className="flex justify-between items-center gap-2 mb-1">
                  <span className="text-[8px] font-mono tracking-tighter text-stone-500 font-bold">{o.id}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#ff007f] animate-ping' : 'bg-stone-700'}`} />
                </div>
                <span className="text-xs font-black truncate text-white">{o.name}</span>
                <span className="text-[10px] truncate text-[#00f0ff] font-bold mt-0.5 font-mono">@{o.alias || "NO_ALIAS"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Selected Profile Grid (Clean and Legible) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Core Profile Card (Span 5) */}
        <div className="md:col-span-5 bg-black/60 border border-[#ff007f]/30 p-4 rounded-md flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[9px] text-[#ff007f] font-mono font-bold uppercase tracking-widest block mb-0.5">SUBJECT Dossier</span>
                <h4 className="text-sm font-black text-white uppercase tracking-wide">{activeOffenderDetails.name}</h4>
                <p className="text-xs text-stone-400 mt-1 font-mono">
                  Alias Sign: <span className="text-[#ff007f] font-bold">@{activeOffenderDetails.alias}</span>
                </p>
              </div>

              {/* Status Badge */}
              <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase border-2 rounded tracking-widest animate-pulse ${
                activeOffenderDetails.status === 'WANTED' 
                  ? 'bg-red-600 border-white text-white' 
                  : 'bg-[#ff007f]/10 border-[#ff007f] text-[#ff007f]'
              }`}>
                {activeOffenderDetails.status}
              </span>
            </div>

            {/* Circular Risk indicator wrapper */}
            <div className="p-3 bg-black/80 border border-stone-800 rounded flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center border-4 border-[#ff007f] text-[#ff007f] font-mono font-black text-sm rounded-full bg-black shadow-[0_0_8px_rgba(255,0,127,0.5)]">
                  {activeOffenderDetails.riskScore}%
                </div>
                <div>
                  <span className="text-[#ff007f] text-[9px] font-mono block font-black uppercase tracking-wider">RE-CUSTODY RISK</span>
                  <p className="text-[10px] text-stone-400 mt-0.5 font-sans leading-tight">
                    Simulated recidivism chance model
                  </p>
                </div>
              </div>
              <Target className="w-5 h-5 text-stone-600 shrink-0" />
            </div>

            {/* Modus Operandi block */}
            <div className="bg-[#11111a] border border-stone-800 p-2.5 rounded">
              <span className="text-[9.5px] text-[#00f0ff] font-mono font-bold block uppercase mb-1">
                PRIMARY MODUS OPERANDI (M.O.)
              </span>
              <p className="text-stone-300 text-[11.5px] leading-relaxed italic">
                "{activeOffenderDetails.primaryMO}"
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800 flex justify-between items-center text-[10px] font-mono text-stone-500 uppercase">
            <span>Dossier Reference ID:</span>
            <span className="text-white font-bold">{activeOffenderDetails.id}</span>
          </div>
        </div>

        {/* Behavioral Metrics Card (Span 7) */}
        <div className="md:col-span-7 bg-[#11111a] border border-[#00f0ff]/30 p-4 rounded-md flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            
            {/* Psychological traits */}
            <div>
              <span className="text-[9.5px] text-[#ff007f] font-mono font-bold block uppercase tracking-wider mb-1.5">
                Psychological and Behavioral Demeanour
              </span>
              <div className="flex flex-wrap gap-1.5 font-sans">
                {activeOffenderDetails.behavioralTraits.map((t, i) => (
                  <span 
                    key={i} 
                    className="bg-black text-[11px] border border-stone-800 hover:border-[#ff007f]/50 px-2.5 py-1 text-stone-300 rounded transition-colors"
                  >
                    • {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Sociological stressors */}
            <div>
              <span className="text-[9.5px] text-[#00f0ff] font-mono font-bold block uppercase tracking-wider mb-1.5">
                Sociological Risk Factor Triggers
              </span>
              <div className="flex flex-col gap-1.5">
                {activeOffenderDetails.socialRiskFactors.map((f, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-stone-300 font-sans">
                    <span className="text-[#00f0ff] font-mono font-bold text-xs mt-0.5">&#187;</span>
                    <p className="leading-normal">{f}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Allies and Crime Refs footer */}
          <div className="pt-4 mt-4 border-t border-stone-800 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-xs">
            <div>
              <span className="text-[8.5px] text-[#ff007f] font-mono block font-bold uppercase mb-1">
                SYNDICATE ACCOMPLICES / DIRECT ALLIES:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeOffenderDetails.allies.map((a, i) => (
                  <span 
                    key={i} 
                    className="bg-black text-[10px] text-[#00f0ff] font-mono font-bold border border-[#00f0ff]/20 px-2 py-0.5 rounded"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <span className="text-[8.5px] text-stone-500 font-mono block font-bold tracking-widest uppercase">
                Active Associated FIR:
              </span>
              <span className="text-white block font-mono font-black text-xs mt-0.5">
                {activeOffenderDetails.associatedCrimes.join(' | ')}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
