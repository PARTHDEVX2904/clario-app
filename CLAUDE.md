# Clario

Clario helps patients understand hospital bills in plain English, spot overcharges, and generate dispute letters — all without creating an account.

---

## What it does

1. Patient uploads a bill (PDF or photo)
2. OCR extracts the text, AI analyses every charge
3. Flagged items are shown with a plain explanation
4. Patient downloads a dispute letter, phone script, or complaint letter

---

## Tech stack

| What | Tool |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| AI | Groq (llama-3.3-70b) or Gemini 2.0 Flash |
| OCR | Vision model (Groq/Gemini) for images, pdf-parse for PDFs |
| Database | Supabase (Postgres + Auth + Storage) |
| Deployment | Vercel |

---

## Folder structure

```
app/
  (marketing)/     # Public pages — landing, privacy (no sidebar)
  (app)/           # Logged-in pages — dashboard, upload, analysis
  api/             # Server-only API routes

components/
  ui/              # Reusable UI — Button, Card, Badge, Input
  layout/          # AppHeader, Sidebar, Header, Footer
  marketing/       # Landing page sections
  dashboard/       # Stats cards, recent analyses list
  upload/          # 5-step bill upload form
  analysis/        # Analysis result display

lib/
  ai/              # AI adapters (groq.ts, gemini.ts, mock.ts)
  ocr/             # OCR adapters + preprocessing
  billing/         # Heuristics, conditions knowledge base
  supabase/        # DB clients (browser + server)
  utils/           # cn(), formatCurrency(), etc.

types/             # Shared TypeScript types
```

---

## Bill processing pipeline

```
Upload → Preprocess image → Vision OCR → Clean text → LLM analysis → Validate JSON → Save to DB
```

- Images go through `sharp` preprocessing before OCR
- Vision model (Groq/Gemini) extracts text from images
- pdf-parse handles PDFs directly
- LLM analyses the cleaned text and returns structured JSON
- `validateAIOutput()` coerces and sanity-checks the JSON before saving

---

## Charge flag types

| Flag | Meaning |
|---|---|
| `valid` | Charge looks consistent with the care reported |
| `review_needed` | Worth questioning — ask for itemised breakdown |
| `possibly_overcharged` | Significantly above expected norms |

All flags are informational only — not legal or medical advice.

---

## Design

- **Background:** `#F5F5F5` (app shell) / `#FFFFFF` (cards)
- **Primary teal:** `#09637E` | **Accent:** `#088395`
- **Brand blue:** `#2F2FE4` (logo, highlights)
- **Font:** Inter throughout
- **Buttons:** black background by default
- Animations: `opacity` + `y` only, max `duration: 0.4s`, no bounce

---

## Key rules for contributors

- Use `"use client"` only when you need interactivity or browser APIs — server components by default
- Never call Groq/Gemini/Supabase directly from components — always go through `lib/ai/` and `lib/ocr/`
- Never put API keys or `SUPABASE_SERVICE_ROLE_KEY` in client components
- Use `cn()` from `@/lib/utils/cn` for all Tailwind class merging

---

## Running locally

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Placeholder OK in mock mode |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Placeholder OK in mock mode |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only, never expose to client |
| `GROQ_API_KEY` | If using Groq | |
| `GEMINI_API_KEY` | If using Gemini | |
| `AI_PROVIDER` | Yes | `mock`, `groq`, or `gemini` |
| `OCR_PROVIDER` | Yes | `mock` or `tesseract` |
