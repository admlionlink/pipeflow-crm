'use client'

import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MOCK_DEALS } from '@/lib/mocks/deals'
import { PIPELINE_STAGES, type Deal, type DealStage } from '@/types/deal'
import { type DealInput } from '@/lib/validations/deal'
import { KanbanColumn } from './kanban-column'
import { DealCardOverlay } from './deal-card'
import { AddDealDialog } from './add-deal-dialog'
import { DealDetailSheet } from './deal-detail-sheet'

interface KanbanBoardProps {
  workspaceId: string
}

export function KanbanBoard({ workspaceId }: KanbanBoardProps) {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS)
  const [activeId, setActiveId] = useState<string | null>(null)

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addDialogStage, setAddDialogStage] = useState<DealStage>('novo')

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const activeDeal = useMemo(() => deals.find((d) => d.id === activeId) ?? null, [deals, activeId])

  const dealsByStage = useMemo(() => {
    return Object.fromEntries(
      PIPELINE_STAGES.map((stage) => [stage.id, deals.filter((d) => d.stage === stage.id)]),
    ) as Record<DealStage, Deal[]>
  }, [deals])

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return
    const newStage = over.id as DealStage
    const deal = deals.find((d) => d.id === active.id)
    if (!deal || deal.stage === newStage) return
    setDeals((prev) => prev.map((d) => (d.id === active.id ? { ...d, stage: newStage } : d)))
    const stageLabel = PIPELINE_STAGES.find((s) => s.id === newStage)?.label
    toast.success(`"${deal.title}" movido para ${stageLabel}`)
  }

  function handleAddDeal(stageId: DealStage) {
    setAddDialogStage(stageId)
    setAddDialogOpen(true)
  }

  function handleEditDeal(deal: Deal) {
    setEditingDeal(deal)
    setEditDialogOpen(true)
  }

  function handleCreateDeal(data: DealInput) {
    const newDeal: Deal = {
      id: `d${Date.now()}`,
      ...data,
      workspaceId,
      createdAt: new Date().toISOString(),
    }
    setDeals((prev) => [newDeal, ...prev])
    setAddDialogOpen(false)
    toast.success('Negócio criado com sucesso!')
  }

  function handleSaveEdit(data: DealInput) {
    if (!editingDeal) return
    setDeals((prev) =>
      prev.map((d) => (d.id === editingDeal.id ? { ...d, ...data } : d)),
    )
    setEditDialogOpen(false)
    setEditingDeal(null)
    toast.success('Negócio atualizado!')
  }

  function handleClickDeal(deal: Deal) {
    setSelectedDeal(deal)
    setSheetOpen(true)
  }

  function handleDeleteDeal(dealId: string) {
    setDeals((prev) => prev.filter((d) => d.id !== dealId))
    toast.success('Negócio excluído.')
  }

  return (
    <div className="flex h-full flex-col">
      {/* Cabeçalho */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe seus negócios em cada etapa do funil de vendas
          </p>
        </div>
        <Button onClick={() => handleAddDeal('novo')}>
          <Plus className="h-4 w-4" />
          + Novo Negócio
        </Button>
      </div>

      {/* Board */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-6">
          {PIPELINE_STAGES.map((stage, index) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              deals={dealsByStage[stage.id]}
              index={index}
              onAddDeal={handleAddDeal}
              onClickDeal={handleClickDeal}
              onEditDeal={handleEditDeal}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
          {activeDeal && <DealCardOverlay deal={activeDeal} />}
        </DragOverlay>
      </DndContext>

      {/* Dialog: criar negócio */}
      <AddDealDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        defaultStage={addDialogStage}
        onSubmit={handleCreateDeal}
      />

      {/* Dialog: editar negócio */}
      <AddDealDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) setEditingDeal(null)
        }}
        deal={editingDeal ?? undefined}
        onSubmit={handleSaveEdit}
      />

      {/* Sheet: detalhe do negócio */}
      <DealDetailSheet
        deal={selectedDeal}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onEdit={handleEditDeal}
        onDelete={handleDeleteDeal}
      />
    </div>
  )
}
