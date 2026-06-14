import { FIRCase, OffenderProfile, NetworkNode, NetworkLink, AuditLog, SociologicalScale } from '../types';

export const DISTRICTS_LIST = [
  'Bengaluru City',
  'Hubballi-Dharwad',
  'Mysuru City',
  'Mangaluru City',
  'Belagavi',
  'Kalaburagi',
  'Shivamogga',
  'Udupi'
];

export const BI_LINGUAL_TERMS = {
  EN: {
    title: "KSP DECENTRALIZED COGNITIVE INTELLIGENCE TERMINAL",
    subtitle: "STATE CRIME RECORDS BUREAU (SCRB) - PROACTIVE ANALYTICS NODE",
    chatTab: "CONVERSATIONAL INTEL (M-VOICE)",
    networkTab: "CRIMINOLOGICAL LINK ANALYSIS",
    patternTab: "SPATIOTEMPORAL TRENDS & FORECAST",
    socioTab: "SOCIOLOGICAL RISK CORRELATION",
    profileTab: "OFFENDER profiling NODE",
    auditTab: "ROLE SECURE AUDIT LOG",
    rolesSelect: "RE-DECRYPT CONSOLE FOR ROLE:",
    voiceButtonActive: "MIC ON - TRANSCRIBING...",
    voiceButtonIdle: "MIC OFF - PUSH TO SPEAK",
    voiceLanguageLabel: "VOICE INTERACTION LANGUAGE",
    ttsActive: "SYNTHESIZING SOUND...",
    ttsIdle: "READ RESPONSE OUT LOUD"
  },
  KN: {
    title: "ಕೆಎಸ್ಪಿ ವಿಕೇಂದ್ರೀಕೃತ ಕಾಗ್ನಿಟಿವ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಟರ್ಮಿನಲ್",
    subtitle: "ರಾಜ್ಯ ಅಪರಾಧ ದಾಖಲೆಗಳ ಬ್ಯೂರೋ (SCRB) - ಸಕ್ರಿಯ ವಿಶ್ಲೇಷಣಾ ಕೇಂದ್ರ",
    chatTab: "ಮಾತುಕತೆ ಇಂಟೆಲಿಜೆನ್ಸ್ (ಧ್ವನಿ)",
    networkTab: "ಅಪರಾಧ ನಡವಳಿಕೆ ಲಿಂಕ್ ವಿಶ್ಲೇಷಣೆ",
    patternTab: "ಸ್ಪಾಟಿಯೋಟೆಂಪೋರಲ್ ಪ್ರವೃತ್ತಿ ಮತ್ತು ಮುನ್ಸೂಚನೆ",
    socioTab: "ಸಾಮಾಜಿಕ ಅಪಾಯದ ಸಹಸಂಬಂಧ",
    profileTab: "ಅಪರಾಧಿಯ ವಿವರಗಳ ಅಧಿವೇಶನ",
    auditTab: "ಭದ್ರತಾ ಆಡಿಟ್ ಲಾಗ್ ವಿವರ",
    rolesSelect: "ಪಾತ್ರವನ್ನು ಬದಲಾಯಿಸಿ ವಿವರ ನೋಡಿ:",
    voiceButtonActive: "ಮೈಕ್ ಆನ್ ಆಗಿದೆ - ರೆಕಾರ್ಡಿಂಗ್...",
    voiceButtonIdle: "ಮೈಕ್ ಆಫ್ ಆಗಿದೆ - ಮಾತನಾಡಲು ಒತ್ತಿ",
    voiceLanguageLabel: "ಧ್ವನಿ ಸಂಭಾಷಣೆಯ ಭಾಷೆ",
    ttsActive: "ಧ್ವನಿ ಸಂಶ್ಲೇಷಣೆ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    ttsIdle: "ಉತ್ತರವನ್ನು ಜೋರಾಗಿ ಓದಿ"
  }
};

export const MOCK_FIRS: FIRCase[] = [
  {
    id: "FIR-2026-102",
    district: "Bengaluru City",
    policeStation: "Koramangala",
    crimeCategory: "Cyber Fraud & Money Laundering",
    date: "2026-05-12",
    timeOfOccurrence: "23:15:00",
    modusOperandi: "Phishing via fake Karnataka Power Transmission Corporation Limited (KPTCL) electricity bill links, redirecting to mule bank accounts, split laundering via cryptocurrency gateways.",
    status: 'UNDER_INVESTIGATION',
    crimeDescription: "Under the pretense of outstanding electricity bills, the victim clicked a malicious link containing high-grade tracking software. INR 1,500,000 was debited within minutes and distributed across 4 structural shell accounts in Hubli and Bengaluru.",
    victimDetails: {
      name: "Gurudevappa Patil",
      age: 62,
      gender: "MALE",
      socioEconomic: "Middle Class Pensioner",
      education: "Bachelor's Degree in Science"
    },
    accusedDetails: {
      name: "Vikram alias 'Crypto Vicky'",
      age: 28,
      gender: "MALE",
      socioEconomic: "Tech Dropout / Digital Laundering Specialist",
      criminalHistoryCount: 3,
      repeatOffender: true,
      riskScore: 89
    },
    financialActivity: {
      suspiciousAmount: 1500000,
      bankAccounts: ["MULE-AC-9081", "CRYP-GAT-510"],
      transactionTrail: [
        { from: "VICTIM-Gurudevappa", to: "MULE-AC-9081", amount: 1500000, timestamp: "2026-05-12T23:18:00Z" },
        { from: "MULE-AC-9081", to: "MULE-AC-3101", amount: 800000, timestamp: "2026-05-12T23:45:00Z" },
        { from: "MULE-AC-9081", to: "CRYP-GAT-510", amount: 700000, timestamp: "2026-05-12T23:50:00Z" }
      ]
    },
    location: {
      lat: 12.9348,
      lng: 77.6189,
      address: "6th Block, Koramangala, Bengaluru"
    }
  },
  {
    id: "FIR-2026-105",
    district: "Bengaluru City",
    policeStation: "Majestic",
    crimeCategory: "Burglary & Organized Ring",
    date: "2026-06-02",
    timeOfOccurrence: "02:30:00",
    modusOperandi: "Pre-midnight surveillance of closed commercial premises, gas-cutter based security gate breaching, utilizing decentralized local auto-rickshaws for heavy material transportation to Hubli fences.",
    status: 'UNDER_INVESTIGATION',
    crimeDescription: "Jewelry shop lock broken with heavy tools between 02:00 AM and 03:00 AM. Golden ornaments valued at INR 4,500,000 smuggled out. The perpetrators bypassed regional digital CCTV feeds by manipulating the municipal power sub-station lines.",
    victimDetails: {
      name: "Suresh S.",
      age: 48,
      gender: "MALE",
      socioEconomic: "Elite Trader",
      education: "High School"
    },
    accusedDetails: {
      name: "Shiva alias 'Skull Shiva'",
      age: 34,
      gender: "MALE",
      socioEconomic: "Urban Marginalized / Recidivist Burglar",
      criminalHistoryCount: 11,
      repeatOffender: true,
      riskScore: 94
    },
    financialActivity: {
      suspiciousAmount: 4500000,
      bankAccounts: ["CASH-TRANS", "FENCE-AC-776"],
      transactionTrail: [
        { from: "STOLEN_JEWELRY", to: "FENCE-AC-776", amount: 1800000, timestamp: "2026-06-03T11:00:00Z" }
      ]
    },
    location: {
      lat: 12.9774,
      lng: 77.5708,
      address: "Kempegowda Bus Station Layout, Majestic, Bengaluru"
    }
  },
  {
    id: "FIR-2026-224",
    district: "Mangaluru City",
    policeStation: "Bunder Port",
    crimeCategory: "Contraband Smuggling",
    date: "2026-04-18",
    timeOfOccurrence: "04:45:00",
    modusOperandi: "Concealing synthetic narcotics under fresh sea-catch boxes inside commercial fishery trucks traversing border checkpoints on NH-66.",
    status: 'CHARGE_SHEETED',
    crimeDescription: "A joint inspection by Port Police and intelligence units intercepted sea-freight containers yielding 12 kilograms of premium synthetic contraband. The trail extends to Goa and Kerala distribution rings.",
    victimDetails: {
      name: "State of Karnataka",
      age: 0,
      gender: "OTHER",
      socioEconomic: "Public Welfare Concern",
      education: "N/A"
    },
    accusedDetails: {
      name: "Raziq alias 'Marine Raziq'",
      age: 41,
      gender: "MALE",
      socioEconomic: "Maritime Logistics Contractor",
      criminalHistoryCount: 5,
      repeatOffender: true,
      riskScore: 82
    },
    financialActivity: {
      suspiciousAmount: 8500000,
      bankAccounts: ["OFFSHORE-AC-201"],
      transactionTrail: [
        { from: "OFFSHORE-AC-201", to: "BORDER-CON-45", amount: 1200000, timestamp: "2026-04-17T18:30:00Z" }
      ]
    },
    location: {
      lat: 12.8628,
      lng: 74.8398,
      address: "Bunder Docklands Area, Mangaluru"
    }
  },
  {
    id: "FIR-2026-301",
    district: "Hubballi-Dharwad",
    policeStation: "Gokul Road",
    crimeCategory: "Fake Land Document Scam",
    date: "2026-03-24",
    timeOfOccurrence: "11:00:00",
    modusOperandi: "Creating forged Kaveri 2.0 land registration seals, counterfeiting legacy non-agricultural certificates, victimizing post-retirement settlers with dummy field showings.",
    status: 'PENDING',
    crimeDescription: "Exploiting high real-estate expansion near Dharwad Bypass, the suspect generated artificial surveys. INR 3,200,000 deposited in bank cash drafts.",
    victimDetails: {
      name: "Anand Murthy Rao",
      age: 67,
      gender: "MALE",
      socioEconomic: "Retired Teacher",
      education: "Masters in Literature"
    },
    accusedDetails: {
      name: "Siddappa alias 'Siddu'",
      age: 50,
      gender: "MALE",
      socioEconomic: "Sub-registrar Agent Broker",
      criminalHistoryCount: 2,
      repeatOffender: false,
      riskScore: 45
    },
    financialActivity: {
      suspiciousAmount: 3200000,
      bankAccounts: ["SCAM-CHECK-901"],
      transactionTrail: [
        { from: "VICTIM-Murthy", to: "SCAM-CHECK-901", amount: 3200000, timestamp: "2026-03-25T10:30:00Z" }
      ]
    },
    location: {
      lat: 15.3647,
      lng: 75.1245,
      address: "Near Gokul Industrial Layout, Hubballi"
    }
  },
  {
    id: "FIR-2026-441",
    district: "Mysuru City",
    policeStation: "Nazarbad",
    crimeCategory: "Heritage Antique Smuggling",
    date: "2026-05-30",
    timeOfOccurrence: "19:30:00",
    modusOperandi: "Acquiring authentic 19th-century royal paintings from distressed inheritors with forged valuation slips, smuggling pieces globally through secondary art galleries.",
    status: 'CLOSED',
    crimeDescription: "Recovery operation inside private hotel room intercepted two original Mysore-style ivory paintings. The global buyer network trace points towards international brokers in Singapore.",
    victimDetails: {
      name: "Public Heritage Trust",
      age: 0,
      gender: "OTHER",
      socioEconomic: "Cultural Preservation",
      education: "N/A"
    },
    accusedDetails: {
      name: "Mahindra alias 'Royalty Mahi'",
      age: 45,
      gender: "MALE",
      socioEconomic: "Elite Antique Dealer",
      criminalHistoryCount: 4,
      repeatOffender: true,
      riskScore: 78
    },
    location: {
      lat: 12.3118,
      lng: 76.6651,
      address: "Near Nazarbad Main Circle, Mysuru"
    }
  }
];

export const MOCK_OFFENDERS: OffenderProfile[] = [
  {
    id: "OFF-8092",
    name: "Shiva",
    alias: "Skull Shiva",
    age: 34,
    riskScore: 94,
    primaryMO: "Tactical dark-hour lock breaking, security system signal interference.",
    behavioralTraits: ["Highly calculated", "Reconnoiters locations for 10-15 days prior", "Bypasses camera networks by locating structural power feeds", "Never carries digital cellular rigs on missions"],
    socialRiskFactors: ["Grew up in systemic post-industrial slam layouts", "Early school drop-out, initiated into localized scrap metal syndicates", "Substance dependency trigger points"],
    associatedCrimes: ["FIR-2026-105", "FIR-2025-012", "FIR-2024-443"],
    allies: ["Ravi alias 'Local Ravi'", "Sharan alias 'Chop Sharan'"],
    status: "WANTED"
  },
  {
    id: "OFF-4112",
    name: "Vikram",
    alias: "Crypto Vicky",
    age: 28,
    riskScore: 89,
    primaryMO: "Malware dissemination via localized fake electricity (KPTCL) & tax portals.",
    behavioralTraits: ["High-grade computing literacy", "Impeccable social manipulation scripts", "Lauders funds instantly using offshore exchanges and non-custodial wallets"],
    socialRiskFactors: ["Rapid urbanization tech-migration stress", "Expelled from engineering college for server intrusions", "Compulsive trading debts"],
    associatedCrimes: ["FIR-2026-102", "FIR-2025-998"],
    allies: ["Prashanth alias 'Proxy Prash'", "Laundering Associate 'Hassan Broker'"],
    status: "ACTIVE"
  },
  {
    id: "OFF-3329",
    name: "Raziq",
    alias: "Marine Raziq",
    age: 41,
    riskScore: 82,
    primaryMO: "Utilizing coastal fish-cargo supply chains for uninspected narcotics transit.",
    behavioralTraits: ["Deep maritime routes navigation charts literacy", "Maintains clean local philanthropic persona in coastal wards", "Establishes secure compartmentalized communication chains"],
    socialRiskFactors: ["Early interactions with illegal high-seas diesel smuggling cartels", "Substantial familial debts to maritime financiers"],
    associatedCrimes: ["FIR-2026-224", "FIR-2025-112", "FIR-2023-889"],
    allies: ["Goa Node 'Zavier'", "Kerala Distributor 'Varghese'"],
    status: "MONITORED"
  },
  {
    id: "OFF-1153",
    name: "Local Ravi",
    alias: "Ravi alias 'Local Ravi'",
    age: 36,
    riskScore: 74,
    primaryMO: "Underworld protection extortion, logistics control intercepting wholesale warehouses.",
    behavioralTraits: ["Aggressive violent triggers", "Secures local political canvas as local community leader helper", "Exhibits heavy tactical force"],
    socialRiskFactors: ["Inter-caste conflicts, lack of steady livelihood opportunities", "History of minor violent reform stays"],
    associatedCrimes: ["FIR-2025-056"],
    allies: ["Shiva alias 'Skull Shiva'"],
    status: "IN_CUSTODY"
  }
];

export const NETWORK_NODES: NetworkNode[] = [
  // Suspects
  { id: "S_SHIVA", label: "Skull Shiva (Interrogated Burglar)", type: "suspect", riskLevel: "high" },
  { id: "S_VICKY", label: "Crypto Vicky (Tech Siphoner)", type: "suspect", riskLevel: "high" },
  { id: "S_RAZIQ", label: "Marine Raziq (Border Logistics)", type: "suspect", riskLevel: "high" },
  { id: "S_RAVI", label: "Local Ravi (Enforcer / Muscle)", type: "suspect", riskLevel: "medium" },
  { id: "S_PRASH", label: "Proxy Prash (Malware Host)", type: "suspect", riskLevel: "low" },
  { id: "S_FENCE", label: "Girish the Fence (Gold Receiver)", type: "suspect", riskLevel: "medium" },

  // Crimes
  { id: "C_102", label: "FIR-2026-102 (Power Bill Phish)", type: "crime", riskLevel: "medium" },
  { id: "C_105", label: "FIR-2026-105 (Majestic Jewelry burg)", type: "crime", riskLevel: "high" },
  { id: "C_224", label: "FIR-2026-224 (Coastal Contraband)", type: "crime", riskLevel: "high" },

  // Bank Accounts
  { id: "B_MULE1", label: "Mule Account (SBI Hubli SC-3101)", type: "bank_account", riskLevel: "medium" },
  { id: "B_GATEWAY", label: "Crypto Gateway (Bin-NonCust-510)", type: "bank_account", riskLevel: "high" },
  { id: "B_FENCE_ACC", label: "Fence Account (Canara Majestic 776)", type: "bank_account", riskLevel: "medium" },

  // Locations
  { id: "L_KORA", label: "Koramangala IT Sector", type: "location" },
  { id: "L_MAJ", label: "Majestic Junction Rail Yards", type: "location" },
  { id: "L_BUNDER", label: "Bunder Port Wharf", type: "location" }
];

export const NETWORK_LINKS: NetworkLink[] = [
  // Accused -> Crime
  { source: "S_SHIVA", target: "C_105", type: "Executed Burg" },
  { source: "S_RAVI", target: "C_105", type: "Provided Logistics" },
  { source: "S_VICKY", target: "C_102", type: "Designed Phish Payload" },
  { source: "S_RAZIQ", target: "C_224", type: "Ocean Transit Lead" },

  // Accused -> Accused
  { source: "S_SHIVA", target: "S_RAVI", type: "Syndicate Allies" },
  { source: "S_VICKY", target: "S_PRASH", type: "Code Sharing Allies" },
  { source: "S_SHIVA", target: "S_FENCE", type: "Fencing Contractor" },

  // Crimes -> Bank Accounts / Transactions
  { source: "C_102", target: "B_MULE1", type: "Stolen Transfer Out" },
  { source: "C_102", target: "B_GATEWAY", type: "Cryptographic Wash" },
  { source: "C_105", target: "B_FENCE_ACC", type: "Gold Asset Liquidation" },

  // Crimes -> Locations
  { source: "C_102", target: "L_KORA", type: "Geospatial Inception" },
  { source: "C_105", target: "L_MAJ", type: "Target Site" },
  { source: "C_224", target: "L_BUNDER", type: "Border Wharf Intercept" }
];

export const SOCIOLOGICAL_INSIGHTS: SociologicalScale[] = [
  {
    indicator: "Rapid Unplanned Urban Expansion Rate",
    value: "+34.2% YoY (Bengaluru Peripheral)",
    impactOnCrime: "Fosters high-density cyber-mule recruiting clusters and temporary physical hideouts in unpoliced semi-urban zones.",
    crimeCorrelation: "Strong Positive"
  },
  {
    indicator: "Unemployed Technical Graduate Ratio",
    value: "18.4% in Urban Hotspots",
    impactOnCrime: "Direct correlation to Sophisticated Telecomm Fraud, spear-phishing payloads, and dark-web crypto laundering rings.",
    crimeCorrelation: "Strong Positive"
  },
  {
    indicator: "Inter-State Border Cargo Velocity (NH-66 / NH-48)",
    value: "25,000 Trucks/Daily",
    impactOnCrime: "Exploited by highly structured maritime contraband networks hiding materials under heavy fish or manufacturing freight.",
    crimeCorrelation: "Moderate Positive"
  },
  {
    indicator: "Localized Secondary Metal Recycle Hub Concentration",
    value: "High density (Majestic, Hubli Bypass)",
    impactOnCrime: "Acts as rapid localized melting yards for heavy store breaches, dismantling CCTV housings and selling copper/gold within hours.",
    crimeCorrelation: "Moderate Positive"
  },
  {
    indicator: "Digital Literacy Index (Aged 18-50)",
    value: "78% across Karnataka Metro",
    impactOnCrime: "Decreases success rates of archaic bank account scam phonecalls, forcing syndicates to shift to extremely clean Kaveri 2.0 forged seals.",
    crimeCorrelation: "Negative"
  }
];

export const TIME_TRENDS_DATA = [
  { month: "Jan", cyber: 120, burglary: 85, smuggling: 45, violence: 90 },
  { month: "Feb", cyber: 142, burglary: 78, smuggling: 48, violence: 84 },
  { month: "Mar", cyber: 195, burglary: 92, smuggling: 39, violence: 95 },
  { month: "Apr", cyber: 210, burglary: 115, smuggling: 62, violence: 110 }, // smuggling peak NH checkpoint
  { month: "May", cyber: 265, burglary: 130, smuggling: 55, violence: 115 }, // cyber Bill peak pre-monsoon KPTCL fake warnings
  { month: "Jun", cyber: 240, burglary: 145, smuggling: 71, violence: 122 }  // monsoon burglary peaks
];

export const SPATIOTEMPORAL_CLUSTERS = [
  { hours: "00:00 - 04:00", title: "Burglary & Border Trafficking", frequency: "CRUCIAL RED ALERT", primaryCategory: "Burglary / smuggling" },
  { hours: "08:00 - 12:00", title: "Document Forgery & Financial Broker Fraud", frequency: "INTERMEDIATE", primaryCategory: "White Collar Scams" },
  { hours: "13:00 - 17:00", title: "Cyber Billing Phishing Dissemination", frequency: "RECURRENT CYAN ALERT", primaryCategory: "Digital Phishing / SMS Sploit" },
  { hours: "18:00 - 23:00", title: "Urban Gang extortions & Port Smuggling", frequency: "HIGH THREAT", primaryCategory: "Physical Trafficking / Assault" }
];

export const SYSTEM_AUDIT_LOGS: AuditLog[] = [
  { timestamp: "2026-06-14T03:52:10Z", user: "IA-Patil-610", role: "INVESTIGATOR", action: "FIR Decrypt Query", details: "Decrypted full biometric details and current wanted tracker status for suspect Shiva (Skull Shiva)", status: "ALLOWED" },
  { timestamp: "2026-06-14T03:55:40Z", user: "ANA-Anjali-90", role: "ANALYST", action: "Correlation Model Sync", details: "Linked Koramangala cyber fraud ring to CRYP-GAT-510 ledger traces.", status: "ALLOWED" },
  { timestamp: "2026-06-14T04:02:15Z", user: "SUP-Gowda-02", role: "SUPERVISOR", action: "Oversee Wanted Override", details: "Marked wanted bounty elevation for suspect Vikram. Action broadcasted to Hubli units.", status: "ALLOWED" },
  { timestamp: "2026-06-14T04:05:00Z", user: "POL-Secretary-1", role: "POLICYMAKER", action: "District-wide Forecasting Export", details: "Calculated state-level sociological correlation matrix with urbanization trends", status: "ALLOWED" },
  { timestamp: "2026-06-14T04:07:33Z", user: "IA-Patil-610", role: "INVESTIGATOR", action: "Override Security Protocol", details: "Attempted to delete raw transaction trails of mule accounts. Intercepted by Catalyst Circuits Security Gate.", status: "DENIED" }
];
