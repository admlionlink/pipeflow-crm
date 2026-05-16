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
    <div className="rounded-lg border bg-pf-surface border-pf-border px-3 py-2.5 shadow-lg text-xs space-y-1.5">
      <p className="font-mono font-semibold uppercase tracking-wider text-[10px]" style={{ color: d.color }}>
        {d.label}
      </p>
      <p className="text-muted-foreground">
        <span className="font-mono font-bold text-foreground">{d.count}</span> negócios
      </p>
      <p className="text-muted-foreground">
        <span className="font-mono font-bold text-foreground">{formatCurrency(d.value)}</span>
      </p>
    </div>
  )
}

export function SalesFunnelChart({ data }: FunnelChartProps) {
  return (
    <div className="rounded-xl border p-5 flex flex-col gap-4">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
          barCategoryGap="35%"
        >
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
          <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={52}>
            {data.map((entry) => (
              <Cell key={entry.stage} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
