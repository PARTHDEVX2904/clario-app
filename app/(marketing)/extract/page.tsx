"use client";

import { useState } from "react";

// Shape of the JSON Gemini returns
interface ExtractResult {
  hospital_name: string;
  patient_name: string;
  items: { name: string; quantity: string; amount: string }[];
  total: string;
}

export default function ExtractPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Send the image to /api/extract as multipart form data
    const form = new FormData();
    form.append("bill", file);

    const res = await fetch("/api/extract", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
    } else {
      setResult(data as ExtractResult);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-border shadow-card-lg p-8 w-full max-w-lg space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">Extract Bill Data</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a hospital bill image — Gemini will extract all charges.
          </p>
        </div>

        {/* File input */}
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-muted-foreground
            file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0
            file:text-sm file:font-medium file:bg-black file:text-white
            hover:file:bg-gray-900 cursor-pointer"
        />

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full py-2.5 rounded-lg bg-black text-white text-sm font-semibold
            disabled:opacity-50 hover:bg-gray-900 transition-colors"
        >
          {loading ? "Analyzing…" : "Extract"}
        </button>

        {/* Error message */}
        {error && (
          <p className="text-sm text-destructive bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {/* Structured result */}
        {result && (
          <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Hospital</p>
                <p className="text-sm font-medium text-foreground">{result.hospital_name || "—"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Patient</p>
                <p className="text-sm font-medium text-foreground">{result.patient_name || "—"}</p>
              </div>
            </div>

            {/* Line items table */}
            {result.items?.length > 0 && (
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-3 bg-slate-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Item</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Amount</span>
                </div>
                {result.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-3 px-3 py-2.5 text-sm border-t border-slate-100">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-center text-muted-foreground">{item.quantity}</span>
                    <span className="text-right font-medium text-foreground">{item.amount}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between rounded-xl bg-black text-white px-4 py-3">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-base font-bold">{result.total || "—"}</span>
            </div>

            {/* Raw JSON toggle */}
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">
                View raw JSON
              </summary>
              <pre className="mt-2 rounded-xl bg-slate-50 border border-slate-100 p-4 overflow-auto max-h-64">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </main>
  );
}
