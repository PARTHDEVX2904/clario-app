// ─────────────────────────────────────────────────────────────────────────────
// Core domain types for Clario
// ─────────────────────────────────────────────────────────────────────────────

// ── Patient / Episode ─────────────────────────────────────────────────────────

export type InsuranceStatus = "insured" | "self_pay" | "unknown";

export interface Patient {
  id: string;
  sessionId?: string; // for anonymous users
  userId?: string; // for authenticated users
  name?: string;
  createdAt: string;
}

export interface EpisodeOfCare {
  providerName: string;
  providerCity: string;
  providerState: string;
  providerCountry: string;
  insuranceStatus: InsuranceStatus;
  healthIssueDescription: string;
  // What happened during the episode
  hadErVisit: boolean;
  hadImaging: boolean;
  hadBloodTests: boolean;
  hadSurgery: boolean;
  hadRoomStay: boolean;
  hadMedicines: boolean;
  hadFollowupVisits: boolean;
  hasMultipleBills: boolean;
  // Derived
  admissionDate?: string;
  dischargeDate?: string;
}

// ── Case ─────────────────────────────────────────────────────────────────────

export type CaseStatus = "pending" | "processing" | "complete" | "error";

export interface Case {
  id: string;
  sessionId?: string;
  userId?: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  episode: EpisodeOfCare;
}

// ── Documents ─────────────────────────────────────────────────────────────────

export type DocumentType = "bill" | "eob" | "other";

export interface UploadedDocument {
  id: string;
  caseId: string;
  type: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  filePath?: string; // Supabase storage path
  ocrText?: string;
  ocrStatus: "pending" | "processing" | "done" | "error";
  createdAt: string;
}

// ── Bill Line Items ────────────────────────────────────────────────────────────

export type ChargeFlag = "valid" | "review_needed" | "possibly_overcharged";

export interface BillLineItem {
  id: string;
  analysisId: string;
  description: string;
  cptCode?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  dateOfService?: string;
  // Analysis results
  flagStatus: ChargeFlag;
  flagReason?: string;
  suggestedPrice?: number;
  confidence: number; // 0-1
}

// ── Analysis ─────────────────────────────────────────────────────────────────

export type AnalysisStatus = "pending" | "processing" | "complete" | "error";

export interface SavingsOpportunity {
  id: string;
  description: string;
  estimatedSavings?: number;
  actionRequired: string;
  priority: "high" | "medium" | "low";
}

export interface AnalysisResult {
  id: string;
  caseId: string;
  status: AnalysisStatus;
  createdAt: string;
  // Summary
  plainSummary: string;
  totalBilled: number;
  totalFlagged: number;
  potentialSavings: number;
  confidenceScore: number; // 0-1
  // Detail
  lineItems: BillLineItem[];
  savingsOpportunities: SavingsOpportunity[];
  // Disclaimer is always shown
  disclaimer: string;
}

// ── Generated Outputs ──────────────────────────────────────────────────────────

export type GeneratedOutputType =
  | "complaint_letter"
  | "dispute_draft"
  | "negotiation_script";

export interface GeneratedOutput {
  id: string;
  analysisId: string;
  type: GeneratedOutputType;
  content: string;
  createdAt: string;
}

// ── Upload Flow State ──────────────────────────────────────────────────────────

export interface UploadFlowState {
  step: number;
  billFile?: File;
  eobFile?: File;
  episode: Partial<EpisodeOfCare>;
  caseId?: string;
}

// ── Billing Heuristics ────────────────────────────────────────────────────────

export interface HeuristicFlag {
  lineItemIndex: number;
  type:
    | "duplicate"
    | "high_quantity"
    | "vague_facility_fee"
    | "care_mismatch"
    | "ambiguous_charge"
    | "unusually_high_price"
    | "admin_fee";
  severity: "info" | "warning" | "alert";
  reason: string;
}
