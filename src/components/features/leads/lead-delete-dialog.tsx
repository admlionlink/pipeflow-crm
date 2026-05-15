'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { type Lead } from '@/types/lead'

interface LeadDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead | null
  onConfirm: () => void
}

export function LeadDeleteDialog({ open, onOpenChange, lead, onConfirm }: LeadDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleConfirm() {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setIsLoading(false)
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="space-y-1">
              <DialogTitle>Excluir lead</DialogTitle>
              <DialogDescription>Essa ação não pode ser desfeita.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {lead && (
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir{' '}
            <span className="font-semibold text-foreground">{lead.name}</span>? Todas as
            atividades vinculadas a este lead serão removidas.
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
