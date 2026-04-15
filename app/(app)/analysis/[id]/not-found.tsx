import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

export default function AnalysisNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
        <FileX className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Analysis not found</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          This analysis doesn&apos;t exist or may have expired. Try analyzing a new bill.
        </p>
      </div>
      <Link href="/upload">
        <Button>Analyze a new bill</Button>
      </Link>
    </div>
  );
}
