import React, { useState } from 'react';
import { Database, MapPin, DollarSign, CornerDownRight, Shield, ListFilter, Crosshair, HelpCircle } from 'lucide-react';
import { FIRCase } from '../types';
import { playTerminalBeep } from './AudioSynthesizer';

interface IntelligenceHUDProps {
  lang: 'EN' | 'KN';
  selectedCase: string;
  setSelectedCase: (id: string) => void;
  activeFIRDetails: FIRCase;
  MOCK_FIRS: FIRCase[];
}

export default function IntelligenceHUD({
  lang,
  selectedCase,
  setSelectedCase,
  activeFIRDetails,
  MOCK_FIRS
}: IntelligenceHUDProps) {
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');

  // Available districts for quick filter tab
  const districts = ['ALL', 'Hubballi', 'Bengaluru', 'Mysuru'];

  const filteredFirs = districtFilter === 'ALL' 
    ? MOCK_FIRS 
    : MOCK_FIRS.filter(f => f.district.toLowerCase() === districtFilter.toLowerCase());

  return (
    <div className="flex flex-col gap-6 font-sans text-[#00f0ff]" id="state-intelligence-desk-hud">
      
      {/* HUD HEADER TITLE (For Mobile viewports) */}
      <div className="lg:hidden flex items-center gap-2 border-b border-[#00f0ff]/30 pb-3 mb-2">
        <Shield className="w-6 h-6 text-[#ff007f] animate-pulse" />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#00f0ff] font-mono">
            {lang === 'EN' ? "RECORDS OFFICE & RADAR SATELLITE" : "ದಾಖಲೆ ಮತ್ತು ರಾಡಾರ್ ಇಂಟೆಲಿಜೆನ್ಸ್"}
          </h2>
          <p className="text-[10px] text-stone-400">STATE SECURE REGISTERED CRIME RECORDS BUREAU</p>
        </div>
      </div>

      {/* DOCK PANEL A: FIR INVENTORY DOSSIERS */}
      <div className="border-2 border-[#00f0ff]/40 bg-[#11111a]/95 p-4 rounded-md shadow-[0_0_15px_rgba(0,240,255,0.05)] flex flex-col gap-3">
        <div className="border-b border-[#00f0ff]/20 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs uppercase text-[#00f0ff] font-extrabold flex items-center gap-1.5 tracking-wider font-mono">
            <Database className="w-4 h-4 text-[#ff007f]" /> 
            {lang === 'EN' ? "STATE REGISTERED FIR INVENTORY" : "ದಾಖಲಾದ ಎಫ್ఐಆರ್ ಇಂಡೆಕ್ಸ್"}
          </h3>
          
          {/* Quick Filter pill selection */}
          <div className="flex gap-1 bg-black/60 p-0.5 border border-stone-800 rounded">
            {districts.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDistrictFilter(d);
                  playTerminalBeep('click');
                }}
                className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase transition-colors select-none ${
                  districtFilter === d 
                    ? 'bg-[#00f0ff] text-black font-extrabold' 
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        
        {/* Scrollable list search with elegant layout details */}
        <div className="flex flex-col gap-2 max-h-[190px] overflow-y-auto pr-1">
          {filteredFirs.map((fir) => {
            const isSelected = selectedCase === fir.id;
            return (
              <button
                key={fir.id}
                type="button"
                onClick={() => { 
                  setSelectedCase(fir.id); 
                  playTerminalBeep('click'); 
                }}
                className={`p-2.5 border text-left cursor-pointer transition-all rounded relative overflow-hidden active:scale-[0.99] ${
                  isSelected 
                    ? 'bg-[#00f0ff]/10 border-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.2)]' 
                    : 'bg-black/60 border-stone-800 hover:border-stone-600 font-mono'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white text-xs block font-mono">{fir.id}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 border rounded-sm font-semibold uppercase ${
                    fir.status === 'UNDER_INVESTIGATION' 
                      ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5' 
                      : fir.status === 'CHARGE_SHEETED' 
                      ? 'text-blue-400 border-blue-400/20 bg-blue-400/5' 
                      : 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                  }`}>
                    {fir.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-stone-400 font-sans mt-0.5">
                  <span className="font-bold text-[#00f0ff]/90">{fir.district} Division</span>
                  <span className="font-mono text-[9px]">{fir.date}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected case detail dossier sheet output */}
        <div className="p-3 border border-[#ff007f]/40 bg-black/80 rounded relative mt-1">
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#ff007f] rounded-full animate-ping" />
            <span className="text-[8px] text-[#ff007f] font-mono font-bold uppercase tracking-widest">{activeFIRDetails.status}</span>
          </div>

          <span className="text-[8px] text-[#ff007f] font-mono font-bold block uppercase tracking-wide">SELECTED DOSSIER:</span>
          <p className="text-white font-extrabold text-xs mt-1 font-mono">{activeFIRDetails.id} </p>
          <span className="text-[10px] text-yellow-400 font-bold block mb-1 uppercase font-mono tracking-tight">⊞ {activeFIRDetails.crimeCategory}</span>
          
          <div className="mt-2 text-stone-300 text-[11px] leading-relaxed select-text font-sans">
            <span className="text-stone-500 font-bold block text-[10px] font-mono">CRIME SYNOPSIS (MODUS OPERANDI):</span>
            "{activeFIRDetails.modusOperandi}"
          </div>

          <div className="mt-3.5 grid grid-cols-2 gap-2.5 text-[10px] border-t border-stone-800 pt-2.5 font-sans select-text">
            <div>
              <span className="text-stone-500 font-bold block font-mono text-[8px] uppercase">VICTIM INFORMATION:</span>
              <span className="text-[#00f0ff] font-bold block truncate pb-0.5">
                {activeFIRDetails.victimDetails.name}
              </span>
              <span className="text-stone-400 text-[9px] block">Age: {activeFIRDetails.victimDetails.age} | {activeFIRDetails.victimDetails.gender}</span>
            </div>
            <div>
              <span className="text-stone-500 font-bold block font-mono text-[8px] uppercase">ACCUSED SIGNATURE:</span>
              <span className="text-[#ff007f] font-bold block truncate pb-0.5">
                {activeFIRDetails.accusedDetails.name}
              </span>
              <span className="text-stone-400 text-[9px] block">History Count: {activeFIRDetails.accusedDetails.criminalHistoryCount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* DOCK PANEL B: GEOSPATIAL CRIME SATELLITE RADAR */}
      <div className="border-2 border-[#ff007f]/40 bg-[#11111a]/95 p-4 rounded-md shadow-[0_0_15px_rgba(255,0,127,0.05)] flex flex-col gap-3">
        <h3 className="text-xs uppercase text-[#ff007f] font-extrabold border-b border-[#ff007f]/20 pb-2 flex items-center gap-1.5 tracking-wider font-mono">
          <MapPin className="w-4 h-4 text-[#00f0ff]" /> 
          {lang === 'EN' ? "GEOSPATIAL COORDINATE RADAR" : "ಭೂ-ಅಪರಾಧ ನಕ್ಷೆ ರಾಡಾರ್"}
        </h3>

        {/* Micro Karnataka stylized district radar grid */}
        <div className="border border-stone-800 bg-black h-[145px] relative flex justify-center items-center overflow-hidden rounded">
          
          {/* Pulse scanline radial overlays */}
          <div className="absolute w-[160px] h-[160px] border border-[#ff007f]/10 rounded-full animate-ping pointer-events-none" />
          <div className="absolute w-[90px] h-[90px] border border-[#00f0ff]/10 rounded-full animate-pulse pointer-events-none" />
          
          {/* Grid lines coordinates mapping */}
          <div className="absolute inset-0 bg-[radial-gradient(#1d1d2f_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

          {/* Location markers map overlay */}
          {MOCK_FIRS.map((fir) => {
            const isSelected = selectedCase === fir.id;
            // Formulate coordinates relative to boundaries
            const xPct = 15 + ((fir.location.lng - 74) / 4) * 70;
            const yPct = 85 - ((fir.location.lat - 12) / 4) * 70;

            return (
              <button
                key={fir.id}
                type="button"
                title={`${fir.location.address} - Hotspot Category: ${fir.crimeCategory}`}
                onClick={() => { 
                  setSelectedCase(fir.id); 
                  playTerminalBeep('click'); 
                }}
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
                className={`absolute w-3.5 h-3.5 rounded-full cursor-pointer -translate-x-1/2 -translate-y-1/2 border transition-all hover:scale-130 flex items-center justify-center p-0 ${
                  isSelected 
                    ? 'bg-[#ff007f] border-white z-20 shadow-[0_0_10px_#ff007f]' 
                    : 'bg-black border-[#00f0ff] animate-pulse z-10 hover:border-white'
                }`}
              >
                <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#00f0ff]'}`} />
              </button>
            );
          })}

          <div className="absolute top-2 left-2 bg-black/75 px-1.5 py-0.5 border border-stone-800 text-[8px] uppercase tracking-wider text-[#00f0ff] font-mono rounded">
            KSP_SECURE_MAPPIN_RADAR
          </div>
        </div>

        {/* Live Coordinate telemetry readouts */}
        <div className="p-2.5 border border-stone-800 bg-black/40 rounded flex flex-col gap-1.5 text-xs font-mono select-text">
          <span className="text-[#00f0ff] font-bold block uppercase text-[8px] tracking-wider">TELEM COORDINATES DETECTED:</span>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-stone-500 block">LATITUDE VECTOR:</span>
              <span className="text-white font-bold">{activeFIRDetails.location.lat.toFixed(6)} N</span>
            </div>
            <div>
              <span className="text-stone-500 block">LONGITUDE VECTOR:</span>
              <span className="text-white font-bold">{activeFIRDetails.location.lng.toFixed(6)} E</span>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-1 text-[9px] text-stone-400 flex items-center gap-1 leading-tight font-sans">
            <Crosshair className="w-3.5 h-3.5 text-[#ff007f] shrink-0" />
            <span>Target: {activeFIRDetails.location.address}</span>
          </div>
        </div>

      </div>

      {/* DOCK PANEL C: TRANSACTION TRANSACTION LEDGER ROUTE */}
      <div className="border-2 border-[#00f0ff]/40 bg-[#11111a]/95 p-4 rounded-md shadow-[0_0_15px_rgba(0,240,255,0.05)] flex flex-col gap-3 mb-2">
        <h3 className="text-xs uppercase text-[#00f0ff] font-extrabold border-b border-[#00f0ff]/20 pb-2 flex items-center gap-1.5 tracking-wider font-mono">
          <DollarSign className="w-4 h-4 text-[#ff007f]" /> 
          {lang === 'EN' ? "LAUNDERING TRANSACTION LEDGER" : "ಹಣ ವರ್ಗಾವಣೆ ಶಂಕಾಸ್ಪದ ಜಾಲ"}
        </h3>

        {activeFIRDetails.financialActivity ? (
          <div className="flex flex-col gap-2.5">
            <div className="p-2.5 bg-black/60 border border-[#ff007f]/30 rounded flex justify-between items-center text-xs">
              <span className="font-bold text-stone-300">SUSPICIOUS LAUNDER FLAGGED:</span>
              <span className="text-[#ff007f] font-extrabold font-mono select-text text-xs tracking-wider">
                ₹ {activeFIRDetails.financialActivity.suspiciousAmount.toLocaleString()}
              </span>
            </div>

            <div className="text-xs">
              <span className="text-stone-500 font-bold block mb-1.5 text-[8.5px] uppercase font-mono">DECRYPTED TRANSACTION TRAIL (ZOHO BANKING CONDUITS):</span>
              <div className="flex flex-col gap-1.5 max-h-[125px] overflow-y-auto pr-1">
                {activeFIRDetails.financialActivity.transactionTrail.map((trail, index) => (
                  <div key={index} className="p-2 bg-[#09090e] border border-stone-800 rounded font-mono text-[9.5px] flex items-center gap-2 justify-between select-text group hover:border-[#ff007f]/30 transition-all">
                    <span className="text-[#00f0ff] truncate w-[75px] font-bold" title={trail.from}>{trail.from}</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#ff007f] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span className="text-yellow-400 truncate w-[75px] font-bold" title={trail.to}>{trail.to}</span>
                    <span className="text-white font-black shrink-0 font-sans">₹{(trail.amount / 1000).toFixed(0)}K</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-black/50 border border-stone-800 rounded text-center text-xs text-stone-500 italic leading-relaxed font-sans">
            NO ESCALATED SUSPICIOUS TRANSACTIONS DETECTED UNDER SELECTED FIR CASE.
          </div>
        )}
        
        <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-[9.5px] text-[#eab308] leading-tight flex gap-1.5 font-sans">
          <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>Biometric nodes and financial logs locked securely inside Catalyst encrypted cloud partition.</span>
        </div>
      </div>

    </div>
  );
}
