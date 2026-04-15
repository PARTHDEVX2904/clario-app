import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type {
  AIAdapter,
  AnalysisParams,
  AIAnalysisOutput,
  GeneratedDrafts,
} from "./adapter";
import type { EpisodeOfCare } from "@/types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class OpenAIAdapter implements AIAdapter {
  async analyzeBill(params: AnalysisParams): Promise<AIAnalysisOutput> {
    const systemPrompt = `You are a medical billing analyst assistant. Your job is to help patients understand their hospital bills, identify potentially questionable charges, and find savings opportunities.

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
- Medicines: ${params.episode.hadMedicines}, Follow-up: ${params.episode.hadFollowupVisits}`;

    const userPrompt = `Analyze this medical bill OCR text and return a JSON response:

${params.ocrText}

Return this exact JSON shape:
{
  "plainSummary": "2-3 paragraph plain English summary",
  "totalBilled": number,
  "totalFlagged": number,
  "potentialSavings": number,
  "confidenceScore": number (0-1),
  "lineItems": [
    {
      "id": "uuid",
      "description": string,
      "cptCode": string | null,
      "quantity": number,
      "unitPrice": number,
      "totalPrice": number,
      "dateOfService": "YYYY-MM-DD" | null,
      "flagStatus": "valid" | "review_needed" | "possibly_overcharged",
      "flagReason": string | null,
      "suggestedPrice": number | null,
      "confidence": number (0-1)
    }
  ],
  "savingsOpportunities": [
    {
      "description": string,
      "estimatedSavings": number | null,
      "actionRequired": string,
      "priority": "high" | "medium" | "low"
    }
  ],
  "disclaimer": "standard disclaimer text"
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 4000,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("No response from OpenAI");

    const parsed = JSON.parse(raw) as AIAnalysisOutput;

    // Ensure all line items have IDs
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
    episode: EpisodeOfCare
  ): Promise<GeneratedDrafts> {
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
- Flagged charges: ${flaggedItems}
- Potential savings: $${analysis.potentialSavings}

Documents needed:
1. disputeDraft: Formal letter disputing specific charges
2. negotiationScript: Step-by-step phone call guide
3. complaintLetter: Formal complaint to hospital management/regulators

Each document should be professional, specific, and actionable. Return as JSON.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("No response from OpenAI");

    return JSON.parse(raw) as GeneratedDrafts;
  }
}
