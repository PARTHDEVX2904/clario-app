import sharp from "sharp";

export async function preprocessForOCR(buffer: Buffer, mimeType: string): Promise<Buffer> {
  if (mimeType === "application/pdf") return buffer;

  return sharp(buffer)
    .grayscale()              // remove colour noise, reduces file size
    .normalise()              // auto contrast stretch (brightens dark scans)
    .sharpen({ sigma: 1.5 }) // crisp text edges for OCR
    .median(1)                // single-pixel median to kill salt-and-pepper noise
    .toBuffer();
}

export async function checkImageQuality(buffer: Buffer): Promise<{
  width: number;
  height: number;
  isLowRes: boolean;
  warning?: string;
}> {
  const { width = 0, height = 0 } = await sharp(buffer).metadata();
  const isLowRes = width < 800;
  return {
    width,
    height,
    isLowRes,
    warning: isLowRes
      ? `Image is only ${width}px wide — OCR accuracy may be reduced. Recommend scanning at 300 DPI or higher.`
      : undefined,
  };
}
