export type Role = 'INVESTIGATOR' | 'ANALYST' | 'SUPERVISOR' | 'POLICYMAKER';

export type Language = 'EN' | 'KN';

export interface FIRCase {
  id: string; // FIR No (e.g., FIR-2026-089)
  district: string;
  policeStation: string;
  crimeCategory: string;
  date: string;
  timeOfOccurrence: string;
  modusOperandi: string;
  status: 'PENDING' | 'UNDER_INVESTIGATION' | 'CHARGE_SHEETED' | 'CLOSED';
  crimeDescription: string;
  victimDetails: {
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    socioEconomic: string;
    education: string;
  };
  accusedDetails: {
    name: string;
    alias?: string;
    age: number;
    gender: string;
    socioEconomic: string;
    criminalHistoryCount: number;
    repeatOffender: boolean;
    riskScore: number;
  };
  financialActivity?: {
    suspiciousAmount: number;
    bankAccounts: string[];
    transactionTrail: { from: string; to: string; amount: number; timestamp: string }[];
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface OffenderProfile {
  id: string;
  name: string;
  alias: string;
  age: number;
  riskScore: number; // 0 to 100
  primaryMO: string;
  behavioralTraits: string[];
  socialRiskFactors: string[];
  associatedCrimes: string[]; // FIR id references
  allies: string[]; // offender names
  status: 'ACTIVE' | 'IN_CUSTODY' | 'WANTED' | 'MONITORED';
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'suspect' | 'victim' | 'location' | 'crime' | 'bank_account';
  riskLevel?: 'high' | 'medium' | 'low';
}

export interface NetworkLink {
  source: string;
  target: string;
  type: string;
}

export interface AuditLog {
  timestamp: string;
  user: string;
  role: Role;
  action: string;
  details: string;
  status: 'ALLOWED' | 'FLAGGED' | 'DENIED';
}

export interface SociologicalScale {
  indicator: string;
  value: string;
  impactOnCrime: string;
  crimeCorrelation: 'Strong Positive' | 'Moderate Positive' | 'Negative' | 'Neutral';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  translation?: string; // Kannada or English translation
  timestamp: string;
  evidenceTrail?: string[]; // References used for explainable AI
}
