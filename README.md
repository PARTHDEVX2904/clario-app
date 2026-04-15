# Mediva — Healthcare Billing Intelligence

Mediva is a patient-facing app that helps people understand hospital and medical bills in plain English, identify potentially questionable charges, find savings opportunities, and generate dispute/negotiation documents.

## Features

- **Bill upload + OCR** — Upload PDF or image bills; text is extracted automatically
- **AI analysis** — Every line item analyzed, flagged as valid / review needed / possibly overcharged
- **Duplicate detection** — Same charge, same date, same CPT code flagged automatically
- **Savings opportunities** — Prioritized actions to reduce your bill
- **Dispute letter generator** — Ready-to-send dispute letter, negotiation phone guide, and complaint letter
- **Privacy-first** — No account required; no data sold

---

## Quick start

### 1. Clone and install
```bash
git clone <your-repo>
cd mediva
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```

Fill in your credentials — or leave the `mock` providers for local development (no API keys needed).

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `OPENAI_API_KEY` | Only needed if `AI_PROVIDER=openai` |
| `AI_PROVIDER` | `mock` (default) or `openai` |
| `OCR_PROVIDER` | `mock` (default) or `tesseract` |

### 3. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Demo the analysis
Navigate to `/analysis/demo` to see a full working example with realistic mock data — no file upload needed.

---

## Scripts

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run typecheck # TypeScript check
npm run lint      # ESLint
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| AI | OpenAI GPT-4o (adapter pattern — default: mock) |
| OCR | Tesseract.js (adapter pattern — default: mock) |
| Database | Supabase (Postgres + Auth + Storage) |
| Deployment | Vercel |

---

## Architecture

```
app/
  (marketing)/           # Landing page (no sidebar)
  (app)/                 # App shell with sidebar
    dashboard/           # Bill overview
    upload/              # Multi-step intake flow
    analysis/[id]/       # Bill analysis results
  api/
    analyze/             # POST — OCR + AI pipeline
    analysis/[id]/       # GET — fetch analysis by ID

components/
  ui/                    # Button, Card, Badge, Input, etc.
  layout/                # Header, Footer, Sidebar, AppHeader
  marketing/             # Landing page sections
  dashboard/             # Stats, recent analyses, empty state
  upload/                # File upload zone, step progress, stepper
  analysis/              # Summary, line items table, savings, dispute draft

lib/
  ai/                    # AI adapter interface + mock + OpenAI
  ocr/                   # OCR adapter interface + mock + Tesseract
  billing/               # Heuristics (duplicate, vague fees, care mismatch)
  supabase/              # Browser + server clients + schema.sql
  utils/                 # cn(), formatCurrency(), formatDate()

types/                   # Domain types (Bill, LineItem, AnalysisResult, etc.)
```

---

## Database setup

If using Supabase, run the schema:

1. Open your Supabase project → SQL editor
2. Paste and run `lib/supabase/schema.sql`

---

## Enabling real AI/OCR

**OpenAI:**
```env
OPENAI_API_KEY=sk-...
AI_PROVIDER=openai
```

**Tesseract (local OCR):**
```bash
npm install tesseract.js
```
```env
OCR_PROVIDER=tesseract
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set all environment variables in Vercel project settings
4. Deploy

---

## Disclaimer

Mediva provides informational support only. It is not legal advice, medical advice, or a guarantee of any billing outcome. Always consult a certified patient advocate, healthcare attorney, or your insurance company for definitive guidance.
