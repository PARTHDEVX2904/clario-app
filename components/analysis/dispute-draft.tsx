"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, FileText, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { GeneratedOutput } from "@/types";

interface DisputeDraftProps {
  outputs: GeneratedOutput[];
}

const typeConfig: Record<
  GeneratedOutput["type"],
  { label: string; icon: React.ElementType; description: string }
> = {
  dispute_draft: {
    label: "Dispute Letter",
    icon: FileText,
    description: "A formal letter to the hospital billing department disputing specific charges.",
  },
  negotiation_script: {
    label: "Phone Negotiation Guide",
    icon: Phone,
    description: "A step-by-step guide for negotiating your bill over the phone.",
  },
  complaint_letter: {
    label: "Formal Complaint",
    icon: MessageSquare,
    description: "A complaint letter to hospital management and regulatory bodies.",
  },
};

function OutputCard({ output }: { output: GeneratedOutput }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const config = typeConfig[output.type];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-white p-5 shadow-card hover:shadow-card-hover transition-shadow"
      >
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <config.icon className="h-5 w-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {config.label}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">{config.description}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen(true)}
              >
                View & edit
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{config.label}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>

          <div className="relative">
            <pre className="whitespace-pre-wrap text-xs font-mono text-foreground leading-relaxed bg-muted rounded-xl p-5 max-h-96 overflow-y-auto border border-border">
              {output.content}
            </pre>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy to clipboard
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function DisputeDraft({ outputs }: DisputeDraftProps) {
  if (outputs.length === 0) return null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">
          Ready-to-use documents
        </h2>
        <p className="text-sm text-muted-foreground">
          These documents are personalized to your specific charges. Review before sending — fill in any [bracketed] placeholders.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {outputs.map((output) => (
          <OutputCard key={output.id} output={output} />
        ))}
      </div>
    </div>
  );
}
