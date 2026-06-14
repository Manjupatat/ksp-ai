import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Volume2, 
  VolumeX, 
  Mic, 
  Download, 
  MapPin, 
  DollarSign, 
  Users, 
  User,
  Clock, 
  Activity, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  Send, 
  CornerDownRight, 
  Terminal, 
  Database,
  Layers,
  Cpu
} from 'lucide-react';
import { 
  MOCK_FIRS, 
  MOCK_OFFENDERS, 
  NETWORK_NODES, 
  NETWORK_LINKS, 
  SOCIOLOGICAL_INSIGHTS, 
  SYSTEM_AUDIT_LOGS, 
  TIME_TRENDS_DATA, 
  SPATIOTEMPORAL_CLUSTERS,
  BI_LINGUAL_TERMS,
  DISTRICTS_LIST
} from '../data/mockData';
import { FIRCase, OffenderProfile, NetworkNode, AuditLog, ChatMessage, Role, Language } from '../types';
import { playTerminalBeep } from './AudioSynthesizer';
import ForceDirectedNetwork from './ForceDirectedNetwork';

interface GlitchTerminalProps {
  operatorId?: string;
}

export default function GlitchTerminal({ operatorId = 'IA-GOWDA-7301' }: GlitchTerminalProps) {
  // Global App States
  const [activeTab, setActiveTab] = useState<'chat' | 'network' | 'trends' | 'sociological' | 'offenders' | 'audit'>('chat');
  const [role, setRole] = useState<Role>('INVESTIGATOR');
  const [lang, setLang] = useState<Language>('EN');
  
  // Custom Role Authentication Input Simulation
  const [authCode, setAuthCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [securityOverrideFlash, setSecurityOverrideFlash] = useState(false);
  
  // Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: "SYSTEM INITIALIZED: KSP COGNITIVE INTELLIGENCE TRACER ONLINE. REQUEST CRIME RECORD DECRYPTION SHELL. BOTH ENGLISH [EN] AND KANNADA [KN] INPUTS AND AUDIO SYNTHESIZERS DEPLOYED. HOW CAN I ASSIST YOUR SCRB VECTOR QUERY?",
      timestamp: new Date().toLocaleTimeString(),
      evidenceTrail: ["LOCAL_DB_DECRYPT", "INTELLIGENCE_NODE_INIT"]
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [explainTrails, setExplainTrails] = useState<string[]>([]);
  
  // Speech States
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Graphical Filter States
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<string>("FIR-2026-105");
  const [selectedOffender, setSelectedOffender] = useState<string>("OFF-8092");
  
  // Local Stats Slider state
  const [urbanStressParam, setUrbanStressParam] = useState<number>(34);
  const [forecastingMultiplier, setForecastingMultiplier] = useState<number>(1.2);
  
  // Audit Logs running memory state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SYSTEM_AUDIT_LOGS);

  // Auto Scroll Chat Ref
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle caching synthesis voices so they are available immediately
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        setSystemVoices(window.speechSynthesis.getVoices());
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Dynamically swap the initial welcome greeting when language changes
  useEffect(() => {
    setMessages(prev => 
      prev.map(m => {
        if (m.id === 'msg-init-1') {
          return {
            ...m,
            text: lang === 'KN' 
              ? "ಟರ್ಮಿನಲ್ ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಾರಂಭಗೊಂಡಿದೆ: ಕರ್ನಾಟಕ ಪೊಲೀಸ್ (KSP) ಸುಧಾರಿತ ಕಾಗ್ನಿಟಿವ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಸಿಸ್ಟಮ್ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿದೆ. ರಾಜ್ಯ ಅಪರಾಧ ದಾಖಲೆಗಳ ಬ್ಯೂರೋ (SCRB) ಡೇಟಾಬೇಸ್ ಸಕ್ರಿಯವಾಗಿದೆ. ಇಂಗ್ಲಿಷ ಮತ್ತು ಕನ್ನಡ ಧ್ವನಿ ಸಂಶ್ಲೇಷಣೆಯನ್ನು ಅಳವಡಿಸಲಾಗಿದೆ. ವಿಚಾರಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ."
              : "SYSTEM INITIALIZED: KSP COGNITIVE INTELLIGENCE TRACER ONLINE. REQUEST CRIME RECORD DECRYPTION SHELL. BOTH ENGLISH [EN] AND KANNADA [KN] INPUTS AND AUDIO SYNTHESIZERS DEPLOYED. HOW CAN I ASSIST YOUR SCRB VECTOR QUERY?"
          };
        }
        return m;
      })
    );
  }, [lang]);

  // Handle Speech Synthesis with Native Kannada Voice Mapping
  const handleTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        playTerminalBeep('glitch');
        return;
      }
      playTerminalBeep('voice-speak');
      setIsSpeaking(true);
      
      const cleanText = text.replace(/[*#`_\-\[\]]/g, ''); // strip markdown descriptors
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Fetch latest voices dynamically in case they weren't loaded in the state
      const currentAvailableVoices = window.speechSynthesis.getVoices();
      const voiceList = currentAvailableVoices.length > 0 ? currentAvailableVoices : systemVoices;

      // Determine target BCP-47 language tag dynamically from UI language selection state
      const targetLang = lang === 'KN' ? 'kn-IN' : 'en-IN';
      utterance.lang = targetLang;

      // Find best-matching voice for the target language selection
      const matchedVoice = voiceList.find(v => {
        const vl = v.lang.toLowerCase();
        const vn = v.name.toLowerCase();
        if (targetLang === 'kn-IN') {
          return vl === 'kn-in' || vl.startsWith('kn') || vn.includes('kannada');
        } else {
          return vl === 'en-in' || vn.includes('india') || vl.startsWith('en');
        }
      });

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        console.log(`Setting speech synthesis voice dynamically to: ${matchedVoice.name} (${matchedVoice.lang})`);
      } else {
        console.warn(`No explicit voice found for ${targetLang}. Relying on native browser language-based synthesis.`);
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
        playTerminalBeep('voice-end');
      };
      
      utterance.onerror = (e) => {
        console.error("Speech Synthesis error:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis not supported in this frame environment.");
    }
  };

  // Handle Speech Recognition (Microphone Voice Assistant)
  const handleSpeechInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("Browser lacks speech api layout.");
      playTerminalBeep('warn');
      return;
    }

    if (isRecording) {
      // Manual stop
      setIsRecording(false);
      return;
    }

    playTerminalBeep('voice-start');
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Select appropriate regional model lang
    if (lang === 'KN') {
      recognition.lang = 'kn-IN';
    } else {
      recognition.lang = 'en-IN';
    }

    recognition.onstart = () => {
      setIsRecording(true);
      setMicError(null);
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setInputVal(speechToText);
      playTerminalBeep('chirp');
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition error:", event);
      setMicError(`CRIT_ERR: ${event.error}`);
      setIsRecording(false);
      playTerminalBeep('glitch');
    };

    recognition.onend = () => {
      setIsRecording(false);
      playTerminalBeep('voice-end');
    };

    recognition.start();
  };

  // Sync role updates with simulated security logs
  const changeRoleAndLog = (newRole: Role) => {
    playTerminalBeep('click');
    setRole(newRole);
    
    const newLog: AuditLog = {
      timestamp: new Date().toISOString(),
      user: operatorId,
      role: newRole,
      action: "Access Role Elevation",
      details: `Infiltrated KSP SCRB decrypter nodes under role clearance: ${newRole}`,
      status: "ALLOWED"
    };

    setAuditLogs(prev => [newLog, ...prev]);

    // Role-based restrict demo alerts
    if (newRole === 'POLICYMAKER' && activeTab === 'chat') {
      triggerGlitchedWarningAlert();
    }
  };

  const triggerGlitchedWarningAlert = () => {
    setSecurityOverrideFlash(true);
    playTerminalBeep('glitch');
    setTimeout(() => {
      setSecurityOverrideFlash(false);
    }, 1500);
  };

  // Submit natural language or voice queries throughExpress Endpoint proxy to Gemini API
  const sendQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isQuerying) return;

    const userText = inputVal;
    setInputVal('');
    playTerminalBeep('chirp');

    const newUserMessage: ChatMessage = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsQuerying(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          chatHistory: messages.slice(-5), // Maintain sliding context window for memory
          language: lang
        })
      });

      const data = await response.json();
      
      const newAssistantMsg: ChatMessage = {
        id: `ast-msg-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString(),
        evidenceTrail: data.evidenceTrail || []
      };

      setMessages(prev => [...prev, newAssistantMsg]);
      
      if (data.evidenceTrail && data.evidenceTrail.length > 0) {
        setExplainTrails(data.evidenceTrail);
        playTerminalBeep('success');
      } else {
        playTerminalBeep('click');
      }

      // Add audit log for AI execution
      const newLog: AuditLog = {
        timestamp: new Date().toISOString(),
        user: `SCRB-TRANS-NODE`,
        role: role,
        action: "Explainable AI Query",
        details: `Decrypted query: "${userText.slice(0, 30)}..." and highlighted trails: ${JSON.stringify(data.evidenceTrail)}`,
        status: "ALLOWED"
      };
      setAuditLogs(prev => [newLog, ...prev]);

    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `ast-err-${Date.now()}`,
        sender: 'assistant',
        text: "CRITICAL FAILURE SECURING STREAM. RETRYING BRIDGE CONNECTION OVER LOCAL CIRCUITS.",
        timestamp: new Date().toLocaleTimeString(),
        evidenceTrail: ["DATABASE_LOCAL_FALLBACK"]
      };
      setMessages(prev => [...prev, errorMsg]);
      playTerminalBeep('warn');
    } finally {
      setIsQuerying(false);
    }
  };

  // Compile and Save Conversation transcript locally inside a simulated KSP official PDF/Doc
  const downloadSessionTranscript = () => {
    playTerminalBeep('success');
    
    // We render a beautiful, printable official-styled text transcript file which the user can save as PDF (using Print) or direct Text file
    let transcriptText = `========================================================================\n`;
    transcriptText += `      OFFICIAL TRANSCRIPT: KARNATAKA STATE POLICE (KSP)\n`;
    transcriptText += `      STATE CRIME RECORDS BUREAU (SCRB) COGNITIVE INTELLIGENCE REPORT\n`;
    transcriptText += `========================================================================\n`;
    transcriptText += `TIMEFRAME STAMP: ${new Date().toISOString()}\n`;
    transcriptText += `AUTHORIZED OFFICER ROLE CLASSIFICATION: ${role} MODE\n`;
    transcriptText += `ZOHO CATALYST ENCRYPTION SECURED: TRUE\n\n`;

    messages.forEach((m, idx) => {
      transcriptText += `[${idx + 1}] TIME: ${m.timestamp} - SENDER: ${m.sender.toUpperCase()}\n`;
      transcriptText += `CONTENT: ${m.text}\n`;
      if (m.evidenceTrail && m.evidenceTrail.length > 0) {
        transcriptText += `   EVIDENCE SOURCE REFERENCES: ${m.evidenceTrail.join(' | ')}\n`;
      }
      transcriptText += `------------------------------------------------------------------------\n`;
    });

    transcriptText += `\n====== END OF OFFICIAL LOGS. DO NOT LEAK SENSITIVE CRIME INTEL ======\n`;

    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KSP_SCRB_INTELLIGENCE_TRANSCRIPT_${role}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeBillingTerms = BI_LINGUAL_TERMS[lang];
  const activeFIRDetails = MOCK_FIRS.find(f => f.id === selectedCase) || MOCK_FIRS[0];
  const activeOffenderDetails = MOCK_OFFENDERS.find(o => o.id === selectedOffender) || MOCK_OFFENDERS[0];

  return (
    <div className="min-h-screen relative font-mono text-[#00f0ff] p-4 bg-[#09090e] crt-screen select-none">
      <div className="static-overlay" />

      {/* HEADER BAR */}
      <header className="border-b border-[#00f0ff]/40 pb-3 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
        <div className="relative">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#ff007f] animate-pulse" />
            <h1 className="text-xl md:text-2xl font-bold tracking-wider glitch-text text-white" data-text={activeBillingTerms.title}>
              {activeBillingTerms.title}
            </h1>
          </div>
          <p className="text-xs text-[#ff007f] font-mono mt-1 opacity-90 tracking-widest uppercase">
            {activeBillingTerms.subtitle}
          </p>
        </div>

        {/* Global Action Toggles (Language & Role Matrix) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Matrix Toggle */}
          <div className="flex border border-[#00f0ff]/50 bg-black">
            <button 
              onClick={() => { setLang('EN'); playTerminalBeep('click'); }} 
              className={`px-3 py-1 text-xs font-bold transition-all ${lang === 'EN' ? 'bg-[#00f0ff] text-black font-extrabold' : 'hover:bg-[#00f0ff]/10 text-[#00f0ff]'}`}
            >
              EN
            </button>
            <button 
              onClick={() => { setLang('KN'); playTerminalBeep('click'); }} 
              className={`px-3 py-1 text-xs font-bold transition-all ${lang === 'KN' ? 'bg-[#00f0ff] text-black font-extrabold' : 'hover:bg-[#00f0ff]/10 text-[#00f0ff]'}`}
            >
              ಕನ್ನಡ (KN)
            </button>
          </div>

          {/* Secure Role Decrypt Matrix */}
          <div className="flex items-center gap-2 border border-[#ff007f]/50 px-2 py-1 bg-black/60">
            <span className="text-[10px] text-[#ff007f] font-semibold tracking-wider hidden sm:inline">
              {activeBillingTerms.rolesSelect}
            </span>
            <select 
              value={role} 
              onChange={(e) => changeRoleAndLog(e.target.value as Role)}
              className="bg-black text-[#ff007f] text-xs font-bold border-none outline-none cursor-pointer focus:ring-0"
            >
              <option value="INVESTIGATOR">IA SECURE (INVESTIGATOR)</option>
              <option value="ANALYST">SCRB DATA (ANALYST)</option>
              <option value="SUPERVISOR">POLICE COMMAND (SUPERVISOR)</option>
              <option value="POLICYMAKER">STATE POLICY (POLICYMAKER)</option>
            </select>
          </div>

          {/* Core Zoho Catalyst Sync Telemetry Node */}
          <div className="flex items-center gap-1.5 border border-[#00f0ff]/30 px-3 py-1 bg-black/40 text-[11px]">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> CATALYST SYNCED
            </span>
          </div>
        </div>
      </header>

      {/* SECURE OVERRIDE FLASH ALARM */}
      {securityOverrideFlash && (
        <div className="mb-4 p-3 bg-[#ff007f] border-2 border-white text-white font-bold text-center flex items-center justify-center gap-2 uppercase animate-bounce">
          <AlertTriangle className="w-6 h-6 animate-ping" /> SYSTEM CRITICAL WARNING: ENHANCED CYBERSECURITY SCREEN ACTIVE FOR POLICY LEVEL CLASSIFICATION
        </div>
      )}

      {/* CORE SHELL NAVIGATION BAR */}
      <nav className="flex flex-wrap gap-2 mb-6">
        {[
          { tabName: 'chat', label: activeBillingTerms.chatTab, icon: Terminal },
          { tabName: 'network', label: activeBillingTerms.networkTab, icon: Users },
          { tabName: 'trends', label: activeBillingTerms.patternTab, icon: TrendingUp },
          { tabName: 'sociological', label: activeBillingTerms.socioTab, icon: Layers },
          { tabName: 'offenders', label: activeBillingTerms.profileTab, icon: Shield },
          { tabName: 'audit', label: activeBillingTerms.auditTab, icon: Shield },
        ].map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.tabName;
          return (
            <button
              key={item.tabName}
              onClick={() => { playTerminalBeep('click'); setActiveTab(item.tabName as any); }}
              className={`flex items-center gap-2 px-4 py-2 border text-xs tracking-wider uppercase transition-all font-bold ${
                isActive 
                  ? 'bg-[#ff007f] border-[#ff007f] text-white shadow-[0_0_12px_rgba(255,0,127,0.8)]' 
                  : 'bg-[#11111a] border-[#00f0ff]/30 hover:border-[#00f0ff]/90 text-[#00f0ff]'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* MAIN RETRO CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* VIEWPORTS / TABS PANELS (8 cols on lg) */}
        <section className="lg:col-span-8 border-2 border-[#00f0ff]/50 bg-[#11111a]/80 p-5 min-h-[580px] relative flex flex-col justify-between">
          <div className="absolute top-2 right-2 flex items-center gap-2 text-[10px] text-[#00f0ff]/50 font-mono">
            <span>GRID-REF-PORT_A</span>
            <div className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-ping" />
          </div>

          {/* TAB 1: CONVERSATIONAL CRIME INTELLIGENCE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full justify-between gap-4">
              
              {/* Active System Mode Description Bar */}
              <div className="bg-[#ff007f]/10 border border-[#ff007f]/40 p-2 text-xs flex justify-between items-center">
                <span className="text-[#ff007f] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 animate-pulse" /> [ACTIVE COGNITIVE RADAR]: ENGLISH-KANNADA AUTO-TRANSLATION MATRIX SECURED
                </span>
                <span className="text-xs text-stone-400 font-mono">MESSAGES LOADED: {messages.length}</span>
              </div>

              {/* Chat Window */}
              <div className="border border-[#00f0ff]/30 bg-black/80 p-4 h-[390px] overflow-y-auto flex flex-col gap-4 relative">
                {/* Visual sci-fi watermarks */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:100%_16px] pointer-events-none" />
                
                {messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={`p-3.5 max-w-[85%] relative border font-mono transition-all duration-300 ${
                      m.sender === 'user' 
                        ? 'bg-[#00f0ff]/10 border-[#00f0ff]/80 self-end text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.15)] md:mr-1' 
                        : 'bg-[#ff007f]/5 border-[#ff007f]/40 self-start text-stone-200 shadow-[0_0_8px_rgba(255,0,127,0.1)] md:ml-1'
                    }`}
                  >
                    {/* Retro Corner brackets to make it look extremely high-tech and crafted */}
                    <div className="absolute -top-[1.5px] -left-[1.5px] w-2 h-2 border-t-2 border-l-2 border-inherit" />
                    <div className="absolute -top-[1.5px] -right-[1.5px] w-2 h-2 border-t-2 border-r-2 border-inherit" />
                    <div className="absolute -bottom-[1.5px] -left-[1.5px] w-2 h-2 border-b-2 border-l-2 border-inherit" />
                    <div className="absolute -bottom-[1.5px] -right-[1.5px] w-2 h-2 border-b-2 border-r-2 border-inherit" />

                    <div className="flex justify-between items-center gap-2 border-b border-white/10 pb-1.5 mb-2.5 text-[9px] font-bold tracking-widest opacity-80 select-none">
                      <span className="flex items-center gap-1.5 uppercase font-mono">
                        {m.sender === 'user' ? (
                          <>
                            <User className="w-3.5 h-3.5 text-[#00f0ff]" />
                            <span className="text-[#00f0ff]">INVESTIGATOR // ADMIN</span>
                          </>
                        ) : (
                          <>
                            <Terminal className="w-3.5 h-3.5 text-[#ff007f] animate-pulse" />
                            <span className="text-[#ff007f]">KSP_AI_COGNITIVE // RESPONSE</span>
                          </>
                        )}
                      </span>
                      <span className="text-stone-500 font-mono">{m.timestamp}</span>
                    </div>

                    <p className="font-mono whitespace-pre-wrap leading-relaxed text-xs sm:text-xs tracking-wide selection:bg-[#ff007f] selection:text-white">{m.text}</p>

                    {/* Speech synthesis prompt read button */}
                    {m.sender === 'assistant' && (
                      <button 
                        onClick={() => handleTTS(m.text)}
                        className={`mt-3 flex items-center gap-2 text-[9px] px-2 py-1 border font-bold transition-all duration-300 uppercase select-none ${
                          isSpeaking 
                            ? 'bg-[#ff007f] border-[#ff007f] text-white shadow-[0_0_10px_#ff007f]' 
                            : 'border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]'
                        }`}
                      >
                        {isSpeaking ? (
                          <div className="flex items-center gap-1.5">
                            <VolumeX className="w-3.5 h-3.5 text-white animate-spin" />
                            <span>{activeBillingTerms.ttsActive}</span>
                            
                            {/* Animated digital vocal frequencies rendering */}
                            <div className="flex items-end gap-[1.5px] h-3.5 ml-2">
                              <span className="w-[1.5px] bg-white animate-[bar-wave_0.7s_infinite_ease-in-out]" style={{ animationDelay: '0.1s' }} />
                              <span className="w-[1.5px] bg-white animate-[bar-wave_0.9s_infinite_ease-in-out]" style={{ animationDelay: '0.3s' }} />
                              <span className="w-[1.5px] bg-white animate-[bar-wave_0.6s_infinite_ease-in-out]" style={{ animationDelay: '0.5s' }} />
                              <span className="w-[1.5px] bg-white animate-[bar-wave_0.8s_infinite_ease-in-out]" style={{ animationDelay: '0.2s' }} />
                              <span className="w-[1.5px] bg-white animate-[bar-wave_0.4s_infinite_ease-in-out]" style={{ animationDelay: '0.4s' }} />
                            </div>
                          </div>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                            <span>{activeBillingTerms.ttsIdle}</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Grounded Evidence trail callouts */}
                    {m.evidenceTrail && m.evidenceTrail.length > 0 && (
                      <div className="mt-3.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5 select-none text-[9px]">
                        <span className="uppercase tracking-widest text-[#ff007f] font-extrabold text-[8px] mr-1">Evidence Records Link:</span>
                        {m.evidenceTrail.map((ev, i) => (
                          <span 
                            key={i} 
                            onClick={() => {
                              playTerminalBeep('click');
                              // If it is an FIR, let the investigator select it instantly
                              if (ev.startsWith("FIR")) {
                                setSelectedCase(ev);
                              }
                            }}
                            className="bg-black text-[9px] text-[#00f0ff] border border-[#00f0ff]/40 hover:border-[#ff007f] hover:text-[#ff007f] px-2 py-0.5 font-bold transition-all duration-200 cursor-pointer shadow-[0_0_4px_rgba(0,240,255,0.05)]"
                          >
                            ⊞ {ev}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isQuerying && (
                  <div className="p-3 bg-[#eab308]/10 border border-[#eab308]/50 self-start text-xs font-bold max-w-[65%] text-[#eab308] animate-pulse flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#eab308] rounded-full animate-ping" />
                    <span className="font-mono tracking-widest text-[10px]">DECRYPTING SECURE KSP DATA TRACES_</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Bot Input & Voice Controls */}
              <div className="border-t border-[#00f0ff]/30 pt-4 bg-black/25">
                {micError && (
                  <div className="bg-red-500/10 border border-red-500/40 p-2 text-[10px] text-red-400 font-bold mb-3 uppercase tracking-widest animate-pulse">
                    ⚠️ CORE INPUT WARN: {micError}
                  </div>
                )}
                
                <form onSubmit={sendQuery} className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder={isRecording 
                        ? (lang === 'EN' ? "🎙️ SYSTEM LISTENING... INTRODUCE YOUR ENGLISH QUERY NOW_" : "🎙️ ಸಿಸ್ಟಮ್ ಆಲಿಸುತ್ತಿದೆ... ನಿಮ್ಮ ಕನ್ನಡ ಧ್ವನಿ ಪ್ರಶ್ನೆಯನ್ನು ಈಗ ಹೇಳಿ_")
                        : (lang === 'EN' ? "QUERY CRIME RECOGNITION DATABASE (e.g. 'Show cases for Shiva')" : "ಹುಬ್ಬಳ್ಳಿ ಅಥವಾ ಬೆಂಗಳೂರ ಕೇಸ್ ವಿವರ ಹೇಳಿ... (e.g. 'ಎಫ್ಐಆರ್ 102 ತಿಳಿಸಿ')")}
                      className={`w-full bg-black border-2 px-4 py-2.5 text-xs focus:ring-0 focus:outline-none transition-all shadow-[inset_0_0_8px_rgba(0,240,255,0.05)] ${
                        isRecording 
                          ? 'border-[#ff007f] text-[#ff007f] placeholder-[#ff007f]/50 animate-pulse' 
                          : 'border-[#00f0ff]/40 focus:border-[#ff007f] text-[#00f0ff] placeholder-[#00f0ff]/40'
                      }`}
                    />
                    <div className="absolute right-3 top-2.5 text-[8px] text-[#00f0ff]/40 font-mono tracking-widest uppercase hidden lg:block">
                      {isRecording ? "REC_ACTIVE" : "Term_Ctrl"}
                    </div>
                  </div>

                  {/* VOICE RECORDER CONTROLS */}
                  <div className="flex flex-wrap gap-2">
                    <button 
                      type="button"
                      onClick={handleSpeechInput}
                      className={`px-4 py-2.5 border text-xs flex items-center gap-2 transition-all duration-300 font-bold cursor-pointer uppercase ${
                        isRecording 
                          ? 'bg-[#ff007f] border-[#ff007f] text-white animate-pulse shadow-[0_0_12px_rgba(255,0,127,0.8)]' 
                          : 'bg-black border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]'
                      }`}
                      title="Dictate in regional voice (Kannada or English)"
                    >
                      {isRecording ? (
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                          <Mic className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <Mic className="w-4 h-4 text-[#00f0ff]" />
                      )}
                      <span>
                        {isRecording ? activeBillingTerms.voiceButtonActive : activeBillingTerms.voiceButtonIdle}
                      </span>
                    </button>

                    <button 
                      type="submit"
                      disabled={isQuerying || !inputVal.trim()}
                      className="px-5 py-2.5 bg-[#00f0ff]/10 border-2 border-[#00f0ff] text-[#00f0ff] font-extrabold text-xs hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_12px_rgba(0,240,255,0.6)] cursor-pointer transition-all duration-300 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="w-3.5 h-3.5" /> SEND
                    </button>

                    {/* PDF Export trigger */}
                    <button 
                      type="button"
                      onClick={downloadSessionTranscript}
                      className="px-4 py-2.5 bg-[#ff007f]/5 border-2 border-[#ff007f]/60 text-[#ff007f] font-bold text-xs hover:bg-[#ff007f] hover:text-white hover:shadow-[0_0_12px_rgba(255,0,127,0.4)] cursor-pointer transition-all duration-300 flex items-center gap-1.5"
                      title="Compile & Download decrypted transcripts"
                    >
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* TAB 2: CRIMINAL LINK RELATIONSHIP GRAPH */}
          {activeTab === 'network' && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#00f0ff]/10 border border-[#00f0ff]/40 p-2 text-xs flex justify-between items-center text-[#00f0ff]">
                <span className="font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse text-[#00f0ff]" /> ASSOCIATIVE DECRYPTED NETWORK GEOMETRY (INTERACTIVE FORCE-DIRECTED LAYOUT)
                </span>
                <span className="text-[10px] bg-[#ff007f] text-white px-2 py-0.5 rounded flex items-center">ZOHO VECTOR GRAPH</span>
              </div>

              <ForceDirectedNetwork 
                nodes={NETWORK_NODES}
                links={NETWORK_LINKS}
                onSelectNode={setSelectedNode}
                selectedNodeId={selectedNode}
              />
            </div>
          )}

          {/* TAB 3: SPATIOTEMPORAL TRENDS & FORECAST */}
          {activeTab === 'trends' && (
            <div className="flex flex-col gap-5">
              
              <div className="flex justify-between items-center bg-[#ff007f]/15 p-2 border border-[#ff007f]/40 text-xs">
                <span className="font-bold flex items-center gap-1.5 text-[#ff007f]">
                  <Activity className="w-4 h-4 animate-ping" /> AI FORECAST ENGINE & MONTHLY TEMPORAL FLUX RATE (KSP SCRB PROJECT_Y)
                </span>
                <span className="text-[10px] text-stone-300">ZIA AUTO_ML ENGINE MODEL ENABLED</span>
              </div>

              {/* Dynamic SVGs for Custom Cyberpunk Glow Graphs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Visual Chart 1: Cyber crimes vs Burglaries Monthly Trends */}
                <div className="border border-[#00f0ff]/30 bg-black/60 p-3 h-[280px] flex flex-col justify-between">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block border-b border-white/10 pb-1.5 mb-2">
                    Monthly Crime Volume (CYBER vs BURGLARY)
                  </span>

                  {/* Draw simple, responsive raw styled bar plot to avoid Recharts compile quirks */}
                  <svg className="w-full h-[210px]" viewBox="0 0 300 200">
                    {/* Gridlines */}
                    <line x1="30" y1="20" x2="290" y2="20" stroke="#1d1d2f" strokeDasharray="2" />
                    <line x1="30" y1="80" x2="290" y2="80" stroke="#1d1d2f" strokeDasharray="2" />
                    <line x1="30" y1="140" x2="290" y2="140" stroke="#1d1d2f" strokeDasharray="2" />
                    <line x1="30" y1="170" x2="290" y2="170" stroke="#1d1d2f" />

                    {/* Bars based on month data */}
                    {TIME_TRENDS_DATA.map((t, idx) => {
                      const xBase = 45 + idx * 40;
                      // Max val around 270, height scale 150
                      const cyberHeight = (t.cyber / 280) * 150;
                      const burgHeight = (t.burglary / 280) * 150;

                      return (
                        <g key={idx}>
                          {/* Cyber crime (Cyan) */}
                          <rect 
                            x={xBase} 
                            y={170 - cyberHeight} 
                            width="10" 
                            height={cyberHeight} 
                            fill="#00f0ff" 
                            className="hover:opacity-80 cursor-pointer"
                          />
                          {/* Burglary (Magenta) */}
                          <rect 
                            x={xBase + 12} 
                            y={170 - burgHeight} 
                            width="10" 
                            height={burgHeight} 
                            fill="#ff007f"
                            className="hover:opacity-80 cursor-pointer"
                          />
                          <text x={xBase + 5} y="185" fill="#00f0ff" fontSize="8" textAnchor="middle" className="font-mono">
                            {t.month}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Legend */}
                  <div className="flex gap-4 text-[9px] uppercase border-t border-white/5 pt-1.5 justify-center">
                    <span className="flex items-center gap-1 text-[#00f0ff] font-bold"><span className="w-2 h-2 bg-[#00f0ff]" /> CYBER CRIMES</span>
                    <span className="flex items-center gap-1 text-[#ff007f] font-bold"><span className="w-2 h-2 bg-[#ff007f]" /> HOUSE BURGLARY</span>
                  </div>
                </div>

                {/* Interactive Dynamic Forecasting Machine widget */}
                <div className="border border-[#ff007f]/30 bg-black/60 p-3 h-[280px] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#ff007f] font-bold uppercase tracking-widest block border-b border-[#ff007f]/20 pb-1.5 mb-2">
                      ZIA Early-Warning Hotspot Risk Forecaster (3-Months Out)
                    </span>
                    <p className="text-[9px] text-stone-400 mb-3">Adjust simulated forecast variables to run early warning risk scores:</p>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col gap-4 bg-black/40 p-3 border border-stone-800">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>Regional Heat Multiplier</span>
                        <span className="text-[#00f0ff] font-bold">{forecastingMultiplier.toFixed(1)}x Risk</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2.5" 
                        step="0.1"
                        value={forecastingMultiplier}
                        onChange={(e) => { setForecastingMultiplier(parseFloat(e.target.value)); playTerminalBeep('click'); }}
                        className="w-full accent-[#ff007f]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2 border border-stone-800 bg-black">
                        <span className="text-[8px] text-stone-500 block">Bangalore Urban Risk</span>
                        <span className="text-[#ff007f] font-bold font-mono">{(88 * forecastingMultiplier).toFixed(0)}% HIGH ALERT</span>
                      </div>
                      <div className="p-2 border border-stone-800 bg-black">
                        <span className="text-[8px] text-stone-500 block">Maritime NH-66 Risk</span>
                        <span className="text-[#00f0ff] font-bold font-mono">{(65 * forecastingMultiplier).toFixed(0)}% WARNING</span>
                      </div>
                    </div>
                  </div>

                  {/* Critical Warning Forecast alert */}
                  <div className="p-2 bg-[#ff007f]/10 border border-[#ff007f]/40 text-[9px] text-stone-300">
                    <span className="text-[#ff007f] font-bold uppercase">PREDICTIVE ANOMALY ALERT:</span> Escalated risk identified around Majestic rail intersection for burglaries between hours (02:00-04:00 AM) based on historical KPTCL power cuts.
                  </div>
                </div>

              </div>
              
              {/* Spatiotemporal Cluster table overlay */}
              <div className="border border-[#00f0ff]/30 p-3">
                <span className="text-[10px] text-[#00f0ff] font-bold uppercase tracking-wider block mb-2">Spatiotemporal Temporal Hotspot Windows</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  {SPATIOTEMPORAL_CLUSTERS.map((cur, i) => (
                    <div key={i} className="p-2 bg-black/60 border border-stone-800 flex flex-col justify-between h-[85px]">
                      <div className="flex items-center gap-1.5 text-[9px] text-[#ff007f] font-bold">
                        <Clock className="w-3.5 h-3.5" /> {cur.hours}
                      </div>
                      <span className="text-white text-[11px] font-bold">{cur.title}</span>
                      <span className="text-[8px] text-[#00f0ff] tracking-wider uppercase font-semibold">{cur.primaryCategory}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SOCIOLOGICAL RISK CORRELATIONS */}
          {activeTab === 'sociological' && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#00f0ff]/10 border border-[#00f0ff]/40 p-2 text-xs flex justify-between items-center text-[#00f0ff]">
                <span className="font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4" /> STATEWIDE SOCIOLOGICAL & DEMOGRAPHIC INDICES vs CRIME TYPE
                </span>
                <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-2 py-0.5">ZIA CORRELATION</span>
              </div>

              {/* Urban Stress Multiplier control */}
              <div className="p-4 border border-[#00f0ff]/30 bg-black/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[#00f0ff] font-bold uppercase text-xs block">PROACTIVE URBAN STRESS CORRELATOR MODEL</span>
                  <p className="text-[9px] text-stone-400 mt-1">Adjust regional peripheral urban development parameter to evaluate forecasted social impact scores.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-1/3">
                  <input 
                    type="range"
                    min="10"
                    max="90"
                    value={urbanStressParam}
                    onChange={(e) => { setUrbanStressParam(parseInt(e.target.value)); playTerminalBeep('click'); }}
                    className="w-full h-1 bg-stone-800 rounded accent-[#ff007f]"
                  />
                  <span className="bg-[#ff007f] text-white font-extrabold text-xs px-2 py-1 select-text">+{urbanStressParam}% YoY</span>
                </div>
              </div>

              {/* Correlative Scale List */}
              <div className="flex flex-col gap-2">
                {SOCIOLOGICAL_INSIGHTS.map((scale, i) => (
                  <div key={i} className="p-3 border border-stone-800 bg-[#11111a] flex flex-col md:flex-row justify-between gap-3 text-xs hover:border-[#ff007f]/50 transition-all">
                    <div className="md:w-1/3">
                      <span className="text-[9px] text-[#ff007f] font-bold uppercase tracking-wider block">INDICATOR MATRIX</span>
                      <span className="text-white font-bold">{scale.indicator}</span>
                      <span className="text-[#00f0ff] font-semibold text-[10px] block mt-0.5">{scale.value}</span>
                    </div>

                    <div className="md:w-1/2">
                      <span className="text-[9px] text-stone-500 block">SOCIOLOGICAL IMPACT CRIME VECTOR</span>
                      <p className="text-stone-300 text-[10px] leading-relaxed">
                        {scale.impactOnCrime} {urbanStressParam > 50 && "Escalated bypass triggers are expected under high urbanization velocity."}
                      </p>
                    </div>

                    <div className="md:w-1/6 flex flex-col justify-center items-end">
                      <span className="text-[8px] text-stone-500 block">CORRELATION</span>
                      <span className={`font-bold uppercase text-[10px] ${scale.crimeCorrelation === 'Strong Positive' ? 'text-red-500' : 'text-yellow-400'}`}>
                        {scale.crimeCorrelation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: HABITUAL OFFENDER PROFILING */}
          {activeTab === 'offenders' && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#ff007f]/10 border border-[#ff007f]/40 p-2 text-xs flex justify-between items-center text-[#ff007f]">
                <span className="font-bold flex items-center gap-1.5">
                  <Shield className="w-4 h-4 animate-pulse" /> HIGH-RISK HABITUAL OFFENDER REGISTRY MODULE
                </span>
                <span className="text-xs bg-black text-[#00f0ff] font-mono px-2 py-0.5">MONITORED SUBJECTS: {MOCK_OFFENDERS.length}</span>
              </div>

              {/* Selector grid */}
              <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-3">
                {MOCK_OFFENDERS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => { setSelectedOffender(o.id); playTerminalBeep('click'); }}
                    className={`px-3 py-1.5 border text-xs font-bold transition-all ${
                      selectedOffender === o.id
                        ? 'bg-[#ff007f] border-[#ff007f] text-white shadow-[0_0_8px_rgba(255,0,127,0.5)]'
                        : 'bg-black border-stone-800 text-[#00f0ff]'
                    }`}
                  >
                    {o.alias} ({o.name})
                  </button>
                ))}
              </div>

              {/* Active Offender Profile View */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Score and Core data */}
                <div className="md:col-span-5 p-4 border border-[#ff007f]/30 bg-black/60 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white">{activeOffenderDetails.name}</h4>
                      <p className="text-xs text-stone-500">Alias: <span className="text-[#ff007f] font-bold">{activeOffenderDetails.alias}</span></p>
                    </div>
                    {/* Status badge */}
                    <span className="px-2 py-0.5 bg-red-600 border border-white text-white text-[8px] font-bold block uppercase tracking-widest animate-pulse">
                      {activeOffenderDetails.status}
                    </span>
                  </div>

                  {/* Circular Risk meter design */}
                  <div className="p-3 border border-stone-800 bg-black/80 flex items-center gap-3">
                    <div className="relative w-16 h-16 flex items-center justify-center border-4 border-[#ff007f] text-[#ff007f] font-extrabold text-lg rounded-full">
                      {activeOffenderDetails.riskScore}%
                    </div>
                    <div>
                      <span className="text-[#ff007f] text-[9px] block uppercase font-bold tracking-wider">BEHAVIORAL RISK SCORE</span>
                      <p className="text-[10px] text-stone-400">Escalated likelihood of localized recidivism and territorial enforcements.</p>
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className="text-[9px] text-[#00f0ff] block font-bold uppercase">PRIMARY MODUS OPERANDI (M.O.)</span>
                    <p className="text-stone-300 mt-1 italic">"{activeOffenderDetails.primaryMO}"</p>
                  </div>
                </div>

                {/* Behavioral Details and allies */}
                <div className="md:col-span-7 p-4 border border-[#00f0ff]/30 bg-[#09090e] flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] text-[#ff007f] font-bold block uppercase">PSYCHOLOGICAL & BEHAVIORAL TRAITS</span>
                    <ul className="text-xs list-disc pl-4 mt-1 text-stone-300 flex flex-col gap-1">
                      {activeOffenderDetails.behavioralTraits.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#00f0ff] font-bold block uppercase">SOCIOLOGICAL RISK FACTORS TRIGGER INDEX</span>
                    <ul className="text-xs list-disc pl-4 mt-1 text-stone-300 flex flex-col gap-1">
                      {activeOffenderDetails.socialRiskFactors.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[8px] text-[#ff007f] block uppercase font-bold">SYNDICATE ACCOMPLICES / ALLIES:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {activeOffenderDetails.allies.map((a, i) => (
                          <span key={i} className="bg-black text-[9px] text-[#00f0ff] border border-stone-700 px-1.5 py-0.5">{a}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[8px] text-stone-500 block uppercase font-bold">CASE ASSIGNED REF:</span>
                      <span className="text-white block font-bold mt-0.5">{activeOffenderDetails.associatedCrimes[0]}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: AUTH AUDIT LOG READER */}
          {activeTab === 'audit' && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#ff007f]/10 border border-[#ff007f]/40 p-2 text-xs flex justify-between items-center text-[#ff007f]">
                <span className="font-bold flex items-center gap-1.5 uppercase">
                  <Shield className="w-4 h-4" /> KSP DATA PROTECTION AUDIT SECURE SHEET (ROLE COMPLIANCE ACTIVE)
                </span>
                <span className="text-xs bg-black text-emerald-400 font-mono px-2 py-0.5">CATALYST SECURITY SHARDS SECURE: 100%</span>
              </div>

              {/* Logs table structure */}
              <div className="border border-stone-800 bg-black/60 h-[380px] overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-stone-800 bg-[#11111a] text-stone-400 text-[10px] uppercase font-mono">
                      <th className="p-2">Timestamp</th>
                      <th className="p-2">Identity Code</th>
                      <th className="p-2">Role Clearance</th>
                      <th className="p-2">Activity Trigger</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {auditLogs.map((log, idx) => (
                      <tr key={idx} className="border-b border-stone-900 hover:bg-white/5 transition-all">
                        <td className="p-2 text-[10px] text-stone-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="p-2 font-bold text-white">{log.user}</td>
                        <td className="p-2"><span className="text-[#00f0ff] uppercase text-[10px]">{log.role}</span></td>
                        <td className="p-2 text-stone-300 text-[10px]">
                          {log.action} - <span className="text-stone-500 italic text-[9px]">{log.details}</span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 text-[8px] font-bold ${log.status === 'ALLOWED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20' : 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse'}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dynamic simulated verification trigger */}
              <div className="bg-black p-3 border border-stone-800 text-stone-400 leading-relaxed text-[10px]">
                <span className="text-[#ff007f] font-bold uppercase block mb-1">ZOHO CATALYST API GATEWAY PROTECTIVE LOGGING:</span> Under Karnataka Police SCRB compliance act, any attempts by unauthorized terminals to alter biometric nodes or financial ledger trails will trigger immediate shutdown of regional port gateways and sound alerts through Catalyst Signals.
              </div>
            </div>
          )}

          {/* LOWER STATUS FOOTER BAR */}
          <footer className="border-t border-[#00f0ff]/30 pt-3 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-[#00f0ff]/60 font-mono">
            <span>TERMINAL CONSOLE SYSTEM_LOAD: SECURE (100% AUDITED)</span>
            <span className="uppercase text-[#ff007f] tracking-widest font-bold">STATE CRIME RECORDS BUREAU DECENTRALIZED PROTOCOL SE-4112</span>
          </footer>

        </section>

        {/* SIDE CONSOLE HUD PANELS (4 cols on lg) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* SIDE CARD A: REGISTERED CASE INVENTORY SHEETS */}
          <div className="border-2 border-[#00f0ff]/50 bg-[#11111a] p-4 flex flex-col gap-3">
            <h3 className="text-xs uppercase text-[#00f0ff] font-extrabold border-b border-[#00f0ff]/30 pb-1 flex items-center gap-1.5 tracking-wider">
              <Database className="w-4 h-4 text-[#ff007f]" /> STATE REGISTERED FIR INVENTORY
            </h3>
            
            {/* Scrollable list search */}
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">
              {MOCK_FIRS.map((fir) => {
                const isSelected = selectedCase === fir.id;
                return (
                  <div
                    key={fir.id}
                    onClick={() => { setSelectedCase(fir.id); playTerminalBeep('click'); }}
                    className={`p-2 border text-left cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#00f0ff]/10 border-[#00f0ff]' 
                        : 'bg-black border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <div className="flex justify-between items-center font-mono">
                      <span className="font-bold text-white text-xs">{fir.id}</span>
                      <span className={`text-[8px] px-1 py-0.5 border ${fir.status === 'UNDER_INVESTIGATION' ? 'text-yellow-400 border-yellow-400/20' : (fir.status === 'CHARGE_SHEETED' ? 'text-blue-400 border-blue-400/20' : 'text-emerald-400 border-emerald-400/30')}`}>
                        {fir.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-[#00f0ff]/80 mt-1">
                      <span>{fir.district}</span>
                      <span>{fir.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected case detail sheet popup */}
            <div className="p-3 border border-[#ff007f]/40 bg-black/60 text-xs">
              <span className="text-[8px] text-[#ff007f] font-bold block uppercase tracking-wider">SELECTED CRIME RECORDS MODULE</span>
              <p className="text-white font-extrabold text-xs mt-1">{activeFIRDetails.id} ({activeFIRDetails.crimeCategory})</p>
              
              <div className="mt-2 text-stone-300 font-mono text-[10px] leading-relaxed select-text">
                <span className="text-stone-500 block">Modus Operandi:</span>
                "{activeFIRDetails.modusOperandi}"
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[9px] border-t border-stone-800 pt-2 select-text">
                <div>
                  <span className="text-stone-500 block">Victim Profile:</span>
                  <span className="text-[#00f0ff] text-[10px] font-bold">{activeFIRDetails.victimDetails.name} ({activeFIRDetails.victimDetails.age}yr)</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Lead Accused:</span>
                  <span className="text-[#ff007f] text-[10px] font-bold">{activeFIRDetails.accusedDetails.name}</span>
                </div>
              </div>
            </div>

          </div>

          {/* SIDE CARD B: GEOSPATIAL INTELLIGENCE RADAR (HOTSPOT MARKERS) */}
          <div className="border-2 border-[#ff007f]/50 bg-[#11111a] p-4 flex flex-col gap-3">
            <h3 className="text-xs uppercase text-[#ff007f] font-extrabold border-b border-[#ff007f]/30 pb-1 flex items-center gap-1.5 tracking-wider">
              <MapPin className="w-4 h-4 text-[#00f0ff]" /> GEOSPATIAL CRIME MARKER RADAR (KSP)
            </h3>

            {/* Micro Karnataka stylized district radar grid */}
            <div className="border border-stone-800 bg-black h-[140px] relative flex justify-center items-center overflow-hidden">
              
              {/* Pulse scanline radial HUD */}
              <div className="absolute w-[180px] h-[180px] border border-[#ff007f]/10 rounded-full animate-ping pointer-events-none" />
              <div className="absolute w-[100px] h-[100px] border border-[#00f0ff]/10 rounded-full animate-pulse pointer-events-none" />
              
              {/* Coordinates Grid mapping */}
              <div className="absolute inset-0 bg-[radial-gradient(#1d1d2f_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

              {/* Location nodes on HUD map */}
              {MOCK_FIRS.map((fir) => {
                const isSelected = selectedCase === fir.id;
                // Formulate coordinate scales relative to bounds
                const xPct = 20 + ((fir.location.lng - 74) / 4) * 60;
                const yPct = 80 - ((fir.location.lat - 12) / 4) * 60;

                return (
                  <div
                    key={fir.id}
                    title={`${fir.location.address} - Hotspot Cluster`}
                    onClick={() => { setSelectedCase(fir.id); playTerminalBeep('click'); }}
                    style={{ left: `${xPct}%`, top: `${yPct}%` }}
                    className={`absolute w-3.5 h-3.5 rounded-full cursor-pointer -translate-x-1/2 -translate-y-1/2 border transition-all hover:scale-125 flex items-center justify-center ${
                      isSelected 
                        ? 'bg-[#ff007f] border-white z-20 shadow-[0_0_8px_#ff007f]' 
                        : 'bg-black border-[#00f0ff] animate-pulse z-10'
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#00f0ff]'}`} />
                  </div>
                );
              })}

              <div className="absolute top-2 left-2 bg-black/75 px-1 py-0.5 border border-stone-800 text-[8px] uppercase tracking-wider text-[#00f0ff]">
                KSP DISTRICT MATRIX SCANNER
              </div>
            </div>

            <div className="p-2 border border-stone-800 bg-black/40 text-[10px] text-stone-300">
              <span className="text-[#00f0ff] font-bold block uppercase mb-1">RADAR COORDINATES EXTRACTED:</span>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono select-text">
                <div>
                  <span className="text-stone-500 block">Latitude Vector:</span>
                  <span className="text-white font-bold">{activeFIRDetails.location.lat.toFixed(4)} N</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Longitude Vector:</span>
                  <span className="text-white font-bold">{activeFIRDetails.location.lng.toFixed(4)} E</span>
                </div>
              </div>
            </div>

          </div>

          {/* SIDE CARD C: REALTIME FINANCIAL FRAUD CORRELATION MATRIX */}
          <div className="border-2 border-[#00f0ff]/50 bg-[#11111a] p-4 flex flex-col gap-3">
            <h3 className="text-xs uppercase text-[#00f0ff] font-extrabold border-b border-[#00f0ff]/30 pb-1 flex items-center gap-1.5 tracking-wider">
              <DollarSign className="w-4 h-4 text-[#ff007f]" /> TRANSACTION LAUNDERING LEDGER SYSTEM
            </h3>

            {activeFIRDetails.financialActivity ? (
              <div className="flex flex-col gap-2">
                <div className="p-2.5 bg-black/60 border border-[#ff007f]/30 flex justify-between items-center text-xs">
                  <span>SUSPICIOUS LEDGER DEBIT:</span>
                  <span className="text-[#ff007f] font-extrabold font-mono select-text">
                    INR {activeFIRDetails.financialActivity.suspiciousAmount.toLocaleString()}
                  </span>
                </div>

                <div className="text-[10px]">
                  <span className="text-stone-500 block mb-1">TRANSACTION TRACABILITY (ZOHO CIRCS FLOWS):</span>
                  <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto">
                    {activeFIRDetails.financialActivity.transactionTrail.map((trail, index) => (
                      <div key={index} className="p-1.5 bg-[#09090e] border border-stone-800 font-mono text-[9px] flex items-center gap-1 justify-between select-text">
                        <span className="text-[#00f0ff] truncate w-[80px]">{trail.from}</span>
                        <CornerDownRight className="w-3.5 h-3.5 text-[#ff007f] shrink-0" />
                        <span className="text-yellow-400 truncate w-[80px]">{trail.to}</span>
                        <span className="text-white font-extrabold shrink-0">₹{trail.amount / 1000}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-black/40 border border-stone-800 text-center text-xs text-stone-500 italic">
                NO ESCALATED FINANCIAL TRANSACTIONS REGISTERED UNDER SPECIFIED CASES.
              </div>
            )}
            
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 text-[9px] text-[#eab308]">
              <span className="font-bold block uppercase mb-0.5">CATALYST STRATUS STORAGE SYNC:</span>
              Transaction documents secure logs locked inside encrypted storage partition.
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}

// Fixed coordinate nodes representation to avoid overlapping in retro aesthetic linkage SVG
function getFixedNodeCoordinates(id: string) {
  const coordinatesMap: Record<string, { x: number; y: number }> = {
    // Suspects
    S_SHIVA: { x: 70, y: 80 },
    S_VICKY: { x: 260, y: 70 },
    S_RAZIQ: { x: 450, y: 150 },
    S_RAVI: { x: 120, y: 190 },
    S_PRASH: { x: 340, y: 80 },
    S_FENCE: { x: 180, y: 120 },
    
    // Crimes
    C_102: { x: 280, y: 180 },
    C_105: { x: 160, y: 260 },
    C_224: { x: 390, y: 250 },
    
    // Bank Accounts
    B_MULE1: { x: 200, y: 40 },
    B_GATEWAY: { x: 330, y: 290 },
    B_FENCE_ACC: { x: 80, y: 240 },
    
    // Locations
    L_KORA: { x: 180, y: 180 },
    L_MAJ: { x: 320, y: 180 },
    L_BUNDER: { x: 450, y: 220 }
  };

  return coordinatesMap[id] || { x: 200, y: 150 };
}
