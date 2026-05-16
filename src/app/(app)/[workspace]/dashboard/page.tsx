import { Suspense } from 'react'
import { Briefcase, DollarSign, TrendingUp, Users } from 'lucide-react'
import { KpiCard } from '@/components/features/dashboard/kpi-card'
import { SalesFunnelChart } from '@/components/features/dashboard/funnel-chart'
import { UpcomingDeals } from '@/components/features/dashboard/upcoming-deals'
import { PeriodFilter } from '@/components/features/dashboard/period-filter'
import {
  getDashboardMetrics,
  getFunnelData,
  getUpcomingDeals,
  type Period,
} from '@/lib/mocks/dashboard'
import { formatCurrency } from '@/lib/utils'

const VALID_PERIODS = new Set<Period>(['7d', '30d', '90d'])

interface PageProps {
  params: { workspace: string }
  searchParams: { period?: string }
}

export default function DashboardPage({ params, searchParams }: PageProps) {
  const period: Period = VALID_PERIODS.has(searchParams.period as Period)
    ? (searchParams.period as Period)
    : '30d'

  const metrics = getDashboardMetrics(period)
  const funnelData = getFunnelData()
  const upcomingDeals = getUpcomingDeals()

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

      {/* KPI Grid conectado */}
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
