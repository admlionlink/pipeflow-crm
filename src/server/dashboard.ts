'use server'

import { getServerClient } from '@/server/server'
import type { DealStage } from '@/types/deal'

export type Period = '7d' | '30d' | '90d'

export interface KpiMetric {
  value: number
  change: number
}

export interface FunnelItem {
  stage: DealStage
  label: string
  count: number
  value: number
}

export interface UpcomingDeal {
  id: string
  title: string
  stage: DealStage
  dueDate: string
  value: number
  leadName: string
  company: string
}

export interface DashboardData {
  totalLeads: KpiMetric
  openDeals: KpiMetric
  pipelineValue: KpiMetric
  conversionRate: KpiMetric
  funnelData: FunnelItem[]
  upcomingDeals: UpcomingDeal[]
}

const STAGE_LABELS: Record<DealStage, string> = {
  novo: 'Novo Lead',
  contatado: 'Contatado',
  qualificado: 'Proposta Enviada',
  negociando: 'Negociação',
  convertido: 'Fechado',
  perdido: 'Perdido',
}

function pct(curr: number, prev: number): number {
  if (prev === 0) return curr > 0 ? 100 : 0
  return Math.round(((curr - prev) / prev) * 100)
}

// §6.2 + §PLAN.M13: todas as queries em Promise.all para
// minimizar latência — 4 round-trips → 1 round-trip concorrente.
export async function getDashboardData(
  workspaceId: string,
  period: Period = '30d',
): Promise<DashboardData> {
  const supabase = await getServerClient()
  const days = { '7d': 7, '30d': 30, '90d': 90 }[period]

  const now = new Date()
  const since = new Date(now.getTime() - days * 86_400_000).toISOString()
  const prevSince = new Date(now.getTime() - days * 2 * 86_400_000).toISOString()
  const today = now.toISOString().split('T')[0]

  // §6.2: Promise.all — 4 queries em paralelo, não sequenciais
  const [
    currLeadsRes,
    prevLeadsRes,
    currDealsRes,
    prevDealsRes,
    upcomingRes,
  ] = await Promise.all([
    // Total de leads no período
    supabase
      .from('leads')
      .select('status', { count: 'exact' })
      .eq('workspace_id', workspaceId)
      .gte('created_at', since),

    // Período anterior (para variação %)
    supabase
      .from('leads')
      .select('status', { count: 'exact' })
      .eq('workspace_id', workspaceId)
      .gte('created_at', prevSince)
      .lt('created_at', since),

    // Deals ativos no período — usa idx_deals_ws_stage_date
    supabase
      .from('deals')
      .select('stage, value')
      .eq('workspace_id', workspaceId)
      .gte('created_at', since)
      .not('stage', 'in', '(perdido)'),

    // Deals ativos período anterior
    supabase
      .from('deals')
      .select('stage, value')
      .eq('workspace_id', workspaceId)
      .gte('created_at', prevSince)
      .lt('created_at', since)
      .not('stage', 'in', '(perdido)'),

    // Prazos próximos — usa idx_deals_due_date (partial index com due_date IS NOT NULL)
    supabase
      .from('deals')
      .select('id, title, stage, value, due_date, lead_id')
      .eq('workspace_id', workspaceId)
      .not('due_date', 'is', null)
      .gte('due_date', today)
      .not('stage', 'in', '(convertido,perdido)')
      .order('due_date', { ascending: true })
      .limit(6),
  ])

  const currLeads = currLeadsRes.data ?? []
  const prevLeads = prevLeadsRes.data ?? []
  const currDeals = currDealsRes.data ?? []
  const prevDeals = prevDealsRes.data ?? []
  const upcoming = upcomingRes.data ?? []

  // Métricas de leads
  const totalLeadsCurr = currLeadsRes.count ?? 0
  const totalLeadsPrev = prevLeadsRes.count ?? 0
  const convertedCurr = currLeads.filter((l) => l.status === 'convertido').length
  const convertedPrev = prevLeads.filter((l) => l.status === 'convertido').length

  // Métricas de deals
  const openDealsCurr = currDeals.filter((d) => d.stage !== 'convertido').length
  const openDealsPrev = prevDeals.filter((d) => d.stage !== 'convertido').length
  const pipelineCurr = currDeals.reduce((s, d) => s + (d.value ?? 0), 0)
  const pipelinePrev = prevDeals.reduce((s, d) => s + (d.value ?? 0), 0)
  const convRateCurr = totalLeadsCurr > 0 ? (convertedCurr / totalLeadsCurr) * 100 : 0
  const convRatePrev = totalLeadsPrev > 0 ? (convertedPrev / totalLeadsPrev) * 100 : 0

  // Funil por estágio (todos os deals do workspace, não só do período)
  const { data: allDeals } = await supabase
    .from('deals')
    .select('stage, value')
    .eq('workspace_id', workspaceId)
    .not('stage', 'in', '(perdido)')

  const stageGroups = new Map<DealStage, { count: number; value: number }>()
  for (const deal of allDeals ?? []) {
    const entry = stageGroups.get(deal.stage as DealStage) ?? { count: 0, value: 0 }
    stageGroups.set(deal.stage as DealStage, {
      count: entry.count + 1,
      value: entry.value + (deal.value ?? 0),
    })
  }

  const STAGE_ORDER: DealStage[] = ['novo', 'contatado', 'qualificado', 'negociando', 'convertido']
  const funnelData: FunnelItem[] = STAGE_ORDER.map((stage) => ({
    stage,
    label: STAGE_LABELS[stage],
    count: stageGroups.get(stage)?.count ?? 0,
    value: stageGroups.get(stage)?.value ?? 0,
  }))

  // Resolve lead names para upcoming deals (§6.2: 1 query extra, não N)
  const leadIds = Array.from(new Set(upcoming.map((d) => d.lead_id).filter((id): id is string => Boolean(id))))
  let leadMap = new Map<string, { name: string; company: string }>()
  if (leadIds.length > 0) {
    const { data: leads } = await supabase
      .from('leads')
      .select('id, name, company')
      .in('id', leadIds)
    leadMap = new Map(
      (leads ?? []).map((l) => [l.id, { name: l.name, company: l.company ?? '—' }]),
    )
  }

  const upcomingDeals: UpcomingDeal[] = upcoming.map((d) => ({
    id: d.id,
    title: d.title,
    stage: d.stage as DealStage,
    dueDate: d.due_date!,
    value: d.value ?? 0,
    leadName: leadMap.get(d.lead_id!)?.name ?? d.title,
    company: leadMap.get(d.lead_id!)?.company ?? '—',
  }))

  return {
    totalLeads:     { value: totalLeadsCurr, change: pct(totalLeadsCurr, totalLeadsPrev) },
    openDeals:      { value: openDealsCurr,  change: pct(openDealsCurr,  openDealsPrev) },
    pipelineValue:  { value: pipelineCurr,   change: pct(pipelineCurr,   pipelinePrev) },
    conversionRate: { value: Math.round(convRateCurr * 10) / 10, change: Math.round((convRateCurr - convRatePrev) * 10) / 10 },
    funnelData,
    upcomingDeals,
  }
}
