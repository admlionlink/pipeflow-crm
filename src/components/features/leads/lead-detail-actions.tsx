'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { LeadFormDialog } from './lead-form-dialog'
import { LeadDeleteDialog } from './lead-delete-dialog'
import { updateLead, deleteLead } from '@/server/leads'
import { type Lead } from '@/types/lead'
import { type LeadInput } from '@/lib/validations/lead'

interface LeadDetailActionsProps {
  lead: Lead
  workspaceSlug: string
  workspaceId: string
}

export function LeadDetailActions({ lead, workspaceSlug, workspaceId }: LeadDetailActionsProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleEdit(data: LeadInput) {
    const result = await updateLead(workspaceId, lead.id, data)
    if (result.error) { toast.error(result.error); return }
    setEditOpen(false)
    toast.success('Lead atualizado com sucesso!')
    router.refresh()
  }

  async function handleDelete() {
    const result = await deleteLead(workspaceId, lead.id)
    if (result.error) { toast.error(result.error); return }
    setDeleteOpen(false)
    toast.success('Lead excluído.')
    router.push(`/${workspaceSlug}/leads`)
  }

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" />
          Editar lead
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </Button>
      </div>

      <LeadFormDialog open={editOpen} onOpenChange={setEditOpen} lead={lead} onSubmit={handleEdit} />
      <LeadDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} lead={lead} onConfirm={handleDelete} />
    </>
  )
}
