/**
 * Vision-based OCR adapter.
 * Uses a multimodal AI model to extract text from bill images — dedicated OCR
 * step separate from analysis, giving better accuracy than doing both in one call.
 */

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { OCRAdapter, OCRResult } from "./adapter";

const VISION_OCR_PROMPT =
  `Extract all text from this medical bill exactly as printed.
Preserve every number, date, rupee amount, table row, and column alignment.
Include all headers, footers, and printed text verbatim.
Output ONLY the extracted text — no analysis, no commentary, no formatting changes.`;

// ── Groq Vision OCR ───────────────────────────────────────────────────────────

const GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

class GroqVisionOCR implements OCRAdapter {
  private client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY!,
    baseURL: "https://api.groq.com/openai/v1",
  });

  async extractText(buffer: Buffer, mimeType: string): Promise<OCRResult> {
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const response = await this.client.chat.completions.create({
      model: GROQ_VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl } },
            { type: "text", text: VISION_OCR_PROMPT },
          ],
        },
      ],
      temperature: 0,
      max_tokens: 2048,
    });

    const text = response.choices[0]?.message?.content ?? "";
    if (!text) throw new Error("GroqVisionOCR returned empty response");

    return {
      text,
      confidence: text.length > 50 ? 0.90 : 0.50,
      provider: "groq-vision-ocr",
    };
  }
}

// ── Gemini Vision OCR ─────────────────────────────────────────────────────────

const GEMINI_VISION_MODEL = "gemini-2.0-flash";

class GeminiVisionOCR implements OCRAdapter {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  async extractText(buffer: Buffer, mimeType: string): Promise<OCRResult> {
    const model = this.genAI.getGenerativeModel({ model: GEMINI_VISION_MODEL });

    const result = await model.generateContent([
      { inlineData: { mimeType, data: buffer.toString("base64") } },
      VISION_OCR_PROMPT,
    ]);

    const text = result.response.text();
    if (!text) throw new Error("GeminiVisionOCR returned empty response");

    return {
      text,
      confidence: text.length > 50 ? 0.90 : 0.50,
      provider: "gemini-vision-ocr",
    };
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Returns a Vision OCR adapter matching the active AI_PROVIDER, or null for mock.
 * Keyed off AI_PROVIDER so no extra env var is needed — vision OCR reuses the
 * same API key as the analysis LLM.
 */
export function createVisionOCR(): OCRAdapter | null {
  const provider = process.env.AI_PROVIDER ?? "mock";
  if (provider === "groq") return new GroqVisionOCR();
  if (provider === "gemini") return new GeminiVisionOCR();
  return null;
}
