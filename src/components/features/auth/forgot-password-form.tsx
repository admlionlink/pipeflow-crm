'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, Mail } from 'lucide-react'
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
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'
import { resetPassword } from '@/server/auth'

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: ForgotPasswordInput) {
    setIsLoading(true)
    const result = await resetPassword(data.email)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    setSentEmail(data.email)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Verifique seu e-mail</h1>
            <p className="text-sm text-muted-foreground">
              Enviamos as instruções de recuperação para{' '}
              <span className="font-medium text-foreground">{sentEmail}</span>
            </p>
          </div>
          <p className="max-w-xs text-xs text-muted-foreground">
            Não recebeu? Verifique a pasta de spam ou{' '}
            <button
              onClick={() => setSent(false)}
              className="text-primary hover:underline"
            >
              tente outro e-mail
            </button>
            .
          </p>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/login">Voltar ao login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Recuperar senha</h1>
        <p className="text-sm text-muted-foreground">
          Digite seu e-mail e enviaremos as instruções para redefinir sua senha.
        </p>
      </div>

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
                    placeholder="voce@empresa.com"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'Enviando…' : 'Enviar instruções'}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Lembrou a senha?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Voltar ao login
        </Link>
      </p>
    </div>
  )
}
