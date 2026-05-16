'use client'

import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Deal, type PipelineStageConfig } from '@/types/deal'
import { DealCard } from './deal-card'
import { cn } from '@/lib/utils'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

interface KanbanColumnProps {
  stage: PipelineStageConfig
  deals: Deal[]
  index: number
  onAddDeal: (stageId: PipelineStageConfig['id']) => void
  onClickDeal: (deal: Deal) => void
  onEditDeal: (deal: Deal) => void
}

export function KanbanColumn({
  stage,
  deals,
  index,
  onAddDeal,
  onClickDeal,
  onEditDeal,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  const total = deals.reduce((sum, d) => sum + d.estimatedValue, 0)

  return (
    <div
      className="animate-fade-slide-up flex w-72 shrink-0 flex-col rounded-xl border border-border/60 bg-card overflow-hidden"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Barra colorida no topo */}
      <div className={cn('h-[3px] w-full shrink-0', stage.barClass)} />

      {/* Cabeçalho */}
      <div className="px-3 pt-3 pb-2.5 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn('h-2 w-2 shrink-0 rounded-full', stage.dotClass)} />
            <span className={cn('text-xs font-bold tracking-wider truncate', stage.headerTextClass)}>
              {stage.headerLabel}
            </span>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {deals.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-6 w-6 shrink-0 hover:text-foreground', stage.headerTextClass)}
            onClick={() => onAddDeal(stage.id)}
            title={`Adicionar deal em ${stage.label}`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only">Adicionar deal</span>
          </Button>
        </div>

        {/* Total da coluna na cor do estágio */}
        {deals.length > 0 && (
          <p className={cn('mt-1.5 font-mono text-sm font-semibold', stage.headerTextClass)}>
            {formatCurrency(total)}
          </p>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-1 flex-col gap-2 px-2 pb-2 pt-0 min-h-[120px] transition-colors duration-150',
          isOver && 'bg-primary/5',
        )}
      >
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onClick={onClickDeal}
            onEdit={onEditDeal}
          />
        ))}

        {deals.length === 0 && (
          <button
            onClick={() => onAddDeal(stage.id)}
            className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/60 py-6 text-muted-foreground/40 transition-colors hover:border-primary/30 hover:text-muted-foreground"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">Adicionar deal</span>
          </button>
        )}
      </div>
    </div>
  )
}
