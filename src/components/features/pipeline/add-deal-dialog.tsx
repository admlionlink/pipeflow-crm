'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { dealSchema, type DealInput } from '@/lib/validations/deal'
import { DEAL_STAGE_OPTIONS, type Deal, type DealStage } from '@/types/deal'

interface AddDealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal?: Deal
  defaultStage?: DealStage
  onSubmit: (data: DealInput) => void
}

export function AddDealDialog({
  open,
  onOpenChange,
  deal,
  defaultStage,
  onSubmit,
}: AddDealDialogProps) {
  const isEditing = !!deal

  const form = useForm<DealInput>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      leadName: '',
      company: '',
      estimatedValue: 0,
      stage: defaultStage ?? 'novo',
      ownerName: 'Andrea Rouca',
      deadline: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (deal) {
        form.reset({
          title: deal.title,
          leadName: deal.leadName,
          company: deal.company,
          estimatedValue: deal.estimatedValue,
          stage: deal.stage,
          ownerName: deal.ownerName,
          deadline: deal.deadline ?? '',
          notes: deal.notes ?? '',
        })
      } else {
        form.reset({
          title: '',
          leadName: '',
          company: '',
          estimatedValue: 0,
          stage: defaultStage ?? 'novo',
          ownerName: 'Andrea Rouca',
          deadline: '',
          notes: '',
        })
      }
    }
  }, [open, deal, defaultStage, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar negócio' : 'Novo negócio'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações do negócio abaixo.'
              : 'Adicione uma oportunidade ao seu pipeline de vendas.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do negócio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Sistema ERP, Licenças Pro..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="leadName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do contato</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ana Paula Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="estimatedValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor estimado (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 48000"
                        min={0}
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const n = e.target.valueAsNumber
                          field.onChange(isNaN(n) ? 0 : n)
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etapa</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        {DEAL_STAGE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[68px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Contexto relevante sobre este negócio..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-1">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? 'Salvar alterações' : 'Criar negócio'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
