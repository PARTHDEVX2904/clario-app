import type { OCRAdapter, OCRResult } from "./adapter";

// Tesseract.js v7 adapter — server-side only (Route Handler / Server Action)
// OCR_PROVIDER=tesseract must be set in .env.local
// Language data is downloaded from cdn.jsdelivr.net on first use (~4 MB for "eng")
export class TesseractAdapter implements OCRAdapter {
  async extractText(fileBuffer: Buffer, _mimeType: string): Promise<OCRResult> {
    // Dynamic import keeps tesseract.js out of the client bundle
    const { createWorker } = await import("tesseract.js");

    const worker = await createWorker("eng");
    try {
      const { data } = await worker.recognize(fileBuffer);
      return {
        text: data.text,
        // Tesseract returns confidence as 0-100; normalise to 0-1
        confidence: (data.confidence ?? 0) / 100,
        provider: "tesseract",
      };
    } finally {
      await worker.terminate();
    }
  }
}
