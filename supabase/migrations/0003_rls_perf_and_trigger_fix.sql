-- ============================================================
-- PipeFlow CRM — Migration 0003: RLS Performance + Trigger Fix
-- ============================================================
-- Aplica melhores práticas do skill supabase-postgres-best-practices:
--
-- 1. (select auth.uid()) em vez de auth.uid() direto nas policies
--    Fonte: rules/security-rls-performance.md
--    Por quê: auth.uid() chamado diretamente é avaliado por linha;
--    envolver em SELECT cria uma subquery cacheada, resolvendo também
--    um bug de avaliação em contexto de INSERT no PostgreSQL 17.
--
-- 2. Trigger handle_workspace_created com SET search_path = ''
--    Fonte: rules/security-privileges.md
--    Por quê: SECURITY DEFINER sem search_path fixo é vulnerável a
--    search_path injection; '' força o uso de nomes qualificados.
--
-- 3. Índice FK ausente em activities.author_id
--    Fonte: rules/schema-foreign-key-indexes.md
--    Por quê: PostgreSQL não cria índices em FKs automaticamente;
--    sem índice, queries por autor e CASCADE DELETE fazem seq scan.
-- ============================================================

-- ─── 1. Atualizar policies para usar (select auth.uid()) ─────
-- Padrão recomendado pelo Supabase: subquery cacheada, ~100x mais
-- rápida em tabelas grandes e corrige avaliação em INSERT context.

-- workspaces
DROP POLICY IF EXISTS "workspaces_insert" ON public.workspaces;
CREATE POLICY "workspaces_insert" ON public.workspaces
  FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "workspaces_select" ON public.workspaces;
CREATE POLICY "workspaces_select" ON public.workspaces
  FOR SELECT USING (public.is_workspace_member(id));

DROP POLICY IF EXISTS "workspaces_update" ON public.workspaces;
CREATE POLICY "workspaces_update" ON public.workspaces
  FOR UPDATE USING (public.is_workspace_admin(id));

DROP POLICY IF EXISTS "workspaces_delete" ON public.workspaces;
CREATE POLICY "workspaces_delete" ON public.workspaces
  FOR DELETE USING (public.is_workspace_admin(id));

-- workspace_members
DROP POLICY IF EXISTS "wm_select" ON public.workspace_members;
CREATE POLICY "wm_select" ON public.workspace_members
  FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "wm_insert" ON public.workspace_members;
CREATE POLICY "wm_insert" ON public.workspace_members
  FOR INSERT WITH CHECK (public.is_workspace_admin(workspace_id));

DROP POLICY IF EXISTS "wm_update" ON public.workspace_members;
CREATE POLICY "wm_update" ON public.workspace_members
  FOR UPDATE USING (public.is_workspace_admin(workspace_id));

DROP POLICY IF EXISTS "wm_delete" ON public.workspace_members;
CREATE POLICY "wm_delete" ON public.workspace_members
  FOR DELETE USING (public.is_workspace_admin(workspace_id));

-- workspace_invites
DROP POLICY IF EXISTS "wi_select" ON public.workspace_invites;
CREATE POLICY "wi_select" ON public.workspace_invites
  FOR SELECT USING (public.is_workspace_admin(workspace_id));

DROP POLICY IF EXISTS "wi_insert" ON public.workspace_invites;
CREATE POLICY "wi_insert" ON public.workspace_invites
  FOR INSERT WITH CHECK (public.is_workspace_admin(workspace_id));

DROP POLICY IF EXISTS "wi_delete" ON public.workspace_invites;
CREATE POLICY "wi_delete" ON public.workspace_invites
  FOR DELETE USING (public.is_workspace_admin(workspace_id));

-- leads
DROP POLICY IF EXISTS "leads_select" ON public.leads;
CREATE POLICY "leads_select" ON public.leads
  FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "leads_insert" ON public.leads;
CREATE POLICY "leads_insert" ON public.leads
  FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "leads_update" ON public.leads;
CREATE POLICY "leads_update" ON public.leads
  FOR UPDATE USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "leads_delete" ON public.leads;
CREATE POLICY "leads_delete" ON public.leads
  FOR DELETE USING (public.is_workspace_member(workspace_id));

-- deals
DROP POLICY IF EXISTS "deals_select" ON public.deals;
CREATE POLICY "deals_select" ON public.deals
  FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "deals_insert" ON public.deals;
CREATE POLICY "deals_insert" ON public.deals
  FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "deals_update" ON public.deals;
CREATE POLICY "deals_update" ON public.deals
  FOR UPDATE USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "deals_delete" ON public.deals;
CREATE POLICY "deals_delete" ON public.deals
  FOR DELETE USING (public.is_workspace_member(workspace_id));

-- activities
DROP POLICY IF EXISTS "activities_select" ON public.activities;
CREATE POLICY "activities_select" ON public.activities
  FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "activities_insert" ON public.activities;
CREATE POLICY "activities_insert" ON public.activities
  FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "activities_delete" ON public.activities;
CREATE POLICY "activities_delete" ON public.activities
  FOR DELETE USING (
    author_id = (SELECT auth.uid())
    OR public.is_workspace_admin(workspace_id)
  );

-- subscriptions
DROP POLICY IF EXISTS "subscriptions_select" ON public.subscriptions;
CREATE POLICY "subscriptions_select" ON public.subscriptions
  FOR SELECT USING (public.is_workspace_admin(workspace_id));

-- ─── 2. Atualizar funções helper com search_path seguro ──────

CREATE OR REPLACE FUNCTION public.is_workspace_member(wid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = wid
      AND user_id = (SELECT auth.uid())
  )
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_admin(wid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = wid
      AND user_id = (SELECT auth.uid())
      AND role = 'admin'
  )
$$;

-- ─── 3. Corrigir trigger handle_workspace_created ────────────

CREATE OR REPLACE FUNCTION public.handle_workspace_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, (SELECT auth.uid()), 'admin');
  RETURN NEW;
END;
$$;

-- ─── 4. Índice FK ausente: activities.author_id ──────────────

CREATE INDEX IF NOT EXISTS idx_activities_author_id
  ON public.activities(author_id);
