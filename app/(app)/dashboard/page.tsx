import type { Metadata } from "next";
import Link from "next/link";
import { Upload } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { AnalysisResult } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

type DashboardAnalysis = AnalysisResult & {
  providerName?: string;
  caseId: string;
};

async function getRecentAnalyses(): Promise<DashboardAnalysis[]> {
  try {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) return [];

    const supabase = await createServiceClient();

    // First get case IDs for this user
    const { data: userCases } = await supabase
      .from("cases")
      .select("id")
      .eq("user_id", user.id);

    if (!userCases || userCases.length === 0) return [];
    const caseIds = userCases.map((c) => c.id);

    const { data: rows, error } = await supabase
      .from("bill_analyses")
      .select("id, case_id, status, created_at, total_billed, total_flagged, potential_savings, confidence_score")
      .in("case_id", caseIds)
      .eq("status", "complete")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !rows || rows.length === 0) return [];

    // Fetch provider names — caseIds already known from above
    const { data: cases } = await supabase
      .from("cases")
      .select("id, provider_name")
      .in("id", caseIds);

    const caseMap = new Map(
      (cases ?? []).map((c) => [c.id, c.provider_name ?? undefined])
    );

    return rows.map((row): DashboardAnalysis => ({
      id: row.id,
      caseId: row.case_id,
      status: row.status as AnalysisResult["status"],
      createdAt: row.created_at,
      plainSummary: "",
      totalBilled: Number(row.total_billed ?? 0),
      totalFlagged: Number(row.total_flagged ?? 0),
      potentialSavings: Number(row.potential_savings ?? 0),
      confidenceScore: Number(row.confidence_score ?? 0),
      disclaimer: "",
      lineItems: [],
      savingsOpportunities: [],
      providerName: caseMap.get(row.case_id),
    }));
  } catch {
    return [];
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const params = await (searchParams ?? Promise.resolve({ q: undefined }));
  const searchQuery = (params.q ?? "").trim().toLowerCase();

  const allAnalyses = await getRecentAnalyses();
  const analyses = searchQuery
    ? allAnalyses.filter((a) =>
        (a.providerName ?? "").toLowerCase().includes(searchQuery)
      )
    : allAnalyses;

  const hasAnalyses = analyses.length > 0;

  const totalBilled = analyses.reduce((s, a) => s + a.totalBilled, 0);
  const totalSavings = analyses.reduce((s, a) => s + a.potentialSavings, 0);
  const flaggedCount = analyses.reduce((s, a) => s + a.lineItems.filter((i) => i.flagStatus !== "valid").length, 0);

  return (
    <>
      <AppHeader
        title={searchQuery ? `Results for "${searchQuery}"` : "Dashboard"}
        subtitle={searchQuery ? `${analyses.length} matching analysis${analyses.length !== 1 ? "es" : ""}` : "Your medical billing analyses"}
      />

      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Welcome banner (first time) */}
        {!hasAnalyses && (
          <div className="rounded-2xl border border-primary-100 bg-primary-50 px-6 py-5 mb-8 flex items-center justify-between gap-6">
            <div>
              <h2 className="text-base font-semibold text-foreground mb-1">
                Welcome to Mediva
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Upload your first medical bill to get a plain-English breakdown, identify potential overcharges, and find ways to reduce your out-of-pocket costs.
              </p>
            </div>
            <Link href="/upload" className="shrink-0">
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Analyze a bill
              </Button>
            </Link>
          </div>
        )}

        {/* Stats */}
        {hasAnalyses && (
          <DashboardStats
            totalBilled={totalBilled}
            totalSavings={totalSavings}
            flaggedCount={flaggedCount}
            analysesCount={analyses.length}
          />
        )}

        {/* Recent analyses or empty state */}
        {hasAnalyses ? (
          <RecentAnalyses analyses={analyses} />
        ) : searchQuery ? (
          <div className="rounded-xl border border-border bg-white shadow-card px-6 py-12 text-center">
            <p className="text-sm font-semibold text-foreground mb-1">No matching analyses</p>
            <p className="text-xs text-muted-foreground">No bills found for &quot;{searchQuery}&quot;. Try a different provider name.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-white shadow-card">
            <EmptyState />
          </div>
        )}

        {/* Quick tip */}
        <div className="mt-8 rounded-xl border border-border bg-white p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            💡 Did you know?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Studies show that 3 in 4 medical bills contain errors. Common issues include duplicate charges, vague facility fees, and charges for services not received. Clario helps you find these before you pay.
          </p>
        </div>
      </div>
    </>
  );
}
