'use server'

import { revalidatePath } from 'next/cache'
import { getServerClient } from '@/server/server'
import type { Lead, LeadStatus } from '@/types/lead'
import type { LeadInput } from '@/lib/validations/lead'

// §6.2 Eliminate N+1: resolve owner name a partir da tabela profiles
// em uma segunda query (não um loop), depois mescla em memória.

function buildLead(row: Record<string, unknown>, ownerMap: Map<string, string>): Lead {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string | null) ?? '',
    company: (row.company as string | null) ?? '',
    role: (row.position as string | null) ?? '',        // DB: position → UI: role
    status: row.status as LeadStatus,
    ownerName: ownerMap.get(row.owner_id as string) ?? '—',
    workspaceId: row.workspace_id as string,
    createdAt: row.created_at as string,
    estimatedValue: (row.estimated_value as number | null) ?? undefined,
    notes: (row.notes as string | null) ?? undefined,
  }
}

const PAGE_SIZE = 8

export interface ListLeadsOptions {
  search?: string
  status?: LeadStatus[]
  page?: number
}

export async function listLeads(
  workspaceId: string,
  options: ListLeadsOptions = {},
): Promise<{ leads: Lead[]; total: number }> {
  const supabase = await getServerClient()
  const { search = '', status = [], page = 1 } = options

  // §1.2 + §1.3: GIN trigram index (idx_leads_name_trgm etc.) para ILIKE
  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (search.trim()) {
    // Escapa caracteres PostgREST especiais no search (segurança)
    const safe = search.replace(/[(),%]/g, (c) => `\\${c}`)
    // OR com ilike usa os índices GIN trigram criados na migration 0005
    query = query.or(
      `name.ilike.%${safe}%,email.ilike.%${safe}%,company.ilike.%${safe}%`,
    )
  }

  if (status.length > 0) {
    query = query.in('status', status)
  }

  const { data, error, count } = await query
  if (error || !data) return { leads: [], total: 0 }

  // §6.2: 2 queries em vez de N — resolve todos os owner_ids de uma vez
  const ownerMap = await resolveOwnerNames(data.map((r) => r.owner_id).filter(Boolean))

  return { leads: data.map((r) => buildLead(r, ownerMap)), total: count ?? 0 }
}

export async function getLead(workspaceId: string, leadId: string): Promise<Lead | null> {
  const supabase = await getServerClient()
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('id', leadId)
    .single()

  if (error || !data) return null
  const ownerMap = await resolveOwnerNames([data.owner_id].filter(Boolean))
  return buildLead(data, ownerMap)
}

export async function createLead(
  workspaceId: string,
  input: LeadInput,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('leads').insert({
    workspace_id: workspaceId,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    company: input.company || null,
    position: input.role || null,       // UI: role → DB: position
    status: input.status,
    estimated_value: input.estimatedValue ?? null,
    notes: input.notes ?? null,
    owner_id: user?.id ?? null,
  })

  if (error) return { error: 'Erro ao criar lead. Tente novamente.' }
  revalidatePath('/[workspace]/leads', 'page')
  return {}
}

export async function updateLead(
  workspaceId: string,
  leadId: string,
  input: Partial<LeadInput>,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: any = {}
  if (input.name !== undefined)           patch.name = input.name
  if (input.email !== undefined)          patch.email = input.email
  if (input.phone !== undefined)          patch.phone = input.phone || null
  if (input.company !== undefined)        patch.company = input.company || null
  if (input.role !== undefined)           patch.position = input.role || null
  if (input.status !== undefined)         patch.status = input.status
  if (input.estimatedValue !== undefined) patch.estimated_value = input.estimatedValue ?? null
  if (input.notes !== undefined)          patch.notes = input.notes ?? null

  const { error } = await supabase
    .from('leads')
    .update(patch)
    .eq('workspace_id', workspaceId)
    .eq('id', leadId)

  if (error) return { error: 'Erro ao atualizar lead.' }
  revalidatePath('/[workspace]/leads', 'page')
  revalidatePath('/[workspace]/leads/[id]', 'page')
  return {}
}

export async function deleteLead(
  workspaceId: string,
  leadId: string,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('id', leadId)

  if (error) return { error: 'Erro ao excluir lead.' }
  revalidatePath('/[workspace]/leads', 'page')
  return {}
}

// ─── Utilitário: resolve UUIDs → nomes via profiles ──────────
// §6.2: 1 query para todos os UUIDs, não N queries em loop
async function resolveOwnerNames(ids: (string | null)[]): Promise<Map<string, string>> {
  const validIds = Array.from(new Set(ids.filter((id): id is string => Boolean(id))))
  if (validIds.length === 0) return new Map()

  const supabase = await getServerClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .in('id', validIds)

  return new Map(
    (data ?? []).map((p) => [p.id, p.full_name || p.email || '—']),
  )
}
