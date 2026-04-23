import type {
  AnalysisResult,
  BillLineItem,
  SavingsOpportunity,
  GeneratedOutput,
  EpisodeOfCare,
} from "@/types";
import type { ConditionEntry } from "@/lib/billing/conditions-kb";

// ── Input params ──────────────────────────────────────────────────────────────

export interface AnalysisParams {
  caseId: string;
  ocrText: string;
  episode: EpisodeOfCare;
  /** Resolved condition entry from the knowledge base — injected into AI prompt */
  conditionContext?: ConditionEntry;
}

// ── Output shape ──────────────────────────────────────────────────────────────

export interface AIAnalysisOutput {
  plainSummary: string;
  totalBilled: number;
  totalFlagged: number;
  potentialSavings: number;
  confidenceScore: number;
  lineItems: Omit<BillLineItem, "analysisId">[];
  savingsOpportunities: Omit<SavingsOpportunity, "id">[];
  disclaimer: string;
}

export interface GeneratedDrafts {
  disputeDraft: string;
  negotiationScript: string;
  complaintLetter: string;
}

export interface AIAdapter {
  analyzeBill(params: AnalysisParams): Promise<AIAnalysisOutput>;
  generateDrafts(
    analysis: AIAnalysisOutput,
    episode: EpisodeOfCare,
    patientName?: string
  ): Promise<GeneratedDrafts>;
}

// Factory — returns the configured adapter
export async function getAIAdapter(): Promise<AIAdapter> {
  const provider = process.env.AI_PROVIDER ?? "mock";

  switch (provider) {
    case "openai": {
      const { OpenAIAdapter } = await import("./openai");
      return new OpenAIAdapter();
    }
    case "gemini": {
      const { GeminiAdapter } = await import("./gemini");
      return new GeminiAdapter();
    }
    case "groq": {
      const { GroqAdapter } = await import("./groq");
      return new GroqAdapter();
    }
    case "mock":
    default: {
      const { MockAIAdapter } = await import("./mock");
      return new MockAIAdapter();
    }
  }
}
