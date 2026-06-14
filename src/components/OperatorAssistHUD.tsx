import React from 'react';
import { Terminal, Copy, Send, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';
import { playTerminalBeep } from './AudioSynthesizer';

interface OperatorAssistHUDProps {
  lang: 'EN' | 'KN';
  onSelectPrompt: (prompt: string) => void;
}

export default function OperatorAssistHUD({ lang, onSelectPrompt }: OperatorAssistHUDProps) {
  const suggestions = lang === 'EN' ? [
    {
      label: "Show cases for Shiva",
      desc: "Retrieve incident profiles related to the suspect 'Shiva'",
      query: "Show cases for Shiva",
      badge: "Suspect Case"
    },
    {
      label: "Filter Bangalore FIRs",
      desc: "Fetch state databases for cases in Bangalore jurisdiction",
      query: "Find cases in Bangalore",
      badge: "Locality Sort"
    },
    {
      label: "Suspicious Money Launderers",
      desc: "Run tracing vector flags on high-value transaction routes",
      query: "Which cases have suspicious financial activity?",
      badge: "FinTracer"
    },
    {
      label: "Habitual repeat offenders",
      desc: "Display subjects with extreme recidivism risk weights",
      query: "Who are the repeat offenders?",
      badge: "Profile Matrix"
    }
  ] : [
    {
      label: "ಶಿವ ಅವರ ಪ್ರಕರಣಗಳು",
      desc: "ಶಿವ ಅವರಿಗೆ ಸಂಬಂಧಿಸಿದ FIR ವಿವರಗಳನ್ನು ಲೋಡ್ ಮಾಡಿ",
      query: "ಶಿವ ಅವರ ಕೇಸ್ ವಿವರಗಳನ್ನು ತೋರಿಸಿ",
      badge: "ವಿಚಾರಣೆ"
    },
    {
      label: "ಬೆಂಗಳೂರು ಪ್ರಕರಣಗಳು",
      desc: "ಬೆಂಗಳೂರು ವಿಭಾಗದಲ್ಲಿ ದಾಖಲಾದ ಪ್ರಕರಣಗಳ ಪಟ್ಟಿ",
      query: "ಬೆಂಗಳೂರಿನಲ್ಲಿ ನಡೆದ ಅಪರಾಧಗಳ ಮಾಹಿತಿ ಕೊಡಿ",
      badge: "ಜಿಲ್ಲಾ ವರದಿ"
    },
    {
      label: "ವಂಚನೆ ಪ್ರಕರಣಗಳು",
      desc: "ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ ಮತ್ತು ವಂಚನೆ ಜಾಲಗಳ ತನಿಖೆ",
      query: "ಹಣಕಾಸು ವಂಚನೆಯ ಪ್ರಕರಣಗಳ ಮಾಹಿತಿ ನೀಡಿ",
      badge: "ಹಣಕಾಸು ಡೀಕ್ರಿಪ್ಟ್"
    },
    {
      label: "ಅಪರಾಧಿಗಳ ಜಾಲ",
      desc: "ತಿರುಗಿ ಅಪರಾಧವೆಸಗುವ ಹಳೆ ವಂಚಕರ ಸಂಪೂರ್ಣ ವಿವರ",
      query: "ರಾಜ್ಯದ ಹಳೆಯ ಅಪರಾಧಿಗಳು ಯಾರಿದ್ದಾರೆ?",
      badge: "ಪ್ರೊಫೈಲ್ ಟ್ರ್ಯಾಕ್"
    }
  ];

  const handlePromptClick = (query: string) => {
    playTerminalBeep('success');
    onSelectPrompt(query);
  };

  return (
    <div className="bg-[#11111a]/95 border-2 border-[#00f0ff]/40 p-4 rounded-md shadow-[0_0_15px_rgba(0,240,255,0.1)] font-sans text-stone-200" id="operator-assistance-interactive-hub">
      <div className="flex items-center justify-between border-b border-[#00f0ff]/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#ff007f] animate-pulse" />
          <h4 className="text-xs font-bold tracking-widest text-[#00f0ff] uppercase font-mono">
            {lang === 'EN' ? "OPERATOR ASSIST CENTRE - QUICK DIRECT INJECT" : "ಸಹಾಯ ಕೇಂದ್ರ - ತ್ವರಿತ ಇಂಜೆಕ್ಷನ್"}
          </h4>
        </div>
        <span className="text-[10px] text-[#ff007f] font-mono font-bold uppercase flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#ff007f]" />
          ONLINE_COMPANION
        </span>
      </div>

      <p className="text-xs text-stone-300 leading-relaxed mb-3">
        {lang === 'EN' 
          ? "Unsure what to query? Click any prompt below to automatically populate the decrypter buffer and run a search on the State Records Bureau database." 
          : "ವಿಚಾರಣೆ ನಡೆಸಲು ಸೂಕ್ತ ಪ್ರಶ್ನೆ ಸಿಗುತ್ತಿಲ್ಲವೇ? ಕೆಳಗಿನ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡುವುದರ ಮೂಲಕ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಟರ್ಮಿನಲ್‌ನಲ್ಲಿ ಲೋಡ್ ಮಾಡಿ ಹುಡುಕಿ."}
      </p>

      {/* Suggested prompting capsules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePromptClick(item.query)}
            className="group flex flex-col text-left p-2.5 bg-black/60 border border-stone-800 hover:border-[#00f0ff] rounded transition-all cursor-pointer relative overflow-hidden active:scale-[0.98]"
          >
            {/* Hover overlay glow */}
            <div className="absolute inset-0 bg-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 rounded font-mono uppercase tracking-wider">
                {item.badge}
              </span>
              <span className="text-[9px] text-[#ff007f] opacity-0 group-hover:opacity-100 transition-all font-mono">Inlay &#187;</span>
            </div>

            <p className="text-xs font-bold text-white group-hover:text-[#00f0ff] transition-colors mb-1">
              "{item.label}"
            </p>
            <p className="text-[10px] text-stone-400 font-mono leading-tight">
              {item.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
