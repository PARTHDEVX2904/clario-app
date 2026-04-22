import { NextRequest, NextResponse } from "next/server";
import { claudeOCR, OCR_MODEL } from "@/lib/claude-ocr";

const PROMPT = `You are a medical bill OCR assistant. Extract all information from this hospital bill image and return ONLY valid JSON — no markdown, no code fences, no extra text.

Return this exact shape:
{
  "hospital_name": "string or empty string",
  "patient_name": "string or empty string",
  "items": [
    { "name": "string", "quantity": "string", "amount": "string" }
  ],
  "total": "string or empty string"
}

Rules:
- Copy text exactly as printed — do not summarise or invent values
- Use empty string "" for any field you cannot find
- quantity can be "1" if not printed on the bill
- amount should include the currency symbol if visible (e.g. ₹500 or $120)`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("bill") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const mimeType = file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    const response = await claudeOCR.messages.create({
      model: OCR_MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: base64,
              },
            },
            {
              type: "text",
              text: PROMPT,
            },
          ],
        },
      ],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "";

    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/extract] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
