'use server'

import { redirect } from 'next/navigation'
import { getServerClient } from '@/server/server'
import type { Workspace } from '@/types/workspace'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function createWorkspace(
  name: string
): Promise<{ error: string } | undefined> {
  const supabase = await getServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const slug = toSlug(name)
  if (!slug) return { error: 'Nome inválido para gerar um slug.' }

  // Uses SECURITY DEFINER RPC — required because PostgREST's authenticated
  // role cannot directly INSERT into workspaces (bootstrap RLS restriction).
  // The function validates auth.uid() and runs as postgres (bypassrls=true).
  const { data: workspace, error } = await supabase.rpc('create_workspace', {
    p_name: name,
    p_slug: slug,
  })

  if (error) {
    if (error.code === '23505') {
      return { error: `O endereço "${slug}" já está em uso. Escolha outro nome.` }
    }
    return { error: 'Erro ao criar workspace. Tente novamente.' }
  }

  redirect(`/${workspace.slug}/dashboard`)
}

export async function getUserWorkspaces(
  client?: Awaited<ReturnType<typeof getServerClient>>
): Promise<Workspace[]> {
  const supabase = client ?? (await getServerClient())

  const { data, error } = await supabase
    .from('workspace_members')
    .select('workspaces(id, name, slug, plan)')

  if (error || !data) return []

  return data
    .map((row) => row.workspaces as Workspace | null)
    .filter((ws): ws is Workspace => ws !== null)
}
