import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AnalysisSummary } from "@/components/analysis/analysis-summary";
import { LineItemsTable } from "@/components/analysis/line-items-table";
import { SavingsOpportunities } from "@/components/analysis/savings-opportunities";
import { DisputeDraft } from "@/components/analysis/dispute-draft";
import { NextActions } from "@/components/analysis/next-actions";
import { getMockAnalysis } from "@/lib/billing/mock-data";
import type { GeneratedOutput } from "@/types";

export const metadata: Metadata = {
  title: "Bill Analysis",
};

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;

  // In production: fetch from Supabase by analysis ID
  // For MVP: use mock data for any ID that starts with "mock-" or is "demo"
  const data = getMockAnalysis(id);

  if (!data) {
    notFound();
  }

  const { analysis, outputs, providerName } = data;

  return (
    <>
      <AppHeader
        title="Bill analysis"
        subtitle={providerName ? `${providerName} · ${new Date(analysis.createdAt).toLocaleDateString()}` : "Analysis complete"}
      />

      <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">
        {/* Status banner */}
        <div className="rounded-xl border border-accent-200 bg-accent-50 px-5 py-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <p className="text-sm font-medium text-accent-700">
            Analysis complete — {analysis.lineItems.filter(i => i.flagStatus !== "valid").length} charges flagged for review
          </p>
        </div>

        {/* Summary */}
        <AnalysisSummary analysis={analysis} providerName={providerName} />

        {/* Line items */}
        <LineItemsTable lineItems={analysis.lineItems} />

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
