-- ============================================================
-- PipeFlow CRM — Migration 0004: create_workspace RPC
-- ============================================================
-- Por quê SECURITY DEFINER é necessário aqui:
--
-- O PostgREST conecta como `authenticator` e faz SET ROLE authenticated.
-- No PostgreSQL, INSERT via PostgREST table API + RLS com auth.uid()
-- não funciona para tabelas de bootstrap (workspace não tem membros ainda,
-- então policies baseadas em is_workspace_member retornam false).
--
-- A solução correta é uma função SECURITY DEFINER que:
--  1. Valida que o caller é autenticado via auth.uid()
--  2. Faz o INSERT como postgres (bypassrls=true)
--  3. O trigger on_workspace_created também executa como postgres
--     e insere o membro admin sem conflito com wm_insert policy
--
-- Referência: Supabase docs — "Use security definer functions for
-- complex checks" (security-rls-performance.md)
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_workspace(p_name text, p_slug text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id     uuid;
  v_workspace   record;
BEGIN
  v_user_id := (SELECT auth.uid());

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado'
      USING ERRCODE = 'PGRST', HINT = 'JWT inválido ou ausente';
  END IF;

  IF p_slug IS NULL OR length(trim(p_slug)) < 2
     OR p_slug !~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$' THEN
    RAISE EXCEPTION 'Slug inválido: %', p_slug
      USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.workspaces (name, slug)
  VALUES (p_name, p_slug)
  RETURNING id, name, slug, plan INTO v_workspace;

  -- Trigger on_workspace_created adiciona o criador como admin
  -- automaticamente (também SECURITY DEFINER, sem conflito com wm_insert)

  RETURN jsonb_build_object(
    'id',   v_workspace.id,
    'name', v_workspace.name,
    'slug', v_workspace.slug,
    'plan', v_workspace.plan
  );
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Endereço "%" já está em uso. Escolha outro nome.', p_slug
      USING ERRCODE = '23505';
END;
$$;

-- Permitir que authenticated chame a função
GRANT EXECUTE ON FUNCTION public.create_workspace(text, text) TO authenticated;
