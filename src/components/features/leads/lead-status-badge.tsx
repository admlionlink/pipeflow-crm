import { Badge } from '@/components/ui/badge'
import { type LeadStatus } from '@/types/lead'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  novo: {
    label: 'Novo',
    className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30 dark:text-zinc-400',
  },
  contatado: {
    label: 'Contatado',
    className: 'bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400',
  },
  qualificado: {
    label: 'Qualificado',
    className: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400',
  },
  negociando: {
    label: 'Negociando',
    className: 'bg-orange-500/15 text-orange-600 border-orange-500/30 dark:text-orange-400',
  },
  convertido: {
    label: 'Convertido',
    className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
  },
  perdido: {
    label: 'Perdido',
    className: 'bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400',
  },
}

interface LeadStatusBadgeProps {
  status: LeadStatus
  className?: string
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
