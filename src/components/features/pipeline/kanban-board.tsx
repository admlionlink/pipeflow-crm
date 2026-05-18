'use client'

import { useState, useMemo, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { PIPELINE_STAGES, type Deal, type DealStage } from '@/types/deal'
import { type DealInput } from '@/lib/validations/deal'
import { createDeal, updateDeal, deleteDeal, moveDeal } from '@/server/deals'
import { KanbanColumn } from './kanban-column'
import { DealCardOverlay } from './deal-card'
import { AddDealDialog } from './add-deal-dialog'
import { DealDetailSheet } from './deal-detail-sheet'

interface KanbanBoardProps {
  workspaceId: string
  initialDeals: Deal[]
}

export function KanbanBoard({ workspaceId, initialDeals }: KanbanBoardProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  useEffect(() => setDeals(initialDeals), [initialDeals])

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

  const dealsByStage = useMemo(
    () =>
      Object.fromEntries(
        PIPELINE_STAGES.map((stage) => [stage.id, deals.filter((d) => d.stage === stage.id)]),
      ) as Record<DealStage, Deal[]>,
    [deals],
  )

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return
    const newStage = over.id as DealStage
    const deal = deals.find((d) => d.id === active.id)
    if (!deal || deal.stage === newStage) return

    // §5.1 Short Transactions: optimistic update imediato, sem bloquear UI
    const prevStage = deal.stage
    setDeals((prev) => prev.map((d) => d.id === active.id ? { ...d, stage: newStage } : d))

    const stageLabel = PIPELINE_STAGES.find((s) => s.id === newStage)?.label
    toast.success(`"${deal.title}" movido para ${stageLabel}`)

    // Persiste no banco em background
    const result = await moveDeal(workspaceId, deal.id, newStage)
    if (result.error) {
      // Rollback otimista
      setDeals((prev) => prev.map((d) => d.id === active.id ? { ...d, stage: prevStage } : d))
      toast.error('Erro ao mover negócio. Tente novamente.')
    }
  }

  function handleAddDeal(stageId: DealStage) {
    setAddDialogStage(stageId)
    setAddDialogOpen(true)
  }

  function handleEditDeal(deal: Deal) {
    setEditingDeal(deal)
    setEditDialogOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleCreateDeal(data: DealInput, _leadName?: string, _company?: string) {
    const result = await createDeal(workspaceId, data)
    if (result.error) { toast.error(result.error); return }
    toast.success('Negócio criado com sucesso!')
    setAddDialogOpen(false)
    startTransition(() => router.refresh())
  }

  async function handleSaveEdit(data: DealInput, leadName?: string, leadCompany?: string) {
    if (!editingDeal) return
    // Optimistic update — preserva leadName/company do deal anterior se lead não mudou
    setDeals((prev) => prev.map((d) =>
      d.id === editingDeal.id
        ? {
            ...d,
            title: data.title,
            estimatedValue: data.estimatedValue,
            deadline: data.deadline,
            stage: data.stage,
            notes: data.notes,
            ...(leadName ? { leadName, company: leadCompany ?? '—' } : {}),
          }
        : d
    ))
    setEditDialogOpen(false)
    setEditingDeal(null)
    const result = await updateDeal(workspaceId, editingDeal.id, data)
    if (result.error) {
      toast.error(result.error)
      startTransition(() => router.refresh())
    } else {
      toast.success('Negócio atualizado!')
      startTransition(() => router.refresh()) // garante sync com lead vinculado
    }
  }

  function handleClickDeal(deal: Deal) {
    setSelectedDeal(deal)
    setSheetOpen(true)
  }

  async function handleDeleteDeal(dealId: string) {
    const deal = deals.find((d) => d.id === dealId)
    setDeals((prev) => prev.filter((d) => d.id !== dealId))
    setSheetOpen(false)
    const result = await deleteDeal(workspaceId, dealId)
    if (result.error) {
      toast.error(result.error)
      startTransition(() => router.refresh())
    } else {
      toast.success(`"${deal?.title}" excluído.`)
    }
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

      <AddDealDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        workspaceId={workspaceId}
        defaultStage={addDialogStage}
        onSubmit={handleCreateDeal}
      />

      <AddDealDialog
        open={editDialogOpen}
        onOpenChange={(open) => { setEditDialogOpen(open); if (!open) setEditingDeal(null) }}
        workspaceId={workspaceId}
        deal={editingDeal ?? undefined}
        onSubmit={handleSaveEdit}
      />

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
