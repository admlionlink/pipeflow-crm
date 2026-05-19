'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
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
  FormLabel,  // usado em FormField de e-mail
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { inviteMember } from '@/server/members'
import { type MemberRole } from '@/types/workspace'

const inviteSchema = z.object({
  email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
})

type InviteFormInput = z.infer<typeof inviteSchema>

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  workspaceName: string
  onSuccess: () => void
}

export function InviteMemberDialog({
  open, onOpenChange, workspaceId, workspaceName, onSuccess,
}: InviteMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<MemberRole>('member')

  const form = useForm<InviteFormInput>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: InviteFormInput) {
    setIsLoading(true)
    const result = await inviteMember(workspaceId, workspaceName, data.email, selectedRole)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(`Convite enviado para ${data.email}`)
    form.reset()
    setSelectedRole('member')
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Convidar membro</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="colega@empresa.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Papel</label>
              <div className="grid grid-cols-2 gap-2">
                {(['member', 'admin'] as MemberRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-left transition-colors',
                      selectedRole === role
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted/50',
                    )}
                  >
                    <p className="text-sm font-medium">
                      {role === 'admin' ? 'Admin' : 'Membro'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {role === 'admin' ? 'Acesso total' : 'Leads e negócios'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? 'Enviando…' : 'Enviar convite'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
