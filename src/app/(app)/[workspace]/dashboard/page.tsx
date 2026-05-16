import { Suspense } from 'react'
import { BarChart3, Briefcase, DollarSign, TrendingUp, Users } from 'lucide-react'
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
    <div className="space-y-6 animate-fade-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Visão geral das métricas do seu pipeline
            </p>
          </div>
        </div>
        <Suspense>
          <PeriodFilter />
        </Suspense>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total de Leads"
          value={String(metrics.totalLeads.value)}
          change={metrics.totalLeads.change}
          icon={Users}
          iconClass="text-blue-500"
          iconBgClass="bg-blue-500/10"
        />
        <KpiCard
          title="Negócios Abertos"
          value={String(metrics.openDeals.value)}
          change={metrics.openDeals.change}
          icon={Briefcase}
          iconClass="text-primary"
          iconBgClass="bg-primary/10"
        />
        <KpiCard
          title="Valor do Pipeline"
          value={formatCurrency(metrics.pipelineValue.value)}
          change={metrics.pipelineValue.change}
          icon={DollarSign}
          iconClass="text-amber-500"
          iconBgClass="bg-amber-500/10"
        />
        <KpiCard
          title="Taxa de Conversão"
          value={`${metrics.conversionRate.value.toFixed(1)}%`}
          change={metrics.conversionRate.change}
          icon={TrendingUp}
          iconClass="text-emerald-500"
          iconBgClass="bg-emerald-500/10"
        />
      </div>

      {/* Full-width bar chart */}
      <SalesFunnelChart data={funnelData} />

      {/* Full-width upcoming deals table */}
      <UpcomingDeals deals={upcomingDeals} workspaceSlug={params.workspace} />
    </div>
  )
}
