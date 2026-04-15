// OCR Adapter — swappable interface
// Active implementation is controlled by OCR_PROVIDER env var.

export interface OCRResult {
  text: string;
  confidence: number; // 0-1
  provider: string;
}

export interface OCRAdapter {
  extractText(fileBuffer: Buffer, mimeType: string): Promise<OCRResult>;
}

// Factory — returns the configured adapter
export async function getOCRAdapter(): Promise<OCRAdapter> {
  const provider = process.env.OCR_PROVIDER ?? "mock";

  switch (provider) {
    case "tesseract": {
      const { TesseractAdapter } = await import("./tesseract");
      return new TesseractAdapter();
    }
    case "mock":
    default: {
      const { MockOCRAdapter } = await import("./mock");
      return new MockOCRAdapter();
    }
  }
}
