import type {
  AnalysisResult,
  BillLineItem,
  SavingsOpportunity,
  GeneratedOutput,
  EpisodeOfCare,
} from "@/types";

// ── Input params ──────────────────────────────────────────────────────────────

export interface AnalysisParams {
  caseId: string;
  ocrText: string;
  episode: EpisodeOfCare;
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
    episode: EpisodeOfCare
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
    case "mock":
    default: {
      const { MockAIAdapter } = await import("./mock");
      return new MockAIAdapter();
    }
  }
}
