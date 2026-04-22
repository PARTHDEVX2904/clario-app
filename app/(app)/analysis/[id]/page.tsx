import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AnalysisSummary } from "@/components/analysis/analysis-summary";
import { SavingsOpportunities } from "@/components/analysis/savings-opportunities";
import { DisputeDraft } from "@/components/analysis/dispute-draft";
import { NextActions } from "@/components/analysis/next-actions";
import { createServiceClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";
import type { AnalysisResult, BillLineItem, GeneratedOutput, SavingsOpportunity } from "@/types";

export const metadata: Metadata = {
  title: "Bill Analysis",
};

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

async function getAnalysis(id: string): Promise<{
  analysis: AnalysisResult;
  outputs: GeneratedOutput[];
  providerName?: string;
} | null> {
  try {
    const supabase = await createServiceClient();

    // Fetch analysis row
    const { data: analysisRow, error: analysisError } = await supabase
      .from("bill_analyses")
      .select("id, case_id, status, created_at, plain_summary, total_billed, total_flagged, potential_savings, confidence_score, raw_ai_response")
      .eq("id", id)
      .single();

    if (analysisError || !analysisRow) return null;

    // Fetch line items
    const { data: lineRows } = await supabase
      .from("bill_line_items")
      .select("id, analysis_id, description, cpt_code, quantity, unit_price, total_price, date_of_service, flag_status, flag_reason, suggested_price, confidence")
      .eq("analysis_id", id);

    // Fetch generated outputs
    const { data: outputRows } = await supabase
      .from("generated_outputs")
      .select("id, analysis_id, type, content, created_at")
      .eq("analysis_id", id);

    // Fetch provider name from cases table
    const { data: caseRow } = await supabase
      .from("cases")
      .select("provider_name")
      .eq("id", analysisRow.case_id)
      .single();

    // Map raw_ai_response JSONB → savingsOpportunities + disclaimer
    const rawJson = analysisRow.raw_ai_response as {
      savingsOpportunities?: Omit<SavingsOpportunity, "id">[];
      disclaimer?: string;
    } | null;

    const lineItems: BillLineItem[] = (lineRows ?? []).map((row) => ({
      id: row.id,
      analysisId: row.analysis_id,
      description: row.description,
      cptCode: row.cpt_code ?? undefined,
      quantity: Number(row.quantity),
      unitPrice: Number(row.unit_price),
      totalPrice: Number(row.total_price),
      dateOfService: row.date_of_service ?? undefined,
      flagStatus: row.flag_status as BillLineItem["flagStatus"],
      flagReason: row.flag_reason ?? undefined,
      suggestedPrice: row.suggested_price != null ? Number(row.suggested_price) : undefined,
      confidence: Number(row.confidence),
    }));

    const savingsOpportunities: SavingsOpportunity[] = (rawJson?.savingsOpportunities ?? []).map(
      (opp) => ({ ...opp, id: uuidv4() })
    );

    const totalBilled = Number(analysisRow.total_billed ?? 0);
    const totalFlagged = Number(analysisRow.total_flagged ?? 0);
    // Potential savings = sum of estimatedSavings from opportunities (computed at analysis time)
    const potentialSavings = savingsOpportunities.reduce(
      (sum, opp) => sum + (opp.estimatedSavings ?? 0),
      0
    );

    const analysis: AnalysisResult = {
      id: analysisRow.id,
      caseId: analysisRow.case_id,
      status: analysisRow.status as AnalysisResult["status"],
      createdAt: analysisRow.created_at,
      plainSummary: analysisRow.plain_summary ?? "",
      totalBilled,
      totalFlagged,
      potentialSavings,
      confidenceScore: Number(analysisRow.confidence_score ?? 0),
      lineItems,
      savingsOpportunities,
      disclaimer: rawJson?.disclaimer ?? "This analysis is informational support only. It is not legal or medical advice.",
    };

    const outputs: GeneratedOutput[] = (outputRows ?? []).map((row) => ({
      id: row.id,
      analysisId: row.analysis_id,
      type: row.type as GeneratedOutput["type"],
      content: row.content,
      createdAt: row.created_at,
    }));

    return {
      analysis,
      outputs,
      providerName: caseRow?.provider_name ?? undefined,
    };
  } catch {
    return null;
  }
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;
  const data = await getAnalysis(id);

  if (!data) {
    notFound();
  }

  const { analysis, outputs, providerName } = data;
  const flaggedCount = analysis.savingsOpportunities.length;

  return (
    <>
      <AppHeader
        title="Bill analysis"
        subtitle={
          providerName
            ? `${providerName} · ${new Date(analysis.createdAt).toLocaleDateString("en-IN")}`
            : "Analysis complete"
        }
      />

      <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">
        {/* Status banner */}
        <div className="rounded-xl border border-accent-200 bg-accent-50 px-5 py-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <p className="text-sm font-medium text-accent-700">
            Analysis complete — {flaggedCount} {flaggedCount === 1 ? "charge" : "charges"} flagged for review
          </p>
        </div>

        {/* Summary */}
        <AnalysisSummary analysis={analysis} providerName={providerName} />

        {/* Savings */}
        <SavingsOpportunities
          opportunities={analysis.savingsOpportunities}
          totalSavings={analysis.potentialSavings}
        />

        {/* Documents */}
        <DisputeDraft outputs={outputs} />

        {/* Next steps */}
        <NextActions />
      </div>
    </>
  );
}
