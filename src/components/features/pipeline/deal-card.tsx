'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { MoreHorizontal, Calendar, Eye, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Deal, type PipelineStageConfig, PIPELINE_STAGES } from '@/types/deal'
import { cn } from '@/lib/utils'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDeadline(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
    .toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
    .replace('.', '')
}

function isOverdue(deadline?: string) {
  if (!deadline) return false
  const [year, month, day] = deadline.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface CardBodyProps {
  deal: Deal
  stageConfig: PipelineStageConfig
  onView?: () => void
  onEdit?: () => void
}

export function CardBody({ deal, stageConfig, onView, onEdit }: CardBodyProps) {
  const overdue = isOverdue(deal.deadline)
  const ownerFirstName = deal.ownerName.split(' ')[0].toUpperCase()
  const hasActions = !!(onView || onEdit)

  return (
    <div className="space-y-2.5">
      {/* Título + menu */}
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-semibold leading-snug">
          {deal.title} — {deal.company}
        </p>
        {hasActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 shrink-0 -mt-0.5 -mr-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only">Ações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onView && (
                <DropdownMenuItem
                  onSelect={() => onView()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Eye className="mr-2 h-3.5 w-3.5" />
                  Ver detalhes
                </DropdownMenuItem>
              )}
              {onEdit && (
                <>
                  {onView && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onSelect={() => onEdit()}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    Editar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Contato */}
      <div className="flex items-center gap-1.5">
        <Avatar className="h-5 w-5 shrink-0">
          <AvatarFallback
            className={cn('text-[9px] font-semibold', stageConfig.headerTextClass)}
            style={{ backgroundColor: 'transparent', border: '1px solid currentColor' }}
          >
            {initials(deal.leadName)}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-xs text-muted-foreground">
          {deal.leadName} · {deal.company}
        </span>
      </div>

      {/* Valor + responsável (cor do estágio) */}
      <div className="flex items-center justify-between gap-2">
        <span className={cn('font-mono text-sm font-bold', stageConfig.headerTextClass)}>
          {formatCurrency(deal.estimatedValue)}
        </span>
        <span className={cn('text-[10px] font-semibold uppercase tracking-wide', stageConfig.headerTextClass)}>
          {ownerFirstName}
        </span>
      </div>

      {/* Prazo */}
      {deal.deadline && (
        <div
          className={cn(
            'flex items-center gap-1 text-xs',
            overdue ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          <Calendar className="h-3 w-3 shrink-0" />
          <span>{formatDeadline(deal.deadline)}</span>
          {overdue && <span className="font-semibold">· Vencido</span>}
        </div>
      )}
    </div>
  )
}

interface DealCardProps {
  deal: Deal
  onClick: (deal: Deal) => void
  onEdit: (deal: Deal) => void
}

export function DealCard({ deal, onClick, onEdit }: DealCardProps) {
  const stageConfig = PIPELINE_STAGES.find((s) => s.id === deal.stage)!

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onClick(deal)}
      className={cn(
        'group cursor-grab rounded-lg border border-border bg-card p-3',
        'transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md',
        'active:cursor-grabbing',
        isDragging && 'opacity-40 shadow-none',
      )}
    >
      <CardBody
        deal={deal}
        stageConfig={stageConfig}
        onView={() => onClick(deal)}
        onEdit={() => onEdit(deal)}
      />
    </div>
  )
}

interface DealCardOverlayProps {
  deal: Deal
}

export function DealCardOverlay({ deal }: DealCardOverlayProps) {
  const stageConfig = PIPELINE_STAGES.find((s) => s.id === deal.stage)!

  return (
    <div
      style={{ boxShadow: stageConfig.glowShadow }}
      className="cursor-grabbing rounded-lg border border-border bg-card p-3 rotate-1 scale-105"
    >
      <CardBody deal={deal} stageConfig={stageConfig} />
    </div>
  )
}
