import type { OCRAdapter, OCRResult } from "./adapter";

// Tesseract.js v7 adapter — server-side only (Route Handler / Server Action)
// OCR_PROVIDER=tesseract must be set in .env.local
//
// Strategy:
//   - PDF  → pdf-parse  (extracts embedded text directly, no image conversion needed)
//   - Image → Tesseract.js (OCR on pixel data)

export class TesseractAdapter implements OCRAdapter {
  async extractText(fileBuffer: Buffer, mimeType: string): Promise<OCRResult> {
    // ── PDF: extract embedded text via pdf-parse ──────────────────────────────
    if (mimeType === "application/pdf") {
      try {
        const { PDFParse } = await import("pdf-parse");
        const parser = new PDFParse({ data: new Uint8Array(fileBuffer) });
        const result = await parser.getText();
        const text = result.text?.trim();

        if (text && text.length > 20) {
          return { text, confidence: 0.95, provider: "pdf-parse" };
        }

        // PDF had no embedded text (scanned/image-only PDF) — fall through to Tesseract
      } catch (err) {
        console.warn("pdf-parse failed, falling back to Tesseract:", err);
      }
    }

    // ── Image (or scanned PDF fallback): use Tesseract OCR ───────────────────
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng");
    try {
      const { data } = await worker.recognize(fileBuffer);
      return {
        text: data.text,
        confidence: (data.confidence ?? 0) / 100,
        provider: "tesseract",
      };
    } finally {
      await worker.terminate();
    }
  }
}
