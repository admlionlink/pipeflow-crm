'use server'

import { revalidatePath } from 'next/cache'
import { getServerClient } from '@/server/server'
import type { Deal, DealStage } from '@/types/deal'
import type { DealInput } from '@/lib/validations/deal'

// §6.2 Eliminate N+1: busca leads e profiles em queries separadas,
// não em loop — depois mescla em memória.

function buildDeal(
  row: Record<string, unknown>,
  leadMap: Map<string, { name: string; company: string }>,
  ownerMap: Map<string, string>,
): Deal {
  const lead = leadMap.get(row.lead_id as string)
  return {
    id: row.id as string,
    title: row.title as string,
    leadName: lead?.name ?? (row.title as string),
    company: lead?.company ?? '—',
    estimatedValue: (row.value as number | null) ?? 0,  // DB: value → UI: estimatedValue
    stage: row.stage as DealStage,
    ownerName: ownerMap.get(row.owner_id as string) ?? '—',
    workspaceId: row.workspace_id as string,
    createdAt: row.created_at as string,
    deadline: (row.due_date as string | null) ?? undefined,  // DB: due_date → UI: deadline
    notes: (row.notes as string | null) ?? undefined,
  }
}

export async function listDeals(workspaceId: string): Promise<Deal[]> {
  const supabase = await getServerClient()

  // §1.3: usa idx_deals_ws_stage_date (composite index da migration 0005)
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  // §6.2: resolve lead info e owner names em 2 queries, não N
  const leadIds = Array.from(new Set(data.map((d) => d.lead_id).filter((id): id is string => Boolean(id))))
  const ownerIds = Array.from(new Set(data.map((d) => d.owner_id).filter((id): id is string => Boolean(id))))

  const [leadsResult, profilesResult] = await Promise.all([
    leadIds.length > 0
      ? supabase.from('leads').select('id, name, company').in('id', leadIds)
      : Promise.resolve({ data: [] }),
    ownerIds.length > 0
      ? supabase.from('profiles').select('id, full_name, email').in('id', ownerIds)
      : Promise.resolve({ data: [] }),
  ])

  const leadMap = new Map(
    ((leadsResult.data as { id: string; name: string; company: string | null }[] | null) ?? []).map(
      (l) => [l.id, { name: l.name, company: l.company ?? '—' }],
    ),
  )
  const ownerMap = new Map(
    ((profilesResult.data as { id: string; full_name: string; email: string }[] | null) ?? []).map(
      (p) => [p.id, p.full_name || p.email || '—'],
    ),
  )

  return data.map((r) => buildDeal(r, leadMap, ownerMap))
}

export async function createDeal(
  workspaceId: string,
  input: DealInput,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('deals').insert({
    workspace_id: workspaceId,
    title: input.title,
    stage: input.stage,
    value: input.estimatedValue ?? null,
    due_date: input.deadline ?? null,
    notes: input.notes ?? null,
    owner_id: user?.id ?? null,
    lead_id: input.leadId || null,   // vínculo com lead real
  })

  if (error) return { error: 'Erro ao criar negócio.' }
  revalidatePath('/[workspace]/pipeline', 'page')
  return {}
}

export async function updateDeal(
  workspaceId: string,
  dealId: string,
  input: Partial<DealInput>,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: any = {}
  if (input.title !== undefined)          patch.title = input.title
  if (input.stage !== undefined)          patch.stage = input.stage
  if (input.estimatedValue !== undefined) patch.value = input.estimatedValue ?? null
  if (input.deadline !== undefined)       patch.due_date = input.deadline ?? null
  if (input.notes !== undefined)          patch.notes = input.notes ?? null
  if (input.leadId !== undefined)         patch.lead_id = input.leadId || null

  const { error } = await supabase
    .from('deals')
    .update(patch)
    .eq('workspace_id', workspaceId)
    .eq('id', dealId)

  if (error) return { error: 'Erro ao atualizar negócio.' }
  revalidatePath('/[workspace]/pipeline', 'page')
  return {}
}

// §5.1 Short Transactions: apenas a coluna stage é atualizada — sem
// outros dados — para manter a transação mínima no drag-and-drop.
export async function moveDeal(
  workspaceId: string,
  dealId: string,
  stage: DealStage,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()
  const { error } = await supabase
    .from('deals')
    .update({ stage })
    .eq('workspace_id', workspaceId)
    .eq('id', dealId)

  if (error) return { error: 'Erro ao mover negócio.' }
  revalidatePath('/[workspace]/pipeline', 'page')
  return {}
}

export async function deleteDeal(
  workspaceId: string,
  dealId: string,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('id', dealId)

  if (error) return { error: 'Erro ao excluir negócio.' }
  revalidatePath('/[workspace]/pipeline', 'page')
  return {}
}
