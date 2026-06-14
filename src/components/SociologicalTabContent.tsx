import React from 'react';
import { Activity, Sliders, Layers, TrendingUp, AlertCircle } from 'lucide-react';
import { playTerminalBeep } from './AudioSynthesizer';

interface SociologicalTabContentProps {
  lang: 'EN' | 'KN';
  urbanStressParam: number;
  setUrbanStressParam: (val: number) => void;
  SOCIOLOGICAL_INSIGHTS: { indicator: string; value: string; impactOnCrime: string; crimeCorrelation: 'Strong Positive' | 'Moderate Positive' | 'Negative' | 'Neutral' }[];
}

export default function SociologicalTabContent({
  lang,
  urbanStressParam,
  setUrbanStressParam,
  SOCIOLOGICAL_INSIGHTS
}: SociologicalTabContentProps) {
  return (
    <div className="flex flex-col gap-5 font-sans" id="sociological-correlation-deck">
      
      {/* Alert Ribbon Header */}
      <div className="bg-[#00f0ff]/10 border border-[#00f0ff]/40 p-3 rounded-md text-xs flex justify-between items-center text-[#00f0ff]">
        <span className="font-bold flex items-center gap-2 font-mono tracking-wide uppercase">
          <Activity className="w-4 h-4 animate-pulse text-[#00f0ff]" />
          {lang === 'EN' 
            ? "STATEWIDE SOCIOLOGICAL DEMOGRAPHIC INDICES vs CRIME TYPE" 
            : "ರಾಜ್ಯಾದ್ಯಂತ ಸಮಾಜಶಾಸ್ತ್ರೀಯ ಮತ್ತು ಜನಸಂಖ್ಯಾ ಸೂಚ್ಯಂಕ ಹೋಲಿಕೆ"}
        </span>
        <span className="text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/40 px-2 py-0.5 rounded font-mono font-bold tracking-widest hidden sm:inline uppercase">
          ZIA CORRELATION RATINGS
        </span>
      </div>

      {/* Modern Control Slider for Urban Expansion stress */}
      <div className="p-4 border border-[#00f0ff]/30 bg-black/70 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-xs text-[#00f0ff] font-bold uppercase tracking-wider font-mono">
            <Sliders className="w-4 h-4 text-[#ff007f]" />
            <span>PROACTIVE URBAN STRESS CORRELATOR MODEL</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1 leading-normal">
            {lang === 'EN' 
              ? "Slide to increment regional peripheral urban density multipliers, displaying simulated forecasting indices." 
              : "ನಗರ ಪ್ರದೇಶಗಳ ಜನಸಂಖ್ಯಾ ಒತ್ತಡದ ಮಲ್ಟಿಪ್ಲೈಯರ್ ಹಂತವನ್ನು ಹೆಚ್ಚಿಸಿ ಅಥವಾ ಕಡಿಮೆಮಾಡಿ."}
          </p>
        </div>
        
        {/* Responsive slider handler */}
        <div className="flex items-center gap-3 w-full sm:w-[260px] shrink-0">
          <input 
            type="range"
            min="10"
            max="90"
            value={urbanStressParam}
            onChange={(e) => { 
              setUrbanStressParam(parseInt(e.target.value)); 
              playTerminalBeep('click'); 
            }}
            className="flex-grow accent-[#ff007f] h-1.5 bg-stone-900 rounded-lg cursor-pointer"
          />
          <span className="bg-[#ff007f] text-white font-extrabold text-xs font-mono px-2 py-1 rounded shadow-[0_0_8px_rgba(255,0,127,0.4)] whitespace-nowrap shrink-0 select-none">
            +{urbanStressParam}% YoY Growth
          </span>
        </div>
      </div>

      {/* Main interactive grid of correlatives */}
      <div className="flex flex-col gap-3">
        {SOCIOLOGICAL_INSIGHTS.map((scale, i) => {
          const isElevated = urbanStressParam > 50;
          return (
            <div 
              key={i} 
              className="p-4 border border-stone-800 bg-[#11111a] hover:bg-black/60 hover:border-[#ff007f]/50 transition-all rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group"
            >
              {/* Highlight ribbon on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-stone-800 group-hover:bg-[#ff007f] transition-all" />

              <div className="md:w-1/3 flex flex-col">
                <span className="text-[9px] text-[#ff007f] font-mono font-bold uppercase tracking-wider mb-0.5">
                  INDICATOR MATRIX
                </span>
                <span className="text-white font-bold text-xs">{scale.indicator}</span>
                <span className="text-[#00f0ff] font-bold text-[11px] mt-1 font-mono tracking-wide">
                  Current Rank: {scale.value}
                </span>
              </div>

              <div className="flex-grow md:w-1/2 flex flex-col">
                <span className="text-[9px] text-stone-500 font-mono block mb-0.5">
                  SOCIOLOGICAL DIRECT IMPACT VECTOR
                </span>
                <p className="text-stone-300 text-xs leading-relaxed">
                  {scale.impactOnCrime} 
                  {isElevated && (
                    <span className="text-yellow-400 font-semibold ml-1">
                      (Bypass risk multiplier escalated under high urban stress velocity!)
                    </span>
                  )}
                </p>
              </div>

              <div className="md:w-[120px] shrink-0 md:text-right flex md:flex-col items-center md:items-end justify-between w-full border-t border-white/5 pt-2 md:pt-0 md:border-0">
                <span className="text-[9px] text-stone-500 font-mono uppercase block">Correlation Priority:</span>
                <span className={`font-mono text-xs font-bold uppercase mt-0.5 px-2 py-0.5 rounded text-[10px] ${
                  scale.crimeCorrelation === 'Strong Positive' 
                    ? 'bg-red-500/10 text-red-400 border border-red-400/20' 
                    : scale.crimeCorrelation === 'Moderate Positive'
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-400/20'
                    : 'bg-stone-800 text-stone-400 border border-stone-700/50'
                }`}>
                  {scale.crimeCorrelation}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
