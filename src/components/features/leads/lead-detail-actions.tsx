'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { LeadFormDialog } from './lead-form-dialog'
import { LeadDeleteDialog } from './lead-delete-dialog'
import { type Lead } from '@/types/lead'
import { type LeadInput } from '@/lib/validations/lead'

interface LeadDetailActionsProps {
  lead: Lead
  workspaceSlug: string
}

export function LeadDetailActions({ lead, workspaceSlug }: LeadDetailActionsProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleEdit(_: LeadInput) {
    setEditOpen(false)
    toast.success('Lead atualizado com sucesso!')
  }

  function handleDelete() {
    setDeleteOpen(false)
    toast.success('Lead excluído.')
    router.push(`/${workspaceSlug}/leads`)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <Pencil className="h-4 w-4" />
        Editar lead
      </Button>

      <LeadFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        lead={lead}
        onSubmit={handleEdit}
      />
      <LeadDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        lead={lead}
        onConfirm={handleDelete}
      />
    </>
  )
}
