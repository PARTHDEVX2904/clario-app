import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { UploadStepper } from "@/components/upload/upload-stepper";

export const metadata: Metadata = {
  title: "Analyze a Bill",
};

export default function UploadPage() {
  return (
    <>
      <AppHeader
        title="Analyze a bill"
        subtitle="Upload your bill and answer a few questions to get started"
      />

      <div className="px-6 py-10 max-w-4xl mx-auto">
        {/* Page heading */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Let&apos;s review your bill
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Upload your medical bill and answer a few questions about your care. We&apos;ll analyze every line item and flag anything that needs attention.
          </p>
        </div>

        <UploadStepper />
      </div>
    </>
  );
}
