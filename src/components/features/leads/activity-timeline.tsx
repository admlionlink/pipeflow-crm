'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, Mail, Calendar, FileText } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { cn, formatRelativeDate, formatAbsoluteDate } from '@/lib/utils'
import { type Activity, type ActivityType } from '@/types/activity'
import { NewActivityDialog } from '@/components/features/leads/new-activity-dialog'

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: React.ElementType; label: string; iconClass: string }
> = {
  call:    { icon: Phone,     label: 'Ligação',  iconClass: 'text-blue-400 bg-blue-500/20' },
  email:   { icon: Mail,      label: 'E-mail',   iconClass: 'text-amber-400 bg-amber-500/20' },
  meeting: { icon: Calendar,  label: 'Reunião',  iconClass: 'text-violet-400 bg-violet-500/20' },
  note:    { icon: FileText,  label: 'Nota',     iconClass: 'text-zinc-400 bg-zinc-500/15' },
}

const TYPE_FILTERS: { value: ActivityType | 'all'; label: string }[] = [
  { value: 'all',     label: 'Todas' },
  { value: 'call',    label: 'Ligações' },
  { value: 'email',   label: 'E-mails' },
  { value: 'meeting', label: 'Reuniões' },
  { value: 'note',    label: 'Notas' },
]

interface ActivityTimelineProps {
  activities: Activity[]
  leadId: string
  workspaceId: string
}

export function ActivityTimeline({ activities: initial, leadId, workspaceId }: ActivityTimelineProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [localActivities, setLocalActivities] = useState<Activity[]>(initial)
  const [activeFilter, setActiveFilter] = useState<ActivityType | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  // Optimistic add: dialog retorna a atividade já criada
  function handleAddActivity(activity: Activity) {
    setLocalActivities((prev) => [activity, ...prev])
    // Refresca para garantir sincronia com o banco
    startTransition(() => router.refresh())
  }

  const filtered =
    activeFilter === 'all'
      ? localActivities
      : localActivities.filter((a) => a.type === activeFilter)

  // Mais recente no topo (servidor já ordena DESC, mas mantemos aqui para
  // que o optimistic insert apareça no lugar certo)
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="space-y-4">
      {/* Header + botão + filtros */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold">Atividades</h2>
          <p className="text-xs text-muted-foreground">
            {localActivities.length} registro{localActivities.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
          + Nova atividade
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              activeFilter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          {activeFilter === 'all'
            ? 'Nenhuma atividade registrada ainda.'
            : `Nenhuma atividade do tipo "${ACTIVITY_CONFIG[activeFilter as ActivityType]?.label}" registrada.`}
        </div>
      ) : (
        <ol className="space-y-3">
          {sorted.map((activity) => {
            const config = ACTIVITY_CONFIG[activity.type]
            const Icon = config.icon
            const initials = activity.authorName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')

            return (
              <li key={activity.id} className="flex gap-3">
                <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', config.iconClass)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{config.label}</p>
                      {activity.description && (
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {activity.description}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs text-muted-foreground whitespace-nowrap cursor-default">
                            {formatRelativeDate(activity.createdAt)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-xs">{formatAbsoluteDate(activity.createdAt)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-[8px]">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{activity.authorName}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <NewActivityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        leadId={leadId}
        workspaceId={workspaceId}
        onAdd={handleAddActivity}
      />
    </div>
  )
}
