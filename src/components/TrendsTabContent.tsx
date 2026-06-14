import React from 'react';
import { Activity, Clock, TrendingUp, Cpu, Info, Sliders, AlertTriangle } from 'lucide-react';
import { playTerminalBeep } from './AudioSynthesizer';

interface TrendsTabContentProps {
  lang: 'EN' | 'KN';
  forecastingMultiplier: number;
  setForecastingMultiplier: (val: number) => void;
  SPATIOTEMPORAL_CLUSTERS: { hours: string; title: string; primaryCategory: string }[];
  TIME_TRENDS_DATA: { month: string; cyber: number; burglary: number }[];
}

export default function TrendsTabContent({
  lang,
  forecastingMultiplier,
  setForecastingMultiplier,
  SPATIOTEMPORAL_CLUSTERS,
  TIME_TRENDS_DATA
}: TrendsTabContentProps) {
  
  // Custom interactive click handler for graphs to play satisfy retro tones
  const triggerGraphInfo = (month: string, cyber: number, burglary: number) => {
    playTerminalBeep('chirp');
  };

  return (
    <div className="flex flex-col gap-5 font-sans" id="trends-temporal-predictive-matrix">
      
      {/* Alert Ribbon */}
      <div className="flex justify-between items-center bg-[#ff007f]/15 p-3 border border-[#ff007f]/40 rounded-md text-xs">
        <span className="font-bold flex items-center gap-1.5 text-[#ff007f] font-mono tracking-wide uppercase">
          <Activity className="w-4 h-4 animate-ping" />
          {lang === 'EN' 
            ? "AI FORECAST ENGINE & MONTHLY TEMPORAL FLUX RATE (KSP SCRB PROJECT_Y)" 
            : "AI ಸಿಮ್ಯುಲೇಶನ್ ಇಂಜಿನ್ ಮತ್ತು ಮಾಸಿಕ ಅಪರಾಧ ಪ್ರವೃತ್ತಿಯ ಮುನ್ಸೂಚನೆ"}
        </span>
        <span className="text-[10px] bg-black text-[#ff007f] px-2 py-0.5 rounded border border-[#ff007f]/20 font-mono font-bold tracking-widest hidden md:inline">
          ZIA AUTO_ML ENGINE MODEL
        </span>
      </div>

      {/* Grid containing trends charting and dynamic sliders */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Visual Chart Panel (Column span 7 on md, full on mobile) */}
        <div className="md:col-span-7 bg-black/70 border border-[#00f0ff]/30 p-4 rounded-md flex flex-col justify-between min-h-[320px]">
          <div>
            <span className="text-xs text-white font-bold uppercase tracking-widest block border-b border-white/10 pb-1.5 mb-2 font-mono">
              {lang === 'EN' ? "Monthly Crime Dynamics" : "ಮಾಸಿಕ ಅಪರಾಧ ಸಂಪುಟ"} (CYBER vs BURGLARY)
            </span>
            <p className="text-[11px] text-stone-400 mb-4 leading-normal">
              {lang === 'EN' 
                ? "Compare local cyber crimes against physical burglaries across Bangalore sectors. Hover & click bars to audit coordinates." 
                : "ಬೆಂಗಳೂರು ವಿಭಾಗಗಳಲ್ಲಿ ಸ್ಥಳೀಯ ಸೈಬರ್ ಅಪರಾಧಗಳನ್ನು ಮತ್ತು ಮನೆ ಕಳ್ಳತನಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ."}
            </p>
          </div>

          {/* SVG representation for retro yet modern glowing chart layout */}
          <div className="relative py-2 flex-grow flex items-center justify-center">
            <svg className="w-full h-[180px] overflow-visible" viewBox="0 0 300 150">
              {/* Target lines and bounds */}
              <line x1="30" y1="10" x2="290" y2="10" stroke="#1d1d2f" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="60" x2="290" y2="60" stroke="#1d1d2f" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="110" x2="290" y2="110" stroke="#1d1d2f" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="130" x2="290" y2="130" stroke="#333" strokeWidth="1.5" />

              {TIME_TRENDS_DATA.map((t, idx) => {
                const xBase = 45 + idx * 40;
                // Height ratios based on max volume 280
                const cyberHeight = (t.cyber / 280) * 110;
                const burgHeight = (t.burglary / 280) * 110;

                return (
                  <g key={idx} className="group">
                    {/* Tooltip background on hover */}
                    <rect 
                      x={xBase - 10} 
                      y="5" 
                      width="35" 
                      height="120" 
                      fill="rgba(255,255,255,0.02)" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity rounded cursor-pointer"
                      onClick={() => triggerGraphInfo(t.month, t.cyber, t.burglary)}
                    />

                    {/* Cyber crimes (Cyan) */}
                    <rect 
                      x={xBase} 
                      y={130 - cyberHeight} 
                      width="10" 
                      height={Math.max(cyberHeight, 4)} 
                      fill="#00f0ff" 
                      className="hover:fill-[#00ffff] hover:brightness-125 cursor-pointer transition-all duration-200"
                      onClick={() => triggerGraphInfo(t.month, t.cyber, t.burglary)}
                      rx="1"
                    />

                    {/* Burglary (Magenta) */}
                    <rect 
                      x={xBase + 12} 
                      y={130 - burgHeight} 
                      width="10" 
                      height={Math.max(burgHeight, 4)} 
                      fill="#ff007f" 
                      className="hover:fill-[#ff00aa] hover:brightness-125 cursor-pointer transition-all duration-200"
                      onClick={() => triggerGraphInfo(t.month, t.cyber, t.burglary)}
                      rx="1"
                    />

                    {/* Month abbreviation labels */}
                    <text x={xBase + 11} y="145" fill="#a0aec0" fontSize="8" textAnchor="middle" className="font-mono text-[8px] tracking-tighter">
                      {t.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Color legends */}
          <div className="flex gap-4 text-[10px] uppercase border-t border-white/5 pt-2 justify-center font-mono">
            <span className="flex items-center gap-1.5 text-[#00f0ff] font-bold">
              <span className="w-2.5 h-2.5 bg-[#00f0ff] rounded" /> 
              {lang === 'EN' ? "CYBER OFFENSES" : "ಸೈಬರ್ ಹಾವಳಿ"}
            </span>
            <span className="flex items-center gap-1.5 text-[#ff007f] font-bold">
              <span className="w-2.5 h-2.5 bg-[#ff007f] rounded" /> 
              {lang === 'EN' ? "HOUSE BURGLARIES" : "ಮನೆ ಕಳ್ಳತನಗಳು"}
            </span>
          </div>
        </div>

        {/* Dynamic Forecaster Model Widget (Column span 5 on md) */}
        <div className="md:col-span-5 bg-[#11111a] border border-[#ff007f]/30 p-4 rounded-md flex flex-col justify-between min-h-[320px]">
          <div>
            <span className="text-xs text-[#ff007f] font-bold uppercase tracking-widest block border-b border-[#ff007f]/20 pb-1.5 mb-2 font-mono flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#ff007f]" />
              {lang === 'EN' ? "ZIA Predictive Threat Machine" : "ZIA ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮುನ್ಸೂಚನೆ"}
            </span>
            <p className="text-[11px] text-stone-400 mb-3 leading-normal">
              {lang === 'EN' 
                ? "Simulate regional stress parameters to calculate early-warning recidivism probabilities." 
                : "ಕಿರು ಪ್ರೊಬ್ಯಾಬಿಲಿಟಿ ಮತ್ತು ಮುನ್ನೆಚ್ಚರಿಕೆ ಅಂಕಗಳನ್ನು ಲೆಕ್ಕ ಮಾಡಲು ಸ್ಲೈಡರ್ ಹೊಂದಿಸಿ."}
            </p>
          </div>

          {/* Slider trigger element */}
          <div className="bg-black/60 p-3.5 border border-stone-800 rounded mb-3 flex flex-col gap-3">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-stone-300 font-medium">Threat Multiplier:</span>
                <span className="text-[#00f0ff] font-extrabold font-mono tracking-widest">
                  {forecastingMultiplier.toFixed(1)}x
                </span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.5" 
                step="0.1"
                value={forecastingMultiplier}
                onChange={(e) => { 
                  setForecastingMultiplier(parseFloat(e.target.value)); 
                  playTerminalBeep('click'); 
                }}
                className="w-full accent-[#ff007f] h-1.5 bg-stone-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* Calculations outputs */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2 border border-stone-800 bg-black/80 rounded">
                <span className="text-[9px] text-[#00f0ff] uppercase block font-bold font-mono">Bangalore Urban Risk</span>
                <span className="text-[#ff007f] font-black text-xs font-mono">
                  {(88 * forecastingMultiplier).toFixed(0)}%
                </span>
                <span className="text-[8px] text-stone-500 block">ELEVATED THREAT</span>
              </div>
              <div className="p-2 border border-stone-800 bg-black/80 rounded">
                <span className="text-[9px] text-[#ff007f] uppercase block font-bold font-mono">Coastal Area NH-66</span>
                <span className="text-[#00f0ff] font-black text-xs font-mono">
                  {(65 * forecastingMultiplier).toFixed(0)}%
                </span>
                <span className="text-[8px] text-stone-500 block">STANDARD RADAR</span>
              </div>
            </div>
          </div>

          {/* Static warning alerts */}
          <div className="p-3 bg-[#ff007f]/5 border border-[#ff007f]/30 rounded text-[11px] text-stone-300 leading-snug flex gap-2">
            <AlertTriangle className="w-5 h-5 text-[#ff007f] shrink-0 animate-pulse" />
            <div>
              <strong className="text-white uppercase text-[10px] block mb-0.5">PREDICTIVE ANOMALY SCENARIO:</strong>
              {lang === 'EN' 
                ? "Majestic junction burglaries probability rises by 24% after hours (02:00 - 04:00 AM) aligned with localized smart-grid outages." 
                : "ಸ್ಥಳೀಯ ಪವರ್ ಸ್ಥಗಿತಗಳ ಪಟ್ಟಿಯಂತೆ ಮೆಜೆಸ್ಟಿಕ್ ರೈಲ್ವೆ ನಿಲ್ದಾಣದ ಸುತ್ತ ಅಪರಾಧ ಸಂಭವಗಳು ಶೇಕಡಾ ೨೪ ಹೆಚ್ಚಾಗಿದೆ."}
            </div>
          </div>
        </div>

      </div>

      {/* Grid of Spatiotemporal Clusters */}
      <div className="border border-[#00f0ff]/20 bg-black/40 p-4 rounded-md">
        <div className="flex items-center gap-1.5 mb-3">
          <Clock className="w-4 h-4 text-[#00f0ff] animate-pulse" />
          <span className="text-xs text-[#00f0ff] font-bold uppercase tracking-widest font-mono">
            {lang === 'EN' ? "Active Criminology Hotspot Windows" : "ಸಕ್ರಿಯ ಅಪರಾಧ ಮುನ್ನೆಚ್ಚರಿಕೆ ಸಮಯಗಳು"}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SPATIOTEMPORAL_CLUSTERS.map((cur, i) => (
            <div key={i} className="p-3 bg-black/80 border border-stone-800 hover:border-[#ff007f]/50 transition-colors rounded flex flex-col justify-between h-[90px]">
              <div className="flex items-center gap-1 text-[9px] text-[#ff007f] font-bold font-mono uppercase">
                <Clock className="w-3 h-3 text-[#ff007f]" /> 
                {cur.hours}
              </div>
              <span className="text-white text-xs font-bold leading-tight line-clamp-1">{cur.title}</span>
              <span className="text-[9px] text-[#00f0ff] tracking-wider uppercase font-mono mt-1 font-bold">
                {cur.primaryCategory}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
