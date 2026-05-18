import { Suspense } from 'react'
import { Briefcase, DollarSign, TrendingUp, Users } from 'lucide-react'
import { KpiCard } from '@/components/features/dashboard/kpi-card'
import { SalesFunnelChart } from '@/components/features/dashboard/funnel-chart'
import { UpcomingDeals } from '@/components/features/dashboard/upcoming-deals'
import { PeriodFilter } from '@/components/features/dashboard/period-filter'
import { getDashboardData, type Period } from '@/server/dashboard'
import { getServerClient } from '@/server/server'
import { formatCurrency } from '@/lib/utils'

const VALID_PERIODS = new Set<Period>(['7d', '30d', '90d'])

interface PageProps {
  params: { workspace: string }
  searchParams: { period?: string }
}

export default async function DashboardPage({ params, searchParams }: PageProps) {
  const supabase = await getServerClient()

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('slug', params.workspace)
    .single()

  const period: Period = VALID_PERIODS.has(searchParams.period as Period)
    ? (searchParams.period as Period)
    : '30d'

  // §6.2: getDashboardData usa Promise.all internamente
  const data = workspace
    ? await getDashboardData(workspace.id, period)
    : null

  const metrics = data ?? {
    totalLeads:     { value: 0, change: 0 },
    openDeals:      { value: 0, change: 0 },
    pipelineValue:  { value: 0, change: 0 },
    conversionRate: { value: 0, change: 0 },
    funnelData:     [],
    upcomingDeals:  [],
  }

  const STAGE_COLORS: Record<string, string> = {
    novo:       '#5B7FFF',
    contatado:  '#00B4D8',
    qualificado:'#f5d10d',
    negociando: '#FF6B35',
    convertido: '#2ED573',
    perdido:    '#FF4757',
  }

  // Adapta funnelData para o formato que SalesFunnelChart espera
  const funnelData = metrics.funnelData.map((item) => ({
    stage: item.label,
    label: item.label,
    color: STAGE_COLORS[item.stage] ?? '#888',
    count: item.count,
    value: item.value,
  }))

  // Adapta upcomingDeals para o formato que UpcomingDeals espera
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingDeals = metrics.upcomingDeals.map((d) => {
    const deadline = new Date(d.dueDate)
    deadline.setHours(0, 0, 0, 0)
    const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return {
      id:             d.id,
      title:          d.title,
      company:        d.company,
      leadName:       d.leadName,
      estimatedValue: d.value,
      stage:          d.stage,
      ownerName:      '—',
      deadline:       d.dueDate,
      isOverdue:      daysUntil < 0,
      daysUntil,
    }
  })

  return (
    <div className="space-y-8 animate-fade-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visão geral das métricas do seu pipeline
          </p>
        </div>
        <Suspense>
          <PeriodFilter />
        </Suspense>
      </div>

      {/* KPI Grid */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
          01 — Métricas
        </p>
        <div className="rounded-xl border overflow-hidden grid grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Total de Leads"
            value={String(metrics.totalLeads.value)}
            change={metrics.totalLeads.change}
            icon={Users}
            className="border-b xl:border-b-0"
          />
          <KpiCard
            title="Negócios Abertos"
            value={String(metrics.openDeals.value)}
            change={metrics.openDeals.change}
            icon={Briefcase}
            className="border-l border-b xl:border-b-0"
          />
          <KpiCard
            title="Valor do Pipeline"
            value={formatCurrency(metrics.pipelineValue.value)}
            change={metrics.pipelineValue.change}
            icon={DollarSign}
            className="xl:border-l"
          />
          <KpiCard
            title="Taxa de Conversão"
            value={`${metrics.conversionRate.value.toFixed(1)}%`}
            change={metrics.conversionRate.change}
            icon={TrendingUp}
            className="border-l"
          />
        </div>
      </div>

      {/* Funil de vendas */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
          02 — Funil de Vendas
        </p>
        <SalesFunnelChart data={funnelData} />
      </div>

      {/* Negócios com prazo próximo */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
          03 — Prazos
        </p>
        <UpcomingDeals deals={upcomingDeals} workspaceSlug={params.workspace} />
      </div>
    </div>
  )
}
