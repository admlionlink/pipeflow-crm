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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordStrength } from '@/components/features/auth/password-strength'

const profileInfoSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(80),
  email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
})

const profilePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual obrigatória'),
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

const MOCK_USER = { name: 'Andrea Rouca', email: 'andrea@agenciacriativa.com' }

export function ProfileTab() {
  const [isSavingInfo, setIsSavingInfo] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [newPasswordValue, setNewPasswordValue] = useState('')

  const infoForm = useForm<ProfileInfoInput>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: { name: MOCK_USER.name, email: MOCK_USER.email },
  })

  const passwordForm = useForm<ProfilePasswordInput>({
    resolver: zodResolver(profilePasswordSchema),
    defaultValues: { currentPassword: '', password: '', confirmPassword: '' },
  })

  const initials = MOCK_USER.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')

  async function onSaveInfo() {
    setIsSavingInfo(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSavingInfo(false)
    toast.success('Perfil atualizado!')
  }

  async function onSavePassword() {
    setIsSavingPassword(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSavingPassword(false)
    passwordForm.reset()
    setNewPasswordValue('')
    toast.success('Senha alterada com sucesso!')
  }

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{MOCK_USER.name}</p>
          <p className="text-sm text-muted-foreground">{MOCK_USER.email}</p>
        </div>
      </div>

      {/* Informações */}
      <div>
        <h3 className="mb-4 text-sm font-semibold">Informações pessoais</h3>
        <Form {...infoForm}>
          <form onSubmit={infoForm.handleSubmit(onSaveInfo)} className="space-y-4 max-w-md">
            <FormField
              control={infoForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input disabled={isSavingInfo} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={infoForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" disabled={isSavingInfo} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="sm" disabled={isSavingInfo}>
              {isSavingInfo && <Loader2 className="animate-spin" />}
              {isSavingInfo ? 'Salvando…' : 'Salvar informações'}
            </Button>
          </form>
        </Form>
      </div>

      {/* Senha */}
      <div>
        <h3 className="mb-4 text-sm font-semibold">Alterar senha</h3>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onSavePassword)} className="space-y-4 max-w-md">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha atual</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" autoComplete="current-password" disabled={isSavingPassword} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input type="password" placeholder="••••••••" autoComplete="new-password" disabled={isSavingPassword} {...field} />
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
