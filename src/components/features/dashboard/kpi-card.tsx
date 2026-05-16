import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  iconClass?: string
  iconBgClass?: string
}

export function KpiCard({ title, value, change, icon: Icon, iconClass, iconBgClass }: KpiCardProps) {
  const positive = change >= 0
  const changeAbs = Math.abs(change)

  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={cn('rounded-lg p-2', iconBgClass ?? 'bg-primary/10')}>
          <Icon className={cn('h-4 w-4', iconClass ?? 'text-primary')} />
        </div>
      </div>

      <div className="space-y-1">
        <p className="font-mono text-3xl font-bold tracking-tight">{value}</p>
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            positive ? 'text-emerald-500' : 'text-red-500',
          )}
        >
          {positive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>
            {positive ? '+' : '-'}
            {changeAbs}% vs período anterior
          </span>
        </div>
      </div>
    </div>
  )
}
