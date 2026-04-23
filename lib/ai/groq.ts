import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type {
  AIAdapter,
  AnalysisParams,
  AIAnalysisOutput,
  GeneratedDrafts,
} from "./adapter";
import type { ConditionEntry } from "@/lib/billing/conditions-kb";
import type { EpisodeOfCare } from "@/types";

// Groq uses an OpenAI-compatible API — no extra package needed
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

// Text model for analysing pre-extracted OCR text
const TEXT_MODEL = "llama-3.3-70b-versatile";

const ANALYSIS_PROMPT = (
  ctx: {
    providerName: string;
    providerCity: string;
    providerState: string;
    insuranceStatus: string;
    healthIssueDescription: string;
    hadErVisit: boolean;
    hadImaging: boolean;
    hadBloodTests: boolean;
    hadSurgery: boolean;
    hadRoomStay: boolean;
    hadMedicines: boolean;
    hadFollowupVisits: boolean;
  },
  conditionContext?: ConditionEntry
) => `You are an expert Indian medical billing analyst helping patients understand and challenge hospital bills in India.

CRITICAL RULES — follow exactly:
1. Read every number EXACTLY as printed on the bill — do NOT estimate, round, or invent any figure
2. totalBilled MUST equal the grand total / net payable / total amount printed on the bill
3. lineItems MUST list every individual charge found in the bill — copy descriptions and amounts verbatim
4. Every unitPrice and totalPrice MUST come directly from the bill — use 0 if you cannot find an exact figure
5. totalFlagged = arithmetic sum of totalPrice for line items where flagStatus is NOT "valid"
6. totalFlagged MUST be ≤ totalBilled — hard constraint, recheck before returning
7. potentialSavings: set to 0 — this field is computed server-side, do not estimate it
8. All amounts are in Indian Rupees (INR) — numbers only, no currency symbols
9. If a value is illegible or missing, use 0 — NEVER guess a plausible-sounding number
10. Be factual — label flags as review guidance, never legal/medical certainty

SELF-CHECK before returning:
• Is totalBilled exactly the figure printed on the bill?
• Is totalFlagged = sum of non-valid line items?
• Is totalFlagged ≤ totalBilled?

INDIA-SPECIFIC FLAGS TO LOOK FOR:
- Consumables padding: IV fluids, syringes, gloves billed at 5–10× MRP → possibly_overcharged
- Same procedure billed twice from different departments → possibly_overcharged
- Vague "Miscellaneous" / "Service Charge" with no breakdown → review_needed
- Pharmacy charges above MRP printed on medicine strips → possibly_overcharged
- Room/facility charges exceeding quoted rate → review_needed
- Duplicate diagnostic tests (same blood test listed twice) → possibly_overcharged
- CGHS/NABH rate violations (if hospital is accredited) → review_needed
- Admin/processing fees — often waivable → review_needed
${conditionContext ? `
CONDITION-SPECIFIC CONTEXT for "${conditionContext.conditionName}":
Use this clinical knowledge to flag charges that are inappropriate for this condition.

- Expected treatments (mark as valid if present): ${conditionContext.expected.join(", ")}
- Sometimes required depending on severity (valid if clinically justified): ${conditionContext.sometimes.join(", ")}
- Rarely required — flag as review_needed if no documented justification: ${conditionContext.rare.join(", ")}
- NOT expected for this condition — flag as possibly_overcharged if present: ${conditionContext.notExpected.join(", ")}
- Clinical notes: ${conditionContext.notes}
` : ""}
Patient episode context:
- Provider: ${ctx.providerName} (${ctx.providerCity}, ${ctx.providerState})
- Insurance: ${ctx.insuranceStatus}
- Health issue: ${ctx.healthIssueDescription}
- ER visit: ${ctx.hadErVisit}, Imaging: ${ctx.hadImaging}, Blood tests: ${ctx.hadBloodTests}
- Surgery: ${ctx.hadSurgery}, Room stay: ${ctx.hadRoomStay}
- Medicines: ${ctx.hadMedicines}, Follow-up: ${ctx.hadFollowupVisits}

Return this exact JSON (raw JSON only, no markdown, no code fences):
{
  "plainSummary": "2-3 paragraph plain English summary referencing exact amounts from the bill",
  "totalBilled": <grand total from the bill as a number>,
  "totalFlagged": <sum of flagged line item totals>,
  "potentialSavings": 0,
  "confidenceScore": <number 0-1>,
  "lineItems": [
    {
      "id": "uuid string",
      "description": "<exact description from bill>",
      "cptCode": "<code if present or null>",
      "quantity": <number>,
      "unitPrice": <exact unit price from bill>,
      "totalPrice": <exact total price from bill>,
      "dateOfService": "<YYYY-MM-DD or null>",
      "flagStatus": "valid or review_needed or possibly_overcharged",
      "flagReason": "<reason string or null>",
      "suggestedPrice": <number or null>,
      "confidence": <number 0-1>
    }
  ],
  "savingsOpportunities": [
    {
      "description": "string",
      "estimatedSavings": <number or null>,
      "actionRequired": "string",
      "priority": "high or medium or low"
    }
  ],
  "disclaimer": "This analysis is informational support only. It is not legal or medical advice."
}`;

/** Escape literal newlines/tabs inside JSON string values (common LLM output bug) */
function sanitizeJSONStrings(s: string): string {
  let result = "";
  let inString = false;
  let escaped = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escaped) { result += ch; escaped = false; continue; }
    if (ch === "\\") { result += ch; escaped = true; continue; }
    if (ch === '"') { inString = !inString; result += ch; continue; }
    if (inString && ch === "\n") { result += "\\n"; continue; }
    if (inString && ch === "\r") { result += "\\r"; continue; }
    if (inString && ch === "\t") { result += "\\t"; continue; }
    result += ch;
  }
  return result;
}

function parseJSON(raw: string): AIAnalysisOutput {
  // Strip markdown code fences if model wraps output despite instructions
  let cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  // If the model prepends prose (e.g. "Here is the JSON: {...}"), extract
  // just the JSON object by finding the first '{' and last '}'
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && start < end) {
    cleaned = cleaned.slice(start, end + 1);
  }

  // First attempt — parse as-is
  try {
    return JSON.parse(cleaned) as AIAnalysisOutput;
  } catch {
    // Second attempt — sanitize unescaped control chars inside string values
    return JSON.parse(sanitizeJSONStrings(cleaned)) as AIAnalysisOutput;
  }
}

export class GroqAdapter implements AIAdapter {
  async analyzeBill(params: AnalysisParams): Promise<AIAnalysisOutput> {
    const promptText = ANALYSIS_PROMPT(params.episode, params.conditionContext);
    const fullPrompt = `${promptText}\n\nBILL TEXT:\n${params.ocrText}`;

    const response = await groq.chat.completions.create({
      model: TEXT_MODEL,
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0.1,
      max_tokens: 8192,
    });

    const raw = response.choices[0]?.message?.content ?? "";
    if (!raw) throw new Error("No response from Groq");

    const parsed = parseJSON(raw);

    parsed.lineItems = parsed.lineItems.map((item) => ({
      ...item,
      id: item.id || uuidv4(),
    }));

    parsed.disclaimer =
      parsed.disclaimer ||
      "This analysis is informational support only. It is not legal or medical advice.";

    return parsed;
  }

  async generateDrafts(
    analysis: AIAnalysisOutput,
    episode: EpisodeOfCare,
    patientName?: string
  ): Promise<GeneratedDrafts> {
    const flaggedItems = analysis.lineItems
      .filter((i) => i.flagStatus !== "valid")
      .map(
        (i) =>
          `- ${i.description}: ₹${i.totalPrice} — ${i.flagReason || i.flagStatus}`
      )
      .join("\n");

    const name = patientName?.trim() || "[Your Name]";

    const prompt = `Generate three documents for an Indian hospital billing dispute.

IMPORTANT: Return a JSON object with exactly three keys: disputeDraft, negotiationScript, complaintLetter.
Each value MUST be a plain text STRING (a complete, ready-to-send document). Do NOT nest JSON objects inside the values — each value is a multi-line string only.

Context:
- Patient name: ${name}
- Hospital: ${episode.providerName} (${episode.providerCity}, ${episode.providerState}), India
- Health issue: ${episode.healthIssueDescription}
- Total billed: ₹${analysis.totalBilled}
- Flagged charges:
${flaggedItems || "None identified"}
- Potential savings: ₹${analysis.potentialSavings}

Documents needed (each must be a complete plain-text letter/script string, not a JSON object):
1. disputeDraft: Formal letter to the hospital billing department. Start with "Date: [Current Date]", then "To: The Billing Manager, ${episode.providerName}". Use "${name}" as the patient name throughout. When listing the flagged charges, format them as a numbered list (one charge per line, e.g. "  1. Duplicate LFT Test — ₹1500 (reason)"), NOT as a comma-separated inline sentence. After the list, request itemized justification for each. Reference Consumer Protection Act 2019. Close with "Sincerely,\n${name}".
2. negotiationScript: Step-by-step phone script. Start with "PHONE NEGOTIATION GUIDE". Use numbered steps, include exact phrases to say, what to ask for, and how to escalate.
3. complaintLetter: Formal complaint to Medical Superintendent / Patient Relations Officer. Use "${name}" as the patient name. Mention escalation to State Medical Council or National Consumer Helpline (1800-11-4000) if unresolved.

All amounts in INR (₹). Each document must be professional, specific, and actionable. Values are plain strings — no nested JSON.`;

    const response = await groq.chat.completions.create({
      model: TEXT_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 4096,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("No response from Groq");

    return parseJSON(raw) as unknown as GeneratedDrafts;
  }
}
