# Clario

**Clario helps patients understand hospital bills in plain English, spot overcharges, and generate dispute letters.**

---

## What it does

1. Patient uploads a medical bill (PDF or photo)
2. OCR extracts the text from the document
3. AI analyses every charge and flags suspicious items
4. Patient gets a plain-English breakdown and can download a dispute letter, phone script, or complaint letter

---

## Tech stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 + Framer Motion |
| AI | Groq (llama-3.3-70b) or Gemini 2.0 Flash |
| OCR | Vision model (Groq/Gemini) for images, pdf-parse for PDFs |
| Database | Supabase (Postgres + Auth + Storage) |
| Deployment | Vercel |

---

## Getting started

```bash
# 1. Clone the repo
git clone https://github.com/PARTHDEVX2904/clario-app.git
cd clario-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local

# 4. Start the dev server
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | From Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | From Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only — never expose to client |
| `GROQ_API_KEY` | If using Groq | |
| `GEMINI_API_KEY` | If using Gemini | |
| `AI_PROVIDER` | Yes | `mock`, `groq`, or `gemini` |
| `OCR_PROVIDER` | Yes | `mock` or `tesseract` |

---

## Project structure

```
app/
  (marketing)/     # Public pages — landing, privacy
  (app)/           # Authenticated pages — dashboard, upload, analysis
  api/             # Server-only API routes

components/
  ui/              # Reusable primitives — Button, Card, Badge
  layout/          # Sidebar, Header, AppHeader
  dashboard/       # Stats cards, recent analysis list
  upload/          # Multi-step bill upload form
  analysis/        # Analysis result display

lib/
  ai/              # AI provider adapters (groq, gemini, mock)
  ocr/             # OCR adapters + image preprocessing
  supabase/        # DB clients — browser + server
  utils/           # cn(), formatCurrency(), formatDateRelative()

types/             # Shared TypeScript types + Supabase DB types
```

---

## Database setup

Run `lib/supabase/schema.sql` in your **Supabase Dashboard → SQL Editor**.

Tables created (all with Row Level Security):

- `cases` — patient episode context
- `documents` — uploaded bill files + OCR output
- `bill_analyses` — AI analysis results per case
- `bill_line_items` — individual charge line items
- `generated_outputs` — dispute letters and scripts
- `profiles` — public mirror of auth.users, auto-created on signup

---

## Bill processing pipeline

```
Upload → Preprocess image (sharp) → Vision OCR → Clean text → LLM analysis → Validate JSON → Save to DB
```

Charge flag types:

| Flag | Meaning |
|---|---|
| `valid` | Charge is consistent with the care reported |
| `review_needed` | Worth questioning — ask for itemised breakdown |
| `possibly_overcharged` | Significantly above expected norms |

All flags are informational only — not legal or medical advice.

---

## Scripts

```bash
npm run dev       # Dev server
npm run build     # Production build
npm run lint      # ESLint
```

---

## Deployment

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy

---

## Disclaimer

Clario provides informational support only. It is not legal or medical advice. Always consult a certified patient advocate or healthcare attorney for definitive guidance.
