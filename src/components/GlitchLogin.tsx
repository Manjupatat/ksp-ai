import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Terminal, 
  Cpu, 
  AlertTriangle, 
  Unlock, 
  Fingerprint, 
  Zap, 
  RefreshCw, 
  KeyRound, 
  HelpCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { playTerminalBeep } from './AudioSynthesizer';

interface GlitchLoginProps {
  onLoginSuccess: (operatorName: string) => void;
}

export default function GlitchLogin({ onLoginSuccess }: GlitchLoginProps) {
  const [operatorId, setOperatorId] = useState('IA-GOWDA-7301');
  const [accessCode, setAccessCode] = useState('');
  const [statusMsg, setStatusMsg] = useState('READY FOR IDENTITY HANDSHAKE...');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [glitchTrigger, setGlitchTrigger] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [serverMetrics, setServerMetrics] = useState({
    cpuLoad: 42.1,
    pingMs: 24,
    nodeStatus: 'STABLE_NODE'
  });

  // Periodically fluctuate server metrics for visual immersion
  useEffect(() => {
    const timer = setInterval(() => {
      setServerMetrics({
        cpuLoad: +(40 + Math.random() * 8).toFixed(2),
        pingMs: Math.floor(20 + Math.random() * 12),
        nodeStatus: Math.random() > 0.08 ? 'STABLE' : 'GLITCH_CORRECTED'
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Trigger occasional subtle screen glitch animations during login idle phase
  useEffect(() => {
    const timer = setInterval(() => {
      setGlitchTrigger(true);
      setTimeout(() => setGlitchTrigger(false), 300);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleKeyPress = () => {
    // Cyber keyboard touch sound feedback
    playTerminalBeep('click');
  };

  const executeSecurityHandshake = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticating) return;

    playTerminalBeep('chirp');
    setIsAuthenticating(true);
    setStatusMsg('ESTABLISHING QUANTUM HANDSHAKE... READING CREDENTIALS');

    setTimeout(() => {
      // Correct password
      if (accessCode.trim().toUpperCase() === 'KSP_SCRB_2026') {
        playTerminalBeep('success');
        setStatusMsg('IDENTITY APPROVED! ENCRYPTED DECRYPTION VECTOR UNLOCKED');
        setTimeout(() => {
          onLoginSuccess(operatorId);
        }, 1200);
      } else {
        // Failed attempt
        playTerminalBeep('warn');
        setFailedAttempts(prev => prev + 1);
        setGlitchTrigger(true);
        setTimeout(() => setGlitchTrigger(false), 450);
        
        const errors = [
          'ACCESS DENIED: SIGNATURE MISMATCH DETECTED',
          'INCORRECT PASSKEY. INCIDENT LOGGED TO SCRB SECURE SYSTEM',
          'ESTABLISHED SECURITY DISCREPANCY. RECONSTRUCT INTRUDER BLOCKS',
          'DECRYPTION CRITICAL FAILURE: UNAUTHORIZED OVERRIDE CODE'
        ];
        
        setStatusMsg(errors[Math.min(failedAttempts, errors.length - 1)]);
        setIsAuthenticating(false);
      }
    }, 1400);
  };

  const autoFillBypassCode = () => {
    playTerminalBeep('success');
    setAccessCode('KSP_SCRB_2026');
    setStatusMsg('SECURITY OVERRIDE DETECTED: KEYCODE CONJECTURED');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#050508] relative font-mono text-[#00f0ff] p-4 select-none overflow-hidden transition-all duration-300 ${
      glitchTrigger ? 'bg-red-950/20 scale-[0.99] border-red-500' : ''
    }`} id="custom-secure-login-gate">
      
      {/* Background Matrix/Space Dots Overlay */}
      <div className="absolute inset-0 bg-[#06060c] bg-[radial-gradient(#00f0ff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Extreme CRT Screen Glitch static layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ff007f]/5 via-transparent to-[#00f0ff]/5 opacity-20 pointer-events-none" />

      {/* Cybernetic Container Box */}
      <div className="w-full max-w-lg bg-[#0a0a14] border-2 border-[#00f0ff] relative p-6 md:p-8 shadow-[0_0_20px_rgba(0,240,255,0.15)] md:pb-6 transition-all duration-300">
        
        {/* Aesthetic Corner Brackets */}
        <div className="absolute -top-[3px] -left-[3px] w-4 h-4 border-t-4 border-l-4 border-[#ff007f]" />
        <div className="absolute -top-[3px] -right-[3px] w-4 h-4 border-t-4 border-r-4 border-[#ff007f]" />
        <div className="absolute -bottom-[3px] -left-[3px] w-4 h-4 border-b-4 border-l-4 border-[#ff007f]" />
        <div className="absolute -bottom-[3px] -right-[3px] w-4 h-4 border-b-4 border-r-4 border-[#ff007f]" />

        {/* Outer Banner Decals */}
        <div className="flex justify-between items-center pb-3 border-b-2 border-[#00f0ff]/30 mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#ff007f] animate-pulse" />
            <span className="text-[11px] font-black tracking-widest text-[#ff007f] uppercase">
              KSP_SCRB_CYBER_UNIT
            </span>
          </div>
          <div className="text-[10px] text-stone-500 font-mono tracking-widest">
            STATE_RECORDS_SEC_IV
          </div>
        </div>

        {/* Jarring Header Glitch Title */}
        <div className="text-center mb-8 relative">
          <h2 
            className="text-2xl md:text-3xl font-extrabold tracking-wider text-white uppercase glitch-text" 
            data-text="SECURE COGNITIVE TRACER"
          >
            GATE_AUTHENTICATOR
          </h2>
          <div className="text-[9px] text-[#00f0ff]/70 font-semibold uppercase tracking-[0.25em] mt-1.5 flex items-center justify-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 animate-spin text-[#00f0ff]" />
            ESTABLISH SCRB DECRYPTER SHELL SESSION
          </div>
        </div>

        {/* Core Auth Decrypted Form */}
        <form onSubmit={executeSecurityHandshake} className="flex flex-col gap-5">
          
          {/* Operator ID Section */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#ff007f] font-bold tracking-widest uppercase flex items-center justify-between">
              <span>[01] OPERATOR ID SIGNATURE</span>
              <span className="text-stone-500 font-normal">READ-ONLY</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-[11px] text-[#00f0ff]/50 font-bold">&#187;</span>
              <input 
                type="text" 
                value={operatorId}
                onChange={(e) => {
                  setOperatorId(e.target.value);
                  handleKeyPress();
                }}
                className="w-full bg-black border border-[#00f0ff]/40 focus:border-[#ff007f] text-[#00f0ff] font-bold text-xs pl-8 pr-4 py-3 outline-none focus:ring-0 transition-all uppercase"
                placeholder="OPERATOR_CODE_NAME"
                required
              />
            </div>
          </div>

          {/* Keycode Input Section */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#00f0ff] font-bold tracking-widest uppercase flex items-center justify-between">
              <span>[02] STATE APPARATUS SECURE KEYCODE</span>
              <button 
                type="button" 
                onClick={() => {
                  setShowHint(!showHint);
                  playTerminalBeep('click');
                }}
                className="text-[#ff007f] hover:underline cursor-pointer text-[9px] flex items-center gap-0.5 font-bold uppercase transition-all"
              >
                <HelpCircle className="w-3 h-3 text-[#ff007f]" />
                <span>NEED BYPASS?</span>
              </button>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-[11px] text-[#00f0ff]/50 font-bold">&#123;</span>
              <input 
                type="password" 
                value={accessCode} 
                onChange={(e) => {
                  setAccessCode(e.target.value);
                  handleKeyPress();
                }}
                className="w-full bg-black border border-[#00f0ff]/40 focus:border-[#ff007f] text-[#00f0ff] font-bold text-xs tracking-widest pl-8 pr-12 py-3 outline-none focus:ring-0 transition-all"
                placeholder="••••••••••••"
                required
              />
              <KeyRound className="absolute right-3.5 top-3 w-4 h-4 text-[#00f0ff]/30 pointer-events-none" />
            </div>
          </div>

          {/* Secure Decrypt Button */}
          <button 
            type="submit" 
            disabled={isAuthenticating}
            className={`w-full py-3.5 font-black uppercase text-xs tracking-wider cursor-pointer transition-all border-2 flex items-center justify-center gap-2 relative overflow-hidden ${
              isAuthenticating 
                ? 'bg-stone-900 border-stone-800 text-stone-500 cursor-not-allowed'
                : 'bg-transparent text-[#00f0ff] border-[#00f0ff] hover:bg-[#00f0ff]/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]'
            }`}
          >
            {isAuthenticating && (
              <RefreshCw className="w-4 h-4 animate-spin text-[#00f0ff]" />
            )}
            {!isAuthenticating && (
              <Unlock className="w-4 h-4 text-[#00f0ff]" />
            )}
            <span>{isAuthenticating ? 'INITIATING SYSTEM HANDSHAKE...' : 'DECRYPT SYSTEM SHELL'}</span>
          </button>
        </form>

        {/* Security Decrypt Hint Box */}
        {showHint && (
          <div className="mt-5 p-3 bg-[#ff007f]/5 border border-[#ff007f]/35 text-[10px] text-stone-300 relative font-mono transition-all duration-300">
            <div className="absolute top-1.5 right-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#ff007f] rounded-full animate-ping" />
              <span className="text-[#ff007f] text-[8px] tracking-widest uppercase font-bold">DECRYPTED INTEL</span>
            </div>
            <p className="font-bold text-[#ff007f] uppercase mb-1">BYPASS CRACK OBTAINED FROM RECENT STATE FORENSIC LOG:</p>
            <p className="text-stone-300 mb-2">Our quantum node intercept observed administrative access was granted in 2026 using keycode:</p>
            <div className="flex items-center gap-2 justify-between">
              <code className="text-yellow-400 bg-black px-2 py-0.5 border border-yellow-400/30 text-xs font-bold font-mono">
                KSP_SCRB_2026
              </code>
              <button 
                onClick={autoFillBypassCode} 
                className="px-2 py-1 bg-[#ff007f]/10 border border-[#ff007f]/50 hover:bg-[#ff007f] hover:text-white text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                AUTO_INJECT_KEY
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Intrusion Matrix Logs / Warning Status */}
        <div className={`mt-6 p-2.5 border text-[10px] font-mono flex items-center gap-2 uppercase tracking-wide transition-all ${
          failedAttempts > 0 
            ? 'border-red-500 bg-red-950/15 text-red-400 font-bold' 
            : 'border-[#00f0ff]/20 bg-black/50 text-[#00f0ff]/90'
        }`}>
          {failedAttempts === 0 ? (
            <Fingerprint className="w-4 h-4 text-[#00f0ff] animate-pulse" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
          )}
          <span className="flex-1 truncate">{statusMsg}</span>
          <span className="text-[9px] text-stone-500">ATTEMPTS_FAILED: {failedAttempts}</span>
        </div>

        {/* Real-time system telemetry parameters inside login UI */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[8.5px] text-stone-500 font-mono tracking-widest uppercase">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span>KSP_NODE: {serverMetrics.nodeStatus}</span>
          </div>
          <div>CPU_LOAD: {serverMetrics.cpuLoad}%</div>
          <div>PING_TELEMETRY: {serverMetrics.pingMs}ms</div>
        </div>

      </div>

    </div>
  );
}
