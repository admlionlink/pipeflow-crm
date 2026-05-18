'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ChevronDown } from 'lucide-react'
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
import { getBrowserClient } from '@/server/client'

interface LeadOption {
  id: string
  name: string
  company: string | null
}

interface AddDealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  deal?: Deal
  defaultStage?: DealStage
  onSubmit: (data: DealInput, leadName?: string, leadCompany?: string) => void
}

export function AddDealDialog({
  open,
  onOpenChange,
  workspaceId,
  deal,
  defaultStage,
  onSubmit,
}: AddDealDialogProps) {
  const isEditing = !!deal
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [loadingLeads, setLoadingLeads] = useState(false)

  const form = useForm<DealInput>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      leadId: '',
      estimatedValue: 0,
      stage: defaultStage ?? 'novo',
      deadline: '',
      notes: '',
    },
  })

  // Carrega leads reais do workspace ao abrir o dialog
  useEffect(() => {
    if (!open || !workspaceId) return
    setLoadingLeads(true)
    const supabase = getBrowserClient()
    supabase
      .from('leads')
      .select('id, name, company')
      .eq('workspace_id', workspaceId)
      .order('name', { ascending: true })
      .then(({ data }) => {
        setLeads(data ?? [])
        setLoadingLeads(false)
      })
  }, [open, workspaceId])

  useEffect(() => {
    if (!open) return
    if (deal) {
      form.reset({
        title: deal.title,
        leadId: '',           // lead_id não vem no tipo Deal atual; fica vazio na edição
        estimatedValue: deal.estimatedValue,
        stage: deal.stage,
        deadline: deal.deadline ?? '',
        notes: deal.notes ?? '',
      })
    } else {
      form.reset({
        title: '',
        leadId: '',
        estimatedValue: 0,
        stage: defaultStage ?? 'novo',
        deadline: '',
        notes: '',
      })
    }
  }, [open, deal, defaultStage, form])

  function handleSubmit(data: DealInput) {
    const selectedLead = leads.find((l) => l.id === data.leadId)
    onSubmit(data, selectedLead?.name, selectedLead?.company ?? undefined)
  }


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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Implementação CRM — Empresa XYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lead vinculado — select com dados reais do banco */}
            <FormField
              control={form.control}
              name="leadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead vinculado</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        className="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-1 pr-8 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={loadingLeads}
                        {...field}
                      >
                        <option value="">
                          {loadingLeads ? 'Carregando leads…' : 'Selecione um lead (opcional)'}
                        </option>
                        {leads.map((lead) => (
                          <option key={lead.id} value={lead.id}>
                            {lead.name}{lead.company ? ` — ${lead.company}` : ''}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estágio */}
            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estágio *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        className="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-1 pr-8 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        {...field}
                      >
                        {DEAL_STAGE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Valor + Prazo */}
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
                        placeholder="0"
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

            {/* Observações */}
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
