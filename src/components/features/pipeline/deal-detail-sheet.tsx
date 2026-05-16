'use client'

import { useState } from 'react'
import { Pencil, Trash2, Building2, User, DollarSign, Calendar, FileText, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type Deal, PIPELINE_STAGES } from '@/types/deal'
import { cn } from '@/lib/utils'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatDeadline(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function isOverdue(deadline?: string) {
  if (!deadline) return false
  const [year, month, day] = deadline.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}

interface DealDetailSheetProps {
  deal: Deal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (deal: Deal) => void
  onDelete: (dealId: string) => void
}

export function DealDetailSheet({ deal, open, onOpenChange, onEdit, onDelete }: DealDetailSheetProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!deal) return null

  const stageConfig = PIPELINE_STAGES.find((s) => s.id === deal.stage)!
  const overdue = isOverdue(deal.deadline)

  const initials = deal.leadName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  function handleDelete() {
    onDelete(deal!.id)
    setConfirmDelete(false)
    onOpenChange(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="space-y-0 pb-4 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <SheetTitle className="text-base leading-snug">
                    {deal.title} — {deal.company}
                  </SheetTitle>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{deal.leadName}</p>
                </div>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fechar</span>
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="mt-5 space-y-5">
            {/* Valor e etapa */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-bold text-primary">
                {formatCurrency(deal.estimatedValue)}
              </span>
              <Badge variant="outline" className={cn('shrink-0', stageConfig.badgeClass)}>
                {stageConfig.label}
              </Badge>
            </div>

            {/* Prazo */}
            {deal.deadline && (
              <div
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2.5',
                  overdue
                    ? 'border-destructive/30 bg-destructive/5 text-destructive'
                    : 'border-border bg-muted/30 text-muted-foreground',
                )}
              >
                <Clock className="h-4 w-4 shrink-0" />
                <div className="text-sm">
                  <span className="font-medium">Prazo: </span>
                  {formatDeadline(deal.deadline)}
                  {overdue && <span className="ml-2 font-semibold">· Vencido</span>}
                </div>
              </div>
            )}

            {/* Detalhes */}
            <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
              <DetailRow icon={Building2} label="Empresa" value={deal.company} />
              <DetailRow icon={User} label="Contato" value={deal.leadName} />
              <DetailRow icon={User} label="Responsável" value={deal.ownerName} />
              <DetailRow
                icon={DollarSign}
                label="Valor"
                value={formatCurrency(deal.estimatedValue)}
                valueClass="font-mono text-primary font-semibold"
              />
              <DetailRow icon={Calendar} label="Criado em" value={formatDate(deal.createdAt)} />
            </div>

            {/* Observações */}
            {deal.notes && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Observações
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">{deal.notes}</p>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="mt-8 flex gap-2 border-t border-border pt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                onOpenChange(false)
                onEdit(deal!)
              }}
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir negócio?</DialogTitle>
            <DialogDescription>
              O negócio <strong>{deal.title}</strong> de{' '}
              <strong>{deal.leadName}</strong> será removido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface DetailRowProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  valueClass?: string
}

function DetailRow({ icon: Icon, label, value, valueClass }: DetailRowProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className={cn('text-sm', valueClass)}>{value}</span>
    </div>
  )
}
