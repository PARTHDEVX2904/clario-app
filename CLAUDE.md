# Clario — CLAUDE.md

## Project overview
Clario is a patient-facing healthcare billing intelligence app. It helps patients understand medical bills in plain English, identify questionable charges, reduce out-of-pocket costs, and generate dispute/negotiation drafts.

## Tech stack
- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript (strict, everywhere)
- **Styling:** Tailwind CSS v3 + class-variance-authority
- **Animation:** Framer Motion — `opacity`+`y` only, `duration` ≤ 0.4s, no bounce physics
- **AI:** OpenAI API (GPT-4o) — adapter pattern, swappable
- **OCR:** Tesseract.js — adapter pattern, swappable
- **Database:** Supabase (Postgres + Auth + Storage)
- **Deployment:** Vercel

## Repository structure
```
app/
  (marketing)/    # Landing, Terms, Privacy (no sidebar)
  (app)/          # Authenticated shell — dashboard/, upload/, analysis/[id]/
  api/            # Route handlers (server-side only)
components/
  ui/             # Button, Card, Badge, Input, etc.
  layout/         # Header, Footer, Sidebar, AppHeader
  marketing/      # Hero, Features, HowItWorks, TrustSection, CTASection
  dashboard/      # Stats, recent analyses, empty state
  upload/         # Multi-step upload form
  analysis/       # Bill analysis display components
  auth/           # AuthForm
lib/
  ai/             # Adapter interface + mock + openai implementations
  ocr/            # Adapter interface + mock + tesseract implementations
  supabase/       # Browser + server clients
  billing/        # Heuristics, mock data
  utils/          # cn(), format helpers
types/            # Domain types + DB types
```

## Key conventions
- **Server components by default.** Add `"use client"` only for interactivity/hooks/browser APIs.
- **Adapter pattern.** Never call OpenAI or Tesseract directly — go through `lib/ai/` and `lib/ocr/`.
- **Environment-switched providers.** `AI_PROVIDER=mock|openai`, `OCR_PROVIDER=mock|tesseract`.
- **No secrets in client components.** `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` are server-only.
- **`cn()` for all class merging.** Import from `@/lib/utils/cn`.
- **Zod validation** at all API and form boundaries.

## Mock seams (MVP — keep swappable)
- `lib/ai/mock.ts` — static realistic analysis result
- `lib/ocr/mock.ts` — sample extracted bill text
- `lib/supabase/` — falls back to in-memory when Supabase isn't configured

## Design system
- **Background:** `#EBF4F6` | **Primary:** `#09637E` | **Primary alt:** `#088395`
- **Muted teal:** `#7AB2B2` | **Warning:** `#D97706` | **Destructive:** `#DC2626`
- **Font:** DM Sans (body/UI), Instrument Serif (display headings only — hero/how-it-works/trust), Merriweather (logo)
- **Cards:** white, `shadow-card` / `shadow-card-hover` | **Borders:** `border-border` (`#C4DDE3`)
- Marketing background: radial gradient from `#7AB2B2` → `#EBF4F6`

## Charge flag statuses
- `valid` — consistent with reported care
- `review_needed` — warrants patient review
- `possibly_overcharged` — significantly above norms

All flags are informational only. Never present as legal or medical certainty.

## Database schema
See `lib/supabase/schema.sql`. Key tables: `cases`, `documents`, `bill_analyses`, `bill_line_items`, `generated_outputs`.

## Running locally
```bash
cp .env.local.example .env.local
npm install && npm run dev
```

## Env vars
| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Placeholder OK for mock mode |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Placeholder OK for mock mode |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only |
| `OPENAI_API_KEY` | Only if `AI_PROVIDER=openai` |
| `AI_PROVIDER` | `mock` or `openai` |
| `OCR_PROVIDER` | `mock` or `tesseract` |
