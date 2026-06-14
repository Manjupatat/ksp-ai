import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini initialization
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    console.warn("WARNING: GEMINI_API_KEY is not configured or contains placeholder. Active fallback to local heuristic terminal processing.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "ONLINE",
    system: "KSP Strategic Intelligence Hub",
    timestamp: new Date().toISOString(),
    catalystProxyActive: true,
    speechEngineReady: true
  });
});

app.post("/api/query", async (req, res) => {
  const { prompt, chatHistory = [], language = "EN" } = req.body;

  console.log(`[TERMINAL IP INGRESS] Processing query in language=${language}: "${prompt}"`);

  // Build the context from the mock dataset so the LLM is fully grounded in the actual state crime DB
  const groundDataContext = `
======= KSP STATE CRIME RECORDS BUREAU (SCRB) DATASET SOURCE =======
POLICE DISTRICTS AVAILABLE:
Bengaluru City, Hubballi-Dharwad, Mysuru City, Mangaluru City, Belagavi, Kalaburagi, Shivamogga, Udupi.

REGISTERED CASES (FIRS):
1. FIR-2026-102:
   District: Bengaluru City, Station: Koramangala
   Category: Cyber Fraud & Money Laundering
   Date: 2026-05-12, Time: 23:15:00
   Modus Operandi: Phishing fake electricity links (KPTCL bill warnings), redirect to mule accounts, transfer to cryptocurrency gateways.
   Accused Name: Vikram alias 'Crypto Vicky', Age: 28, Repeat Offender, Risk Score: 89/100, History Count: 3.
   Victim: Gurudevappa Patil, 62 yrs, Middle Class Pensioner, retired.
   Financial Activity: Stolen INR 1,500,000. Trailed out to MULE-AC-9081 and CRYP-GAT-510.
   Location: 6th Block, Koramangala, Bengaluru (Lat: 12.9348, Lng: 77.6189).

2. FIR-2026-105:
   District: Bengaluru City, Station: Majestic
   Category: Burglary & Organized Ring
   Date: 2026-06-02, Time: 02:30:00
   Modus Operandi: Pre-midnight surveillance, gas-cutter lock breaking, local auto-rickshaws used for moving gold items to Hubli fences. Power municipal lines disrupted to bypass CCTVs.
   Accused Name: Shiva alias 'Skull Shiva', Age: 34, Repeat Offender, Risk Score: 94/100, History Count: 11.
   Victim: Suresh S., 48, Elite Trader. Gold Stolen: Valued INR 4,500,000.
   Location: Kempegowda Bus Station Layout, Majestic, Bengaluru (Lat: 12.9774, Lng: 77.5708).

3. FIR-2026-224:
   District: Mangaluru City, Station: Bunder Port
   Category: Contraband Smuggling
   Date: 2026-04-18, Time: 04:45:00
   Modus Operandi: Synthetics concealed under fresh sea-catch boxes inside commercial fishery trucks across checkpoints on NH-66. Goa-Kerala transit lines.
   Accused Name: Raziq alias 'Marine Raziq', Age: 41, Repeat Offender, Risk Score: 82/100.
   Financial Activity: Contraband valuation INR 8,500,000, linked accounts: OFFSHORE-AC-201.
   Location: Bunder Wharf, Mangaluru (Lat: 12.8628, Lng: 74.8398).

4. FIR-2026-301:
   District: Hubballi-Dharwad, Station: Gokul Road
   Category: Fake Land Document Scam
   Date: 2026-03-24, Time: 11:00:00
   Modus Operandi: Forged Kaveri 2.0 land seals, fraudulent survey drawings, cash drafts.
   Accused Name: Siddappa alias 'Siddu', Age: 50, Not repeat offender, Risk: 45/100.
   Victim: Anand Murthy Rao, 67, retired teacher. Lost: INR 3,200,000.

5. FIR-2026-441:
   District: Mysuru City, Station: Nazarbad
   Category: Heritage Antique Smuggling
   Date: 2026-05-30, Time: 19:30:00
   Modus Operandi: Acquiring 19th-century ivory paintings from vulnerable families, forging valuation records. international smuggling networks.
   Accused Name: Mahindra alias 'Royalty Mahi', Age: 45, Repeat Offender, Risk: 78/100.

ACTIVE TRACKED SUSPECT RELATIONSHIPS:
- Skull Shiva work with enforcer "Local Ravi" (Ravi alias 'Local Ravi', currently in custody) for burglar logistics and warehouse intimidations.
- Crypto Vicky collaborates with "Proxy Prash" (Prashanth alias 'Proxy Prash') for phishing deployment, uses intermediary merchant "Hassan Broker" for P2P offramping.
- Marine Raziq trades in cooperation with Goa network smuggler "Zavier" and Kerala distributor "Varghese".
- Skull Shiva unloads stolen gold bullion with "Girish the Fence" (Canara Majestic AC 776).

SOCIOLOGICAL THREAT VECTORS:
- Rapid Peripheral Urban Growth in Bengaluru (+34% YoY) is creating unregistered mule clusters.
- High Tech Graduate unemployment (18%) feeds sophisticated spear-phishing rings.
- Secondary Gold Recycle Yards near Majestic act as quick scrap smelters.
- Freight truck density on NH-66 allows narcotics smuggling under maritime cargo feeds.
`;

  const sysInstruction = `
  You are the KSP DECENTRALIZED COGNITIVE INTELLIGENCE TERMINAL (SCRB AI Engine v4.7).
  Your tone is cryptic, precise, machine-like, authoritative, and advanced, fitting a high-contrast Retro-Futurism Glitch interface.
  Use words like "INGRESS", "DECRYPTED", "VECTOR TRACE", "EVIDENCE GAP", "HOTSPOT DETECTED".

  INTELLIGENCE PROTOCOLS:
  1. Address the investigator's query strictly using the KSP database details provided below.
  2. If the user asks for crime statistics, suspect profiles, modus operandi, financial trails, or geological nodes, formulate a deeply technical analytics report.
  3. Ground your answer in data. Highlight connections (e.g. Skull Shiva works with Local Ravi; Girish is the fence).
  4. Always speak the language requested. CURRENT INTERACTION LANGUAGE MODE: ${language}.
     - If language is KN, you MUST respond in fluent, grammatically correct and expressive Kannada, but retain technical terms in brackets where helpful (e.g., [Cyber Fraud], [Mule Account]).
     - If language is EN, respond in crisp, retro-cyberpunk styled English.
  5. EXPLAINABLE AI DIRECTIVE: Always append an [EVIDENCE PATH TRACE] (ಅಪರಾಧ ಪುರಾವೆ ದಾರಿ) list at the bottom of your answer detailing the precise FIR numbers, coordinates, suspect IDs, or sociological correlations you referenced.
  `;

  // Deterministic local engine fallback in case Gemini key is missing or calls fail
  const localFallbackHandler = (userQuery: string): string => {
    const qLower = userQuery.toLowerCase();
    
    if (language === "KN") {
      const knHeader = `[ಸ್ಥಳೀಯ ಆಫ್‌ಲೈನ್ ಕಾಗ್ನಿಟಿವ್ ಎಂಜಿನ್ ಕನ್ಸೋಲ್]\n`;
      if (qLower.includes("fir") || qLower.includes("ಕೇಸ್") || qLower.includes("ದಾಖಲೆ")) {
        return `[ಡೇಟಾಬೇಸ್ ಸಕ್ರಿಯ] ಕರ್ನಾಟಕ ಪೊಲೀಸ್ ವರದಿ ಸಂಗ್ರಹ:\n\n` +
          `- **FIR-2026-102**: ವಿಕ್ರಮ್ ಆಲಿಯಾಸ್ 'Crypto Vicky' - KPTCL ನಕಲಿ ಬಿಲ್ ಜಾಲ - 15 ಲಕ್ಷ ವಂಚನೆ.\n` +
          `- **FIR-2026-105**: ಶಿವ ಆಲಿಯಾಸ್ 'Skull Shiva' - ಮೆಜೆಸ್ಟಿಕ್ ಚಿನ್ನದ ವಂಚನೆ ಮತ್ತು ಅಲ್ಟ್ರಾ ಬ್ರೇಕಿಂಗ್ - 45 ಲಕ್ಷ ಚಿನ್ನ ಕಳವು.\n` +
          `- **FIR-2026-224**: ರಜೀಖ್ ಆಲಿಯಾಸ್ 'Marine Raziq' - ಮಂಗಳೂರು ಬಂದರು ಡ್ರಗ್ಸ್ ಸಾಗಾಟ - 85 ಲಕ್ಷ ನಗದು ಜಾಲ.\n\n` +
          `**[ಪುರಾವೆ ಪಥ]**: ಸ್ಥಳೀಯ ಕೆಎಸ್‌ಪಿ-ಎಸ್‌ಸಿಆರ್‌ಬಿ ಕಡತಗಳು ಆನ್‌ಲೈನ್.`;
      }
      if (qLower.includes("shiva") || qLower.includes("ಶಿವ") || qLower.includes("ಗಳ್ಳ")) {
        return `[ಸ್ಥಳೀಯ ವಿಶ್ಲೇಷಣೆ] **ಶಿವ ಆಲಿಯಾಸ್ 'Skull Shiva'** (ಅಪಾಯದ ಅಂಕ: 94/100):\n\n` +
          `**ನಡವಳಿಕೆ ಶೈಲಿ**: ಮುಂಜಾನೆ ಗ್ಯಾಸ್-ಕಟರ್ ಬಳಸಿ ಲಾಕ್ ಒಡೆಯುವುದು. ಸ್ಥಳೀಯ ಆಟೋಗಳನ್ನು ಮರೆಮಾಚಲು ಬಳಸುತ್ತಾನೆ.\n` +
          `**ನೆಟ್‌ವರ್ಕ್ ಲಿಂಕ್**: 'ಲೋಕಲ್ ರವಿ' ಮತ್ತು ಚಿನ್ನ ಕೊಳ್ಳುವ 'ಗಿರೀಶ್ ದಿ ಫೆನ್ಸ್' ಜೊತೆ ಪಾಲುದಾರಿಕೆ ಇದೆ.\n\n` +
          `**[ಪುರಾವೆ ಪಥ]**: FIR-2026-105; ಜಿಯೋ ಗ್ರಾಫ್: Majestic Section 11.02.`;
      }
      return `[ಟರ್ಮಿನಲ್ ಇಂಟೆಲಿಜೆನ್ಸ್] ವಿಚಾರಣೆಗೆ ಧನ್ಯವಾದಗಳು. ದಯವಿಟ್ಟು ಕನೆಕ್ಟರ್ ಜಾಲ, ಫೈನಾನ್ಷಿಯಲ್ ಟ್ರಯಲ್, ಅಥವಾ ನಿರ್ದಿಷ್ಟ ಎಫ್ಐಆರ್ ಸಂಖ್ಯೆಯನ್ನು ಕೇಳಿ.\n\n` +
        `**[ಪುರಾವೆ ಪಥ]**: ಕೆಎಸ್‌ಪಿ ಗ್ಲಿಚ್ ನೊಡ್-ಎಕ್ಸ್ ಪ್ರವೇಶ ಅನುಮೋದಿಸಲಾಗಿದೆ.`;
    } else {
      if (qLower.includes("fir") || qLower.includes("case") || qLower.includes("records")) {
        return `[LOCAL DETERMINISTIC RUNTIME] KSP Active Registry:\n\n` +
          `- **FIR-2026-102**: [Cyber Fraud] Vikram 'Crypto Vicky' siphoned INR 1,500,000 from victim Gurudevappa Patil using fake KPTCL utility templates.\n` +
          `- **FIR-2026-105**: [Burglary] 'Skull Shiva' compromised Majestic commercial lockers, stole INR 4,500,000 in golden valuables.\n` +
          `- **FIR-2026-224**: [Contraband] 'Marine Raziq' bypassed Coastal checkpoints on NH-66 with premium smuggling cargo.\n\n` +
          `[EVIDENCE PATH TRACE]: Grounded on local active memory tables FIR-102, FIR-105, FIR-224.`;
      }
      if (qLower.includes("shiva") || qLower.includes("skull") || qLower.includes("burglar")) {
        return `[LOCAL DETERMINISTIC REPORT] **Shiva alias 'Skull Shiva'** [ID: OFF-8092, RISK: 94%]:\n\n` +
          `- **MO**: Pre-midnight scouting, gas-cut lock disruption, power sabotage to bypass security cameras.\n` +
          `- **Accomplices**: Local Ravi (extortionist) provides urban logistics, while Girish the Fence sanitizes gold items inside Majestic secondary scrap yards.\n\n` +
          `[EVIDENCE PATH TRACE]: Case links: FIR-2026-105. Biometric Risk Table verified.`;
      }
      if (qLower.includes("vicky") || qLower.includes("cyber") || qLower.includes("money")) {
        return `[LOCAL DETERMINISTIC REPORT] **Vikram alias 'Crypto Vicky'** [ID: OFF-4112, RISK: 89%]:\n\n` +
          `- **MO**: Spreads fake government bills, routes funds to SBI mule accounts, washes instantly to crypto bridges.\n` +
          `- **Accomplices**: Proxy Prash (facilitating servers), Hassan (P2P broker).\n\n` +
          `[EVIDENCE PATH TRACE]: Case links: FIR-2026-102. Transaction Ledger SC-3101.`;
      }
      return `[TERMINAL RESPONDING] Query decrypted. System active. Search parameters are ready for FIR numbers, suspects, or financial networks.\n\n` +
        `[EVIDENCE PATH TRACE]: Cryptographic terminal bridge established safely.`;
    }
  };

  const client = getGeminiClient();

  if (!client) {
    // Return deterministic responses instantly if the key is not set
    const fallbackResponse = localFallbackHandler(prompt);
    return res.json({
      text: fallbackResponse,
      mode: "FALLBACK_DETERMINISTIC",
      evidenceTrail: ["LOCAL_DB_DECRYPT", "ZOHO_CATALYST_STANDALONE_STORE"]
    });
  }

  try {
    // Formulate a conversation history formatted for GoogleGenAI SDK
    const contents: any[] = [];
    
    // Process previous history
    chatHistory.forEach((msg: any) => {
      contents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      });
    });

    // Provide the active query grounded with database data
    const queryWithData = `
User Query: "${prompt}"

Current State Crime Data Sandbox context:
${groundDataContext}

Analyze according to rules, and respond matching the requested Language Mode (${language}). Ensure to include the [EVIDENCE PATH TRACE] at the end.`;

    contents.push({
      role: "user",
      parts: [{ text: queryWithData }]
    });

    const geminiRes = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.2, // low temp for accurate analytics extraction
      }
    });

    const rawText = geminiRes.text || "SYSTEM FAILURE: Could not retrieve text generation payload.";
    
    // Extract evidence trace strings dynamically from response
    const evidenceTrail: string[] = [];
    const traceRegex = /FIR-\d+-\d+|MULE-AC-\d+|CRYP-GAT-\d+|OFF-\d+/gi;
    let match;
    while ((match = traceRegex.exec(rawText)) !== null) {
      if (!evidenceTrail.includes(match[0].toUpperCase())) {
        evidenceTrail.push(match[0].toUpperCase());
      }
    }

    if (evidenceTrail.length === 0) {
      evidenceTrail.push("GROUNDED_RECORDS_INDEX");
    }

    return res.json({
      text: rawText,
      mode: "REAL_GEMINI_AI",
      evidenceTrail: evidenceTrail
    });

  } catch (error: any) {
    console.error("Gemini model execution error:", error);
    // Gracefully handle any model API blockages or rate limits and return deterministic response
    const fallbackResponse = localFallbackHandler(prompt);
    return res.json({
      text: fallbackResponse + `\n\n*(Note: AI Engine fell back to deterministic heuristic processing due to runtime rate-limit: ${error.message || "Unknown Error"})*`,
      mode: "API_ERROR_FALLBACK",
      evidenceTrail: ["LOCAL_DB_DECRYPT"]
    });
  }
});

// Setup Vite development server or serve build files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite development server initialization in progress...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Production static server route configured.");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KSP NETWORK SYSTEM INFRASTRUCTURE] Online. Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
