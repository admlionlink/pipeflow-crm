'use client'

import { useState } from 'react'
import { Phone, Mail, Calendar, FileText, Plus, Clock } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn, formatRelativeDate, formatAbsoluteDate } from '@/lib/utils'
import { type Activity, type ActivityType } from '@/types/activity'
import { NewActivityDialog } from '@/components/features/leads/new-activity-dialog'

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: React.ElementType; label: string; iconClass: string }
> = {
  call: { icon: Phone, label: 'Ligação', iconClass: 'text-blue-400 bg-blue-500/20' },
  email: { icon: Mail, label: 'E-mail', iconClass: 'text-amber-400 bg-amber-500/20' },
  meeting: { icon: Calendar, label: 'Reunião', iconClass: 'text-violet-400 bg-violet-500/20' },
  note: { icon: FileText, label: 'Nota', iconClass: 'text-zinc-400 bg-zinc-500/15' },
}

const TYPE_FILTERS: { value: ActivityType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'call', label: 'Ligações' },
  { value: 'email', label: 'E-mails' },
  { value: 'meeting', label: 'Reuniões' },
  { value: 'note', label: 'Notas' },
]

interface ActivityTimelineProps {
  activities: Activity[]
  leadId: string
}

export function ActivityTimeline({ activities, leadId }: ActivityTimelineProps) {
  const [localActivities, setLocalActivities] = useState<Activity[]>(activities)
  const [activeFilter, setActiveFilter] = useState<ActivityType | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleAddActivity(activity: Activity) {
    setLocalActivities((prev) => [activity, ...prev])
  }

  const filtered =
    activeFilter === 'all'
      ? localActivities
      : localActivities.filter((a) => a.type === activeFilter)

  // Mais recente no topo
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          Atividades
          {localActivities.length > 0 && (
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">
              ({localActivities.length})
            </span>
          )}
        </h3>
        <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Registrar atividade
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-1.5">
        {TYPE_FILTERS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              activeFilter === opt.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/60',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <Clock className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {localActivities.length === 0
              ? 'Nenhuma atividade registrada ainda.'
              : 'Nenhuma atividade com esse filtro.'}
          </p>
        </div>
      ) : (
        <div>
          {sorted.map((activity, index) => {
            const config = ACTIVITY_CONFIG[activity.type]
            const Icon = config.icon
            const isLast = index === sorted.length - 1

            return (
              <div key={activity.id} className="relative flex gap-4">
                {/* Linha conectora vertical */}
                {!isLast && (
                  <div className="absolute bottom-0 left-[19px] top-10 w-px bg-border" />
                )}

                {/* Ícone */}
                <div
                  className={cn(
                    'relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                    config.iconClass,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Conteúdo */}
                <div className="min-w-0 flex-1 pb-6">
                  {/* Tipo + Data */}
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {config.label}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <time
                          dateTime={activity.createdAt}
                          className="shrink-0 cursor-default whitespace-nowrap text-xs text-muted-foreground"
                        >
                          {formatRelativeDate(activity.createdAt)}
                        </time>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        {formatAbsoluteDate(activity.createdAt)}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Título */}
                  <p className="mt-0.5 font-semibold leading-snug">{activity.title}</p>

                  {/* Descrição */}
                  {activity.description && (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {activity.description}
                    </p>
                  )}

                  {/* Autor */}
                  <div className="mt-2 flex items-center gap-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[9px]">
                        {activity.authorName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{activity.authorName}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <NewActivityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        leadId={leadId}
        onAdd={handleAddActivity}
      />
    </div>
  )
}
