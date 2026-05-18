'use server'

import { revalidatePath } from 'next/cache'
import { getServerClient } from '@/server/server'
import type { Activity, ActivityType } from '@/types/activity'

interface ActivityInput {
  type: ActivityType
  title: string
  description?: string
}

// §1.3: usa idx_activities_lead_date (composite index da migration 0005)
// ORDER BY created_at DESC — mais recente primeiro, como exibido na UI.
export async function listActivities(
  workspaceId: string,
  leadId: string,
): Promise<Activity[]> {
  const supabase = await getServerClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  // §6.2: resolve author names em 1 query adicional (não N)
  const authorIds = Array.from(new Set(data.map((a) => a.author_id).filter(Boolean)))
  let authorMap = new Map<string, string>()

  if (authorIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', authorIds)

    authorMap = new Map(
      (profiles ?? []).map((p) => [p.id, p.full_name || p.email || '—']),
    )
  }

  return data.map((row) => ({
    id: row.id,
    leadId: row.lead_id,
    type: row.type as ActivityType,
    title: row.title,
    description: row.description ?? undefined,
    authorName: authorMap.get(row.author_id) ?? '—',
    createdAt: row.created_at,
  }))
}

export async function createActivity(
  workspaceId: string,
  leadId: string,
  input: ActivityInput,
): Promise<{ error?: string; activity?: Activity }> {
  const supabase = await getServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado.' }

  const { data, error } = await supabase
    .from('activities')
    .insert({
      workspace_id: workspaceId,
      lead_id: leadId,
      author_id: user.id,
      type: input.type,
      title: input.title,
      description: input.description ?? null,
    })
    .select('*')
    .single()

  if (error || !data) return { error: 'Erro ao registrar atividade.' }

  // §6.2: busca o nome do autor para retornar ao cliente
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  revalidatePath('/[workspace]/leads/[id]', 'page')

  return {
    activity: {
      id: data.id,
      leadId: data.lead_id,
      type: data.type as ActivityType,
      title: data.title,
      description: data.description ?? undefined,
      authorName: profile?.full_name || profile?.email || '—',
      createdAt: data.created_at,
    },
  }
}

export async function deleteActivity(
  workspaceId: string,
  activityId: string,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('id', activityId)

  if (error) return { error: 'Erro ao excluir atividade.' }
  revalidatePath('/[workspace]/leads/[id]', 'page')
  return {}
}
