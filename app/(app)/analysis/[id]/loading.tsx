import { Spinner } from "@/components/ui/spinner";

export default function AnalysisLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner size="lg" />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Analyzing your bill…</p>
        <p className="text-xs text-muted-foreground mt-1">
          This usually takes 30–60 seconds
        </p>
      </div>
    </div>
  );
}
