import { NextRequest, NextResponse } from "next/server";
import { getMockAnalysis } from "@/lib/billing/mock-data";
import { createServiceClient } from "@/lib/supabase/server";
import type { AnalysisResult, BillLineItem, GeneratedOutput, SavingsOpportunity, ChargeFlag, GeneratedOutputType } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Analysis ID required" }, { status: 400 });
  }

  // Fall back to mock data for demo route and mock-prefixed IDs
  if (id === "demo" || id.startsWith("mock-")) {
    const data = getMockAnalysis(id);
    if (!data) return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    return NextResponse.json(data, { status: 200 });
  }

  // ── Fetch from Supabase ──────────────────────────────────────────────────────
  try {
    const supabase = await createServiceClient();

    // Fetch analysis row
    const { data: analysisRow, error: analysisError } = await supabase
      .from("bill_analyses")
      .select("*")
      .eq("id", id)
      .single();

    if (analysisError || !analysisRow) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    // Fetch case for provider name
    const { data: caseRow } = await supabase
      .from("cases")
      .select("provider_name")
      .eq("id", analysisRow.case_id)
      .single();

    // Fetch line items
    const { data: lineItemRows } = await supabase
      .from("bill_line_items")
      .select("*")
      .eq("analysis_id", id)
      .order("date_of_service", { ascending: true });

    // Fetch generated outputs
    const { data: outputRows } = await supabase
      .from("generated_outputs")
      .select("*")
      .eq("analysis_id", id);

    // Extract savings opportunities and disclaimer from raw_ai_response JSONB
    const raw = analysisRow.raw_ai_response as {
      savingsOpportunities?: SavingsOpportunity[];
      disclaimer?: string;
    } | null;

    const analysis: AnalysisResult = {
      id: analysisRow.id,
      caseId: analysisRow.case_id,
      status: analysisRow.status as AnalysisResult["status"],
      createdAt: analysisRow.created_at,
      plainSummary: analysisRow.plain_summary ?? "",
      totalBilled: Number(analysisRow.total_billed ?? 0),
      totalFlagged: Number(analysisRow.total_flagged ?? 0),
      potentialSavings: Number(analysisRow.potential_savings ?? 0),
      confidenceScore: Number(analysisRow.confidence_score ?? 0),
      disclaimer: raw?.disclaimer ?? "This analysis is informational support only.",
      lineItems: (lineItemRows ?? []).map((row): BillLineItem => ({
        id: row.id,
        analysisId: row.analysis_id,
        description: row.description ?? "",
        cptCode: row.cpt_code ?? undefined,
        quantity: Number(row.quantity ?? 1),
        unitPrice: Number(row.unit_price ?? 0),
        totalPrice: Number(row.total_price ?? 0),
        dateOfService: row.date_of_service ?? undefined,
        flagStatus: row.flag_status as ChargeFlag,
        flagReason: row.flag_reason ?? undefined,
        suggestedPrice: row.suggested_price != null ? Number(row.suggested_price) : undefined,
        confidence: Number(row.confidence ?? 0),
      })),
      savingsOpportunities: raw?.savingsOpportunities ?? [],
    };

    const outputs: GeneratedOutput[] = (outputRows ?? []).map((row) => ({
      id: row.id,
      analysisId: row.analysis_id,
      type: row.type as GeneratedOutputType,
      content: row.content ?? "",
      createdAt: row.created_at,
    }));

    return NextResponse.json(
      {
        analysis,
        outputs,
        providerName: caseRow?.provider_name ?? null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching analysis:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
