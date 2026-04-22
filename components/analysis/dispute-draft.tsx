"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Copy, Check, FileText, Download, Sparkles, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Inter } from "next/font/google";
import type { GeneratedOutput } from "@/types";

function parseLetterContent(raw: string): string {
  try {
    const obj = JSON.parse(raw);
    if (typeof obj === "object" && obj !== null) {
      const fields = [
        obj.date ? `Date: ${obj.date}` : null,
        obj.hospitalName ? `To: The Billing Manager\n${obj.hospitalName}` : null,
        obj.hospitalAddress ?? null,
        "",
        obj.subject ? `Subject: ${obj.subject}` : null,
        "",
        obj.body ?? null,
        "",
        obj.closing ?? null,
      ];
      return fields.filter((f) => f !== null).join("\n");
    }
    return raw;
  } catch {
    return raw;
  }
}

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface DisputeDraftProps {
  outputs: GeneratedOutput[];
}

export function DisputeDraft({ outputs }: DisputeDraftProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const disputeOutput = outputs.find((o) => o.type === "dispute_draft");
  const parsedContent = useMemo(() => parseLetterContent(disputeOutput?.content ?? ""), [disputeOutput?.content]);
  const [editedContent, setEditedContent] = useState(parsedContent);

  if (!disputeOutput) return null;

  const placeholderCount = (disputeOutput.content.match(/\[[^\]]+\]/g) ?? []).length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editedContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dispute-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className={`${inter.className} rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden`}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#2F2FE4]/10 to-blue-50 flex items-center justify-center">
              <FileText className="h-4 w-4 text-[#2F2FE4]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Dispute letter</h2>
              <p className="text-xs text-muted-foreground">Personalised to your bill</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2F2FE4] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            AI-generated
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex items-center gap-6">
          {/* Placeholder pill */}
          {placeholderCount > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 shrink-0">
              <PenLine className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-amber-700">{placeholderCount} placeholders</p>
                <p className="text-[11px] text-amber-600">Fill before sending</p>
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            A formal dispute letter addressed to the hospital billing department, referencing your specific flagged charges. Edit any{" "}
            <span className="font-semibold text-amber-600">[bracketed]</span> fields before sending.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="gap-1.5 text-xs">
              <PenLine className="h-3.5 w-3.5" />
              View &amp; edit
            </Button>
            <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5 text-xs">
              {copied ? <><Check className="h-3.5 w-3.5" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
            </Button>
            <Button size="sm" onClick={handleDownload} className="gap-1.5 text-xs bg-[#2F2FE4] hover:bg-[#2525c4] text-white">
              {downloaded ? <><Check className="h-3.5 w-3.5" />Saved</> : <><Download className="h-3.5 w-3.5" />Download</>}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`${inter.className} max-w-2xl p-0 overflow-hidden`}>
          {/* Modal header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#2F2FE4]/10 to-blue-50 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-[#2F2FE4]" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-base font-bold text-foreground leading-none">Dispute letter</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Fill in all <span className="text-amber-600 font-semibold">[bracketed]</span> placeholders before sending
              </DialogDescription>
            </div>
          </div>

          {/* Letter body */}
          <div className="px-6 py-4">
            <textarea
              className={`${inter.className} w-full text-sm text-slate-700 leading-7 bg-white rounded-xl p-5 h-80 overflow-y-auto border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 whitespace-pre-wrap`}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Tip */}
          <div className="mx-6 mb-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 flex items-start gap-2">
            <PenLine className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Send via registered post or email to the billing department. Keep a copy for your records.
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 pb-5 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Close</Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Download .txt
            </Button>
            <Button size="sm" onClick={handleCopy} className="gap-1.5 bg-[#2F2FE4] hover:bg-[#2525c4]">
              {copied ? <><Check className="h-3.5 w-3.5" />Copied!</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
