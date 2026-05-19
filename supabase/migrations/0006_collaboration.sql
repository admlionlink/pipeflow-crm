-- ============================================================
-- PipeFlow CRM — Migration 0006: Collaboration
-- ============================================================
-- Skill: supabase-postgres-best-practices
--
-- §1.5 Partial Indexes  → token lookup só em convites não expirados
-- §3.1 Least Privilege  → accept_invite SECURITY DEFINER (postgres/bypassrls)
--                         necessário pois o convidado não é admin ainda
-- §5.1 Short Transactions → accept_invite: INSERT + DELETE numa única TX
-- §3.3 RLS performance  → (select auth.uid()) já nas policies (migration 0003)
-- ============================================================

-- ─── 1. Nota sobre índices de workspace_invites ──────────────
-- idx_workspace_invites_token e idx_workspace_invites_workspace_id
-- já existem desde a migration 0001.
-- §1.5 partial index com now() não é possível no PostgreSQL pois
-- now() é VOLATILE (não IMMUTABLE). O token é UNIQUE, então 1 row
-- por lookup — o índice existente já é ótimo.
-- ─── 2. accept_invite — SECURITY DEFINER RPC ─────────────────
-- Por quê SECURITY DEFINER:
--   O convidado não é membro/admin do workspace ainda.
--   A policy wm_insert exige is_workspace_admin(workspace_id).
--   Sem bypassrls o INSERT falharia com 42501 (mesmo problema do
--   create_workspace, resolvido na migration 0004 pelo mesmo padrão).
--
-- Segurança garantida internamente:
--   1. Valida token e expires_at
--   2. Confirma que o e-mail do auth.uid() == invite.email
--   3. Verifica limite de membros (Free = 2)
--   4. INSERT + DELETE em transação atômica (§5.1)

CREATE OR REPLACE FUNCTION public.accept_invite(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_invite      public.workspace_invites%ROWTYPE;
  v_user_id     uuid;
  v_user_email  text;
  v_ws_plan     text;
  v_member_count int;
BEGIN
  -- Identidade do caller
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Não autenticado' USING ERRCODE = 'PGRST';
  END IF;

  SELECT email INTO v_user_email
  FROM auth.users WHERE id = v_user_id;

  -- Buscar convite válido (não expirado)
  SELECT * INTO v_invite
  FROM public.workspace_invites
  WHERE token = p_token
    AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Convite inválido ou expirado'
      USING ERRCODE = '22023';
  END IF;

  -- Verificar que o e-mail do usuário coincide com o convite
  IF lower(v_user_email) != lower(v_invite.email) THEN
    RAISE EXCEPTION 'Este convite foi enviado para outro e-mail'
      USING ERRCODE = '22023';
  END IF;

  -- Já é membro? Apenas limpa o convite e retorna
  IF EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = v_invite.workspace_id
      AND user_id = v_user_id
  ) THEN
    DELETE FROM public.workspace_invites WHERE token = p_token;
    RETURN jsonb_build_object(
      'workspace_id', v_invite.workspace_id,
      'already_member', true
    );
  END IF;

  -- Enforce limite Free: máximo 2 membros (§PLAN.md)
  SELECT plan INTO v_ws_plan
  FROM public.workspaces WHERE id = v_invite.workspace_id;

  IF v_ws_plan = 'free' THEN
    SELECT count(*) INTO v_member_count
    FROM public.workspace_members
    WHERE workspace_id = v_invite.workspace_id;

    IF v_member_count >= 2 THEN
      RAISE EXCEPTION 'Workspace atingiu o limite de 2 membros do plano Free'
        USING ERRCODE = '22023';
    END IF;
  END IF;

  -- §5.1 Transação curta: INSERT membro + DELETE convite (atômico)
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_invite.workspace_id, v_user_id, v_invite.role);

  DELETE FROM public.workspace_invites WHERE token = p_token;

  RETURN jsonb_build_object(
    'workspace_id', v_invite.workspace_id,
    'role', v_invite.role::text
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_invite(text) TO authenticated;
