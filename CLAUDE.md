# Clario — CLAUDE.md

## Project overview
Clario is a patient-facing healthcare billing intelligence app. Helps patients understand medical bills in plain English, spot overcharges, and generate dispute/negotiation drafts.

## Tech stack
- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v3 + class-variance-authority
- **Animation:** Framer Motion — `opacity`+`y` only, `duration` ≤ 0.4s, no bounce
- **AI:** Groq / Gemini — adapter pattern (`lib/ai/`), swappable
- **OCR:** Tesseract.js — adapter pattern (`lib/ocr/`), swappable
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
  ai/             # adapter.ts, groq.ts, gemini.ts, mock.ts
  ocr/            # adapter + tesseract + mock
  supabase/       # browser + server clients
  billing/        # heuristics.ts, conditions-kb.ts, mock data
  utils/          # cn(), format helpers
types/            # Domain types + DB types
```

## Key conventions
- **Server components by default.** Add `"use client"` only for interactivity/hooks/browser APIs.
- **Adapter pattern.** Never call AI/OCR providers directly — go through `lib/ai/` and `lib/ocr/`.
- **Environment-switched providers.** `AI_PROVIDER=mock|groq|gemini`, `OCR_PROVIDER=mock|tesseract`.
- **No secrets in client components.** `SUPABASE_SERVICE_ROLE_KEY` and API keys are server-only.
- **`cn()` for all class merging.** Import from `@/lib/utils/cn`.
- **Zod validation** at all API and form boundaries.

## Design system
- **Background:** `#FFFFFF` (white) | **Primary:** `#09637E` | **Accent:** `#088395`
- **Warning:** `#D97706` | **Destructive:** `#DC2626`
- **Brand blue:** `#2F2FE4` (logo, typewriter words, accents)
- **Fonts:** Inter (all headings + body via `--font-inter` CSS var + `--font-jakarta` DM Sans fallback)
  - `font-display` → Inter (was Instrument Serif — now replaced globally)
  - Logo wordmark "Clario" → Inter 600, `text-black`
- **Cards:** white, `shadow-card` / `shadow-card-hover` | **Borders:** `border-border` (`#C4DDE3`)
- **Section backgrounds:** Hero `bg-white` | Features `bg-[#d4f5fa]` | How-it-works `bg-white` | Footer `bg-[#d4f5fa]`
- **Buttons (default variant):** black (`bg-black hover:bg-gray-900`)

## Hero section specifics
- Typewriter cycles: "decoded" → "simplified" → "explained" (lowercase, `font-black`, color `#2F2FE4`)
- Blinking cursor `|` uses `@keyframes cursor-blink` in `globals.css`, `2s step-end infinite`
- Trust bar: CreditCard icon + "No account required" in black, inline beside CTA button

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
| `GROQ_API_KEY` | Only if `AI_PROVIDER=groq` |
| `GEMINI_API_KEY` | Only if `AI_PROVIDER=gemini` |
| `AI_PROVIDER` | `mock`, `groq`, or `gemini` |
| `OCR_PROVIDER` | `mock` or `tesseract` |
