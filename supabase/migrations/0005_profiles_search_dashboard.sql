-- ============================================================
-- PipeFlow CRM — Migration 0005: Profiles, Search & Dashboard
-- ============================================================
-- Skill: supabase-postgres-best-practices
--
-- §3.3 Optimize RLS for Performance  → (select auth.uid()) já aplicado (0003)
-- §6.2 Eliminate N+1               → public.profiles evita N+1 em owner names
-- §1.2 Right Index Type            → GIN trigram para buscas ilike em texto
-- §1.3 Composite Indexes           → índices compostos por workspace_id
-- §7.3 EXPLAIN / diagnostics       → view analytics_leads para dashboard
-- ============================================================

-- ─── 1. Tabela de Perfis Públicos ────────────────────────────
-- Padrão Supabase: mirror de auth.users no schema public.
-- Permite JOINs via PostgREST sem expor auth.users diretamente.
-- owner_id em leads/deals aponta para auth.users(id);
-- profiles.id também aponta para auth.users(id) — mesmo UUID,
-- então usamos profiles para resolver o nome do owner em 2 queries.

CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT        NOT NULL DEFAULT '',
  email      TEXT        NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Qualquer membro de qualquer workspace onde o perfil participa pode ver
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm1
      WHERE wm1.user_id = profiles.id
        AND public.is_workspace_member(wm1.workspace_id)
    )
  );

-- Cada usuário edita apenas o próprio perfil
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id);

-- ─── 2. Trigger: sincroniza auth.users → profiles ────────────
-- Dispara em INSERT/UPDATE para manter nome/email atualizados.
-- SECURITY DEFINER: roda como postgres (acessa auth.users).

CREATE OR REPLACE FUNCTION public.handle_user_profile_sync()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    full_name  = EXCLUDED.full_name,
    updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger em auth.users (INSERT e UPDATE de e-mail ou metadata)
CREATE OR REPLACE TRIGGER sync_user_profile
  AFTER INSERT OR UPDATE OF email, raw_user_meta_data
  ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_profile_sync();

-- Backfill: sincronizar usuários já existentes
INSERT INTO public.profiles (id, email, full_name)
SELECT
  id,
  COALESCE(email, ''),
  COALESCE(raw_user_meta_data->>'full_name', '')
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email     = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- ─── 3. pg_trgm + GIN indexes para busca em leads ────────────
-- §1.2: GIN é o tipo correto para padrões de texto com ILIKE/LIKE %pattern%
-- §1.3: índice em (workspace_id, email) para busca combinada

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN trigram em leads — busca por nome, e-mail e empresa
CREATE INDEX IF NOT EXISTS idx_leads_name_trgm
  ON public.leads USING gin(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_leads_email_trgm
  ON public.leads USING gin(email gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_leads_company_trgm
  ON public.leads USING gin(company gin_trgm_ops);

-- Índice composto para filtro por status + data (§1.3 Composite Indexes)
-- Útil para: WHERE workspace_id = X AND status = Y ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_leads_ws_status_date
  ON public.leads(workspace_id, status, created_at DESC);

-- Índice composto para deals por estágio + data
CREATE INDEX IF NOT EXISTS idx_deals_ws_stage_date
  ON public.deals(workspace_id, stage, created_at DESC);

-- Índice em due_date para queries de "prazos próximos" do dashboard
CREATE INDEX IF NOT EXISTS idx_deals_due_date
  ON public.deals(workspace_id, due_date)
  WHERE due_date IS NOT NULL;

-- Índice em activities por lead + data (§1.3 — query mais comum na app)
CREATE INDEX IF NOT EXISTS idx_activities_lead_date
  ON public.activities(lead_id, created_at DESC);

-- ─── 4. GRANT em profiles para roles da app ──────────────────
GRANT SELECT ON public.profiles TO authenticated, anon;
GRANT UPDATE (full_name, email, updated_at) ON public.profiles TO authenticated;
