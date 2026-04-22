import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// claude-haiku-4-5: fast + cost-effective for OCR / extraction tasks
export const claudeOCR = anthropic;
export const OCR_MODEL = "claude-haiku-4-5-20251001";
