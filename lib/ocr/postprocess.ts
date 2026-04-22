/**
 * Cleans raw OCR text before sending to the LLM for analysis.
 * Normalises currency symbols, fixes common character confusions in
 * numeric contexts, and strips invisible/control characters.
 */
export function cleanOCRText(raw: string): string {
  let text = raw;

  // 1. Normalise rupee symbol variants
  text = text.replace(/\bRs\.?\s*/gi, "₹").replace(/\bINR\s*/gi, "₹");

  // 2. Fix numeric OCR character confusions
  //    O → 0 only when surrounded by digits or currency symbol
  text = text.replace(/(?<=[\d₹,])[Oo](?=[\d,])/g, "0");
  //    l or I → 1 only when a digit is on both sides
  text = text.replace(/(?<=\d)[lI](?=\d)/g, "1");

  // 3. Strip zero-width / invisible Unicode characters
  text = text.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "");

  // 4. Strip ASCII control characters (keep tab, LF, CR)
  // eslint-disable-next-line no-control-regex
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 5. Collapse multiple spaces/tabs on the same line → single space
  text = text.replace(/[^\S\r\n]+/g, " ");

  // 6. Cap consecutive blank lines at 2
  text = text.replace(/(\r?\n){3,}/g, "\n\n");

  return text.trim();
}
