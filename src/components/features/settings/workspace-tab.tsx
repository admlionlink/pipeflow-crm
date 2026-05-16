'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type Workspace } from '@/types/workspace'

const workspaceSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(50),
  slug: z
    .string()
    .min(2, 'Slug deve ter pelo menos 2 caracteres')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífens'),
})

type WorkspaceFormInput = z.infer<typeof workspaceSchema>

interface WorkspaceTabProps {
  workspace: Workspace
}

export function WorkspaceTab({ workspace }: WorkspaceTabProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<WorkspaceFormInput>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { name: workspace.name, slug: workspace.slug },
  })

  async function onSubmit() {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSaving(false)
    toast.success('Workspace atualizado!')
  }

  async function handleDelete() {
    setIsDeleting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setIsDeleting(false)
    setDeleteOpen(false)
    toast.error('Workspace excluído (simulação)')
  }

  return (
    <div className="space-y-8">
      {/* Formulário de informações */}
      <div>
        <h3 className="mb-4 text-sm font-semibold">Informações do Workspace</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Minha Empresa" disabled={isSaving} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do workspace</FormLabel>
                  <FormControl>
                    <div className="flex items-center rounded-md border border-input bg-background">
                      <span className="border-r border-input px-3 py-2 text-sm text-muted-foreground">
                        app.pipeflow.io/
                      </span>
                      <Input
                        className="border-0 rounded-l-none focus-visible:ring-0"
                        placeholder="minha-empresa"
                        disabled={isSaving}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving && <Loader2 className="animate-spin" />}
              {isSaving ? 'Salvando…' : 'Salvar alterações'}
            </Button>
          </form>
        </Form>
      </div>

      {/* Zona de perigo */}
      <div className="rounded-lg border border-destructive/40 p-4">
        <h3 className="mb-1 text-sm font-semibold text-destructive">Zona de perigo</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Excluir o workspace removerá permanentemente todos os dados, leads e negócios. Esta ação não pode ser desfeita.
        </p>
        <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-3.5 w-3.5" />
          Excluir workspace
        </Button>
      </div>

      {/* Dialog de confirmação */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir workspace</DialogTitle>
            <DialogDescription>
              Tem certeza? Todos os dados de <strong>{workspace.name}</strong> serão excluídos permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="animate-spin" />}
              {isDeleting ? 'Excluindo…' : 'Excluir permanentemente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
