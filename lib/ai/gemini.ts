import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import type {
  AIAdapter,
  AnalysisParams,
  AIAnalysisOutput,
  GeneratedDrafts,
} from "./adapter";
import type { EpisodeOfCare } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Retries a Gemini call up to `maxRetries` times when a 429 rate-limit is hit.
// Waits `delayMs` before the first retry, doubling each time (exponential backoff).
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  delayMs = 15_000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);
      const isRateLimit = message.includes("429") || message.includes("quota") || message.includes("Quota");
      if (!isRateLimit || attempt === maxRetries) throw err;
      const wait = delayMs * (attempt + 1); // 15s → 30s
      console.warn(`Gemini rate-limited (attempt ${attempt + 1}). Retrying in ${wait / 1000}s…`);
      await new Promise((res) => setTimeout(res, wait));
    }
  }
  throw lastError;
}

export class GeminiAdapter implements AIAdapter {
  async analyzeBill(params: AnalysisParams): Promise<AIAnalysisOutput> {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are a medical billing analyst assistant. Your job is to help patients understand their hospital bills, identify potentially questionable charges, and find savings opportunities.

You MUST:
- Be factual and measured — never guarantee outcomes
- Label all flags as "review guidance" not legal/medical certainty
- Return valid JSON matching the schema below

Episode context provided by the patient:
- Provider: ${params.episode.providerName} (${params.episode.providerCity}, ${params.episode.providerState})
- Insurance: ${params.episode.insuranceStatus}
- Health issue: ${params.episode.healthIssueDescription}
- ER visit: ${params.episode.hadErVisit}, Imaging: ${params.episode.hadImaging}, Blood tests: ${params.episode.hadBloodTests}
- Surgery: ${params.episode.hadSurgery}, Room stay: ${params.episode.hadRoomStay}
- Medicines: ${params.episode.hadMedicines}, Follow-up: ${params.episode.hadFollowupVisits}

Analyze this medical bill OCR text and return a JSON response:

${params.ocrText}

Return this exact JSON shape:
{
  "plainSummary": "2-3 paragraph plain English summary",
  "totalBilled": number,
  "totalFlagged": number,
  "potentialSavings": number,
  "confidenceScore": number between 0 and 1,
  "lineItems": [
    {
      "id": "uuid string",
      "description": "string",
      "cptCode": "string or null",
      "quantity": number,
      "unitPrice": number,
      "totalPrice": number,
      "dateOfService": "YYYY-MM-DD or null",
      "flagStatus": "valid or review_needed or possibly_overcharged",
      "flagReason": "string or null",
      "suggestedPrice": "number or null",
      "confidence": number between 0 and 1
    }
  ],
  "savingsOpportunities": [
    {
      "description": "string",
      "estimatedSavings": "number or null",
      "actionRequired": "string",
      "priority": "high or medium or low"
    }
  ],
  "disclaimer": "standard disclaimer text"
}`;

    const result = await withRetry(() => model.generateContent(prompt));
    const raw = result.response.text();
    if (!raw) throw new Error("No response from Gemini");

    const parsed = JSON.parse(raw) as AIAnalysisOutput;

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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const flaggedItems = analysis.lineItems
      .filter((i) => i.flagStatus !== "valid")
      .map(
        (i) =>
          `- ${i.description}: $${i.totalPrice} — ${i.flagReason || i.flagStatus}`
      )
      .join("\n");

    const prompt = `Generate three documents for a hospital billing dispute. Return JSON with keys: disputeDraft, negotiationScript, complaintLetter.

Context:
- Hospital: ${episode.providerName} (${episode.providerCity}, ${episode.providerState})
- Health issue: ${episode.healthIssueDescription}
- Total billed: $${analysis.totalBilled}
- Flagged charges:
${flaggedItems}
- Potential savings: $${analysis.potentialSavings}

Documents needed:
1. disputeDraft: Formal letter disputing specific charges
2. negotiationScript: Step-by-step phone call guide
3. complaintLetter: Formal complaint to hospital management/regulators

Each document should be professional, specific, and actionable. Return as JSON with keys disputeDraft, negotiationScript, complaintLetter.`;

    const result = await withRetry(() => model.generateContent(prompt));
    const raw = result.response.text();
    if (!raw) throw new Error("No response from Gemini");

    return JSON.parse(raw) as GeneratedDrafts;
  }
}
