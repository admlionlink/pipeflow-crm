-- ============================================================
-- PipeFlow CRM — Migration 0002: RLS Policies
-- ============================================================
-- Segurança: cada workspace só acessa seus próprios dados.
-- Papéis: admin (CRUD total) · member (leads/deals/activities).
-- ============================================================

-- ─── Funções helper (SECURITY DEFINER) ───────────────────────
-- Executam como superusuário para evitar recursão em policies.

CREATE OR REPLACE FUNCTION is_workspace_member(wid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = wid
      AND user_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION is_workspace_admin(wid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = wid
      AND user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- ─── workspaces ───────────────────────────────────────────────

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Membros veem seus workspaces
CREATE POLICY "workspaces_select" ON workspaces
  FOR SELECT USING (is_workspace_member(id));

-- Qualquer usuário autenticado pode criar um workspace
-- (o trigger on_workspace_created adiciona o criador como admin)
CREATE POLICY "workspaces_insert" ON workspaces
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Somente admins atualizam configurações do workspace
CREATE POLICY "workspaces_update" ON workspaces
  FOR UPDATE USING (is_workspace_admin(id));

-- Somente admins excluem o workspace
CREATE POLICY "workspaces_delete" ON workspaces
  FOR DELETE USING (is_workspace_admin(id));

-- ─── workspace_members ────────────────────────────────────────

ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Membros veem a lista de membros do workspace
CREATE POLICY "wm_select" ON workspace_members
  FOR SELECT USING (is_workspace_member(workspace_id));

-- Somente admins adicionam membros
-- (bootstrapping: o trigger on_workspace_created usa SECURITY DEFINER)
CREATE POLICY "wm_insert" ON workspace_members
  FOR INSERT WITH CHECK (is_workspace_admin(workspace_id));

-- Somente admins alteram papéis
CREATE POLICY "wm_update" ON workspace_members
  FOR UPDATE USING (is_workspace_admin(workspace_id));

-- Somente admins removem membros
CREATE POLICY "wm_delete" ON workspace_members
  FOR DELETE USING (is_workspace_admin(workspace_id));

-- ─── workspace_invites ────────────────────────────────────────

ALTER TABLE workspace_invites ENABLE ROW LEVEL SECURITY;

-- Somente admins gerenciam convites
CREATE POLICY "wi_select" ON workspace_invites
  FOR SELECT USING (is_workspace_admin(workspace_id));

CREATE POLICY "wi_insert" ON workspace_invites
  FOR INSERT WITH CHECK (is_workspace_admin(workspace_id));

CREATE POLICY "wi_delete" ON workspace_invites
  FOR DELETE USING (is_workspace_admin(workspace_id));

-- ─── leads ───────────────────────────────────────────────────

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Qualquer membro lê, cria, edita e exclui leads
CREATE POLICY "leads_select" ON leads
  FOR SELECT USING (is_workspace_member(workspace_id));

CREATE POLICY "leads_insert" ON leads
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "leads_update" ON leads
  FOR UPDATE USING (is_workspace_member(workspace_id));

CREATE POLICY "leads_delete" ON leads
  FOR DELETE USING (is_workspace_member(workspace_id));

-- ─── deals ───────────────────────────────────────────────────

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Qualquer membro lê, cria, edita e exclui deals
CREATE POLICY "deals_select" ON deals
  FOR SELECT USING (is_workspace_member(workspace_id));

CREATE POLICY "deals_insert" ON deals
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "deals_update" ON deals
  FOR UPDATE USING (is_workspace_member(workspace_id));

CREATE POLICY "deals_delete" ON deals
  FOR DELETE USING (is_workspace_member(workspace_id));

-- ─── activities ──────────────────────────────────────────────

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Qualquer membro lê e cria atividades
CREATE POLICY "activities_select" ON activities
  FOR SELECT USING (is_workspace_member(workspace_id));

CREATE POLICY "activities_insert" ON activities
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));

-- Somente o autor ou um admin exclui atividades
CREATE POLICY "activities_delete" ON activities
  FOR DELETE USING (
    author_id = auth.uid()
    OR is_workspace_admin(workspace_id)
  );

-- ─── subscriptions ───────────────────────────────────────────

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Somente admins consultam o status da assinatura
CREATE POLICY "subscriptions_select" ON subscriptions
  FOR SELECT USING (is_workspace_admin(workspace_id));

-- Mutations via webhook Stripe usam service_role (bypassa RLS)
-- Nenhuma policy de INSERT/UPDATE/DELETE para anon/authenticated
