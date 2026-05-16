'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface FunnelEntry {
  stage: string
  label: string
  color: string
  count: number
  value: number
}

interface FunnelChartProps {
  data: FunnelEntry[]
}

interface TooltipPayload {
  active?: boolean
  payload?: Array<{ payload: FunnelEntry }>
}

function CustomTooltip({ active, payload }: TooltipPayload) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-md text-xs space-y-1">
      <p className="font-semibold" style={{ color: d.color }}>
        {d.label}
      </p>
      <p className="text-muted-foreground">
        <span className="font-mono font-bold text-foreground">{d.count}</span> negócios
      </p>
      <p className="text-muted-foreground">
        <span className="font-mono font-bold text-foreground">{formatCurrency(d.value)}</span> em
        valor
      </p>
    </div>
  )
}

export function SalesFunnelChart({ data }: FunnelChartProps) {
  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold">Negócios por Etapa</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Distribuição do pipeline por fase</p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
          barCategoryGap="35%"
        >
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.4)' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56}>
            {data.map((entry) => (
              <Cell key={entry.stage} fill={entry.color} fillOpacity={0.9} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
