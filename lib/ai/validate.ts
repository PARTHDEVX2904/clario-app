import { v4 as uuidv4 } from "uuid";
import type { AIAnalysisOutput } from "./adapter";

/**
 * Validates and coerces an AI analysis output in-place.
 * Throws on critical schema violations (missing required fields).
 * Fixes common LLM serialisation bugs (string numbers, out-of-range values,
 * missing IDs) silently.
 */
export function validateAIOutput(output: AIAnalysisOutput): void {
  if (typeof output.plainSummary !== "string" || !output.plainSummary) {
    throw new Error("AI output missing plainSummary");
  }
  if (!Array.isArray(output.lineItems)) {
    throw new Error("AI output missing lineItems array");
  }

  // Coerce string numbers — LLMs occasionally serialise numbers as strings
  output.totalBilled      = Number(output.totalBilled)      || 0;
  output.totalFlagged     = Number(output.totalFlagged)      || 0;
  output.potentialSavings = Number(output.potentialSavings)  || 0;
  output.confidenceScore  = Math.min(1, Math.max(0, Number(output.confidenceScore) || 0));

  // Hard constraint: flagged total cannot exceed billed total
  if (output.totalFlagged > output.totalBilled) {
    output.totalFlagged = output.totalBilled;
  }

  // Normalise every line item
  output.lineItems = output.lineItems.map((item) => ({
    ...item,
    id:         item.id || uuidv4(),
    unitPrice:  Number(item.unitPrice)  || 0,
    totalPrice: Number(item.totalPrice) || 0,
    quantity:   Number(item.quantity)   || 1,
    confidence: Math.min(1, Math.max(0, Number(item.confidence) || 0)),
  }));

  if (!Array.isArray(output.savingsOpportunities)) {
    output.savingsOpportunities = [];
  }
}
