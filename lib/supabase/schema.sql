-- Mediva — Supabase/Postgres schema
-- Run this in your Supabase SQL editor to set up the database.

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── cases ─────────────────────────────────────────────────────────────────────
create table if not exists public.cases (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  session_id      text,                          -- anonymous session identifier
  status          text not null default 'pending'
                  check (status in ('pending','processing','complete','error')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Patient / provider context
  patient_name    text,
  provider_name   text,
  provider_city   text,
  provider_state  text,
  provider_country text not null default 'US',

  -- Insurance
  insurance_status text check (insurance_status in ('insured','self_pay','unknown')),

  -- Episode description
  health_issue    text,

  -- Episode care flags
  had_er_visit    boolean not null default false,
  had_imaging     boolean not null default false,
  had_blood_tests boolean not null default false,
  had_surgery     boolean not null default false,
  had_room_stay   boolean not null default false,
  had_medicines   boolean not null default false,
  had_followup    boolean not null default false,
  has_multiple_bills boolean not null default false
);

-- auto-update updated_at
create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cases_updated_at
  before update on public.cases
  for each row execute function public.update_updated_at_column();

-- ── documents ─────────────────────────────────────────────────────────────────
create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases(id) on delete cascade,
  type        text not null check (type in ('bill','eob','other')),
  file_path   text,                              -- Supabase storage object path
  file_name   text,
  file_size   integer,
  mime_type   text,
  ocr_text    text,
  ocr_status  text not null default 'pending'
              check (ocr_status in ('pending','processing','done','error')),
  created_at  timestamptz not null default now()
);

-- ── bill_analyses ──────────────────────────────────────────────────────────────
create table if not exists public.bill_analyses (
  id                uuid primary key default gen_random_uuid(),
  case_id           uuid not null references public.cases(id) on delete cascade,
  status            text not null default 'pending'
                    check (status in ('pending','processing','complete','error')),
  created_at        timestamptz not null default now(),

  plain_summary     text,
  total_billed      numeric(12,2),
  total_flagged     numeric(12,2),
  potential_savings numeric(12,2),
  confidence_score  numeric(3,2),               -- 0.00–1.00

  raw_ai_response   jsonb                        -- raw provider response for audit
);

-- ── bill_line_items ────────────────────────────────────────────────────────────
create table if not exists public.bill_line_items (
  id               uuid primary key default gen_random_uuid(),
  analysis_id      uuid not null references public.bill_analyses(id) on delete cascade,

  description      text,
  cpt_code         text,
  quantity         numeric(10,2),
  unit_price       numeric(12,2),
  total_price      numeric(12,2),
  date_of_service  date,

  flag_status      text not null default 'valid'
                   check (flag_status in ('valid','review_needed','possibly_overcharged')),
  flag_reason      text,
  suggested_price  numeric(12,2),
  confidence       numeric(3,2)                 -- 0.00–1.00
);

-- ── generated_outputs ─────────────────────────────────────────────────────────
create table if not exists public.generated_outputs (
  id           uuid primary key default gen_random_uuid(),
  analysis_id  uuid not null references public.bill_analyses(id) on delete cascade,
  type         text not null check (type in ('complaint_letter','dispute_draft','negotiation_script')),
  content      text,
  created_at   timestamptz not null default now()
);

-- ── Row Level Security ─────────────────────────────────────────────────────────
-- Enable RLS on all tables
alter table public.cases enable row level security;
alter table public.documents enable row level security;
alter table public.bill_analyses enable row level security;
alter table public.bill_line_items enable row level security;
alter table public.generated_outputs enable row level security;

-- Cases: owner or matching session_id can access
create policy "cases_owner_access" on public.cases
  for all using (
    user_id = auth.uid()
    or session_id = current_setting('app.session_id', true)
  );

-- Documents: accessible if related case is accessible
create policy "documents_via_case" on public.documents
  for all using (
    exists (
      select 1 from public.cases c
      where c.id = documents.case_id
        and (c.user_id = auth.uid() or c.session_id = current_setting('app.session_id', true))
    )
  );

-- Analyses: accessible if related case is accessible
create policy "analyses_via_case" on public.bill_analyses
  for all using (
    exists (
      select 1 from public.cases c
      where c.id = bill_analyses.case_id
        and (c.user_id = auth.uid() or c.session_id = current_setting('app.session_id', true))
    )
  );

-- Line items: accessible if related analysis is accessible
create policy "line_items_via_analysis" on public.bill_line_items
  for all using (
    exists (
      select 1 from public.bill_analyses ba
      join public.cases c on c.id = ba.case_id
      where ba.id = bill_line_items.analysis_id
        and (c.user_id = auth.uid() or c.session_id = current_setting('app.session_id', true))
    )
  );

-- Generated outputs: same as line items
create policy "outputs_via_analysis" on public.generated_outputs
  for all using (
    exists (
      select 1 from public.bill_analyses ba
      join public.cases c on c.id = ba.case_id
      where ba.id = generated_outputs.analysis_id
        and (c.user_id = auth.uid() or c.session_id = current_setting('app.session_id', true))
    )
  );
