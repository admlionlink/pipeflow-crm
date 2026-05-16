import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  className?: string
}

export function KpiCard({ title, value, change, icon: Icon, className }: KpiCardProps) {
  const positive = change >= 0
  const changeAbs = Math.abs(change)

  return (
    <div className={cn('p-5 flex flex-col gap-3 group hover:bg-pf-surface-2 transition-colors', className)}>
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
          {title}
        </span>
        <Icon className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
      </div>

      <div className="space-y-1.5">
        <p className="font-display text-[2rem] font-bold tracking-tight leading-none">{value}</p>
        <div
          className={cn(
            'flex items-center gap-1 text-[11px] font-mono',
            positive ? 'text-pf-positive' : 'text-pf-negative',
          )}
        >
          <span>{positive ? '↑' : '↓'}</span>
          <span>
            {positive ? '+' : ''}
            {changeAbs}% vs período anterior
          </span>
        </div>
      </div>
    </div>
  )
}
