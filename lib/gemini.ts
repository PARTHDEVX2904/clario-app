import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini using the API key from .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// gemini-1.5-flash: fast and cost-effective for OCR / extraction tasks
export const geminiFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
