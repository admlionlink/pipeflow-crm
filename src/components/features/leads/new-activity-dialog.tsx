'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Phone, Mail, Calendar, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { type Activity, type ActivityType } from '@/types/activity'

const activitySchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(120),
  description: z.string().max(500).optional(),
  extra: z.string().max(120).optional(),
})

type ActivityFormInput = z.infer<typeof activitySchema>

const TYPE_OPTIONS: {
  value: ActivityType
  label: string
  icon: React.ElementType
  iconClass: string
  extraLabel?: string
  extraPlaceholder?: string
}[] = [
  { value: 'call', label: 'Ligação', icon: Phone, iconClass: 'text-blue-400', extraLabel: 'Duração', extraPlaceholder: 'ex: 15 min' },
  { value: 'email', label: 'E-mail', icon: Mail, iconClass: 'text-amber-400' },
  { value: 'meeting', label: 'Reunião', icon: Calendar, iconClass: 'text-violet-400', extraLabel: 'Local ou link', extraPlaceholder: 'ex: Google Meet' },
  { value: 'note', label: 'Nota', icon: FileText, iconClass: 'text-zinc-400' },
]

interface NewActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadId: string
  workspaceId: string
  onAdd: (activity: Activity) => void
}

export function NewActivityDialog({ open, onOpenChange, leadId, workspaceId, onAdd }: NewActivityDialogProps) {
  const [selectedType, setSelectedType] = useState<ActivityType>('call')
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ActivityFormInput>({
    resolver: zodResolver(activitySchema),
    defaultValues: { title: '', description: '', extra: '' },
  })

  const selectedConfig = TYPE_OPTIONS.find((t) => t.value === selectedType)!

  async function onSubmit(data: ActivityFormInput) {
    setIsLoading(true)
    const extraInfo = data.extra ? ` (${selectedConfig.extraLabel}: ${data.extra})` : ''
    const description = (data.description ?? '') + extraInfo || undefined

    const { createActivity } = await import('@/server/activities')
    const result = await createActivity(workspaceId, leadId, {
      type: selectedType,
      title: data.title,
      description,
    })

    setIsLoading(false)
    if (result.error) { toast.error(result.error); return }

    if (result.activity) onAdd(result.activity)
    toast.success('Atividade registrada!')
    form.reset()
    setSelectedType('call')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar atividade</DialogTitle>
        </DialogHeader>

        {/* Seletor de tipo */}
        <div className="grid grid-cols-4 gap-2">
          {TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isActive = selectedType === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedType(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition-colors',
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-border/80 hover:bg-muted/50',
                )}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : opt.iconClass)} />
                {opt.label}
              </button>
            )
          })}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva brevemente a atividade" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição <span className="text-muted-foreground">(opcional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Detalhes adicionais…" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedConfig.extraLabel && (
              <FormField
                control={form.control}
                name="extra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedConfig.extraLabel}{' '}
                      <span className="text-muted-foreground">(opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={selectedConfig.extraPlaceholder}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? 'Salvando…' : 'Registrar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
