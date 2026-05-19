'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { PasswordStrength } from '@/components/features/auth/password-strength'
import { updateProfile, updatePassword } from '@/server/settings'

const profileInfoSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(80),
})

const profilePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Mínimo de 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve conter pelo menos um número'),
    confirmPassword: z.string().min(1, 'Confirmação obrigatória'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
      })
    }
  })

type ProfileInfoInput = z.infer<typeof profileInfoSchema>
type ProfilePasswordInput = z.infer<typeof profilePasswordSchema>

interface ProfileTabProps {
  initialName: string
  initialEmail: string
}

export function ProfileTab({ initialName, initialEmail }: ProfileTabProps) {
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [newPasswordValue, setNewPasswordValue] = useState('')

  const initials = (initialName || initialEmail)
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const infoForm = useForm<ProfileInfoInput>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: { name: initialName },
  })

  const passwordForm = useForm<ProfilePasswordInput>({
    resolver: zodResolver(profilePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSaveInfo(data: ProfileInfoInput) {
    const result = await updateProfile({ fullName: data.name })
    if (result.error) toast.error(result.error)
    else toast.success('Perfil atualizado!')
  }

  async function onSavePassword(data: ProfilePasswordInput) {
    setIsSavingPassword(true)
    const result = await updatePassword(data.password)
    setIsSavingPassword(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      passwordForm.reset()
      setNewPasswordValue('')
      toast.success('Senha alterada com sucesso!')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{initialName || '—'}</p>
          <p className="text-sm text-muted-foreground">{initialEmail}</p>
        </div>
      </div>

      {/* Informações */}
      <div>
        <h3 className="mb-4 text-sm font-semibold">Informações pessoais</h3>
        <Form {...infoForm}>
          <form method="post" onSubmit={infoForm.handleSubmit(onSaveInfo)} className="space-y-4 max-w-md">
            <FormField
              control={infoForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input disabled={infoForm.formState.isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">E-mail</label>
              <Input value={initialEmail} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
            </div>
            <Button type="submit" size="sm" disabled={infoForm.formState.isSubmitting}>
              {infoForm.formState.isSubmitting && <Loader2 className="animate-spin" />}
              {infoForm.formState.isSubmitting ? 'Salvando…' : 'Salvar informações'}
            </Button>
          </form>
        </Form>
      </div>

      {/* Senha */}
      <div>
        <h3 className="mb-4 text-sm font-semibold">Alterar senha</h3>
        <Form {...passwordForm}>
          <form method="post" onSubmit={passwordForm.handleSubmit(onSavePassword)} className="space-y-4 max-w-md">
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={isSavingPassword}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setNewPasswordValue(e.target.value)
                      }}
                    />
                  </FormControl>
                  <PasswordStrength password={newPasswordValue} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar nova senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={isSavingPassword}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="sm" disabled={isSavingPassword}>
              {isSavingPassword && <Loader2 className="animate-spin" />}
              {isSavingPassword ? 'Salvando…' : 'Alterar senha'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
