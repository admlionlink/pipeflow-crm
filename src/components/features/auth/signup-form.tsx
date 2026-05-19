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
import { PasswordStrength } from '@/components/features/auth/password-strength'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'
import { signUp } from '@/server/auth'

interface SignupFormProps {
  next?: string
}

export function SignupForm({ next }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [confirmedEmail, setConfirmedEmail] = useState('')

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', terms: false },
  })

  const password = form.watch('password')

  async function onSubmit(data: SignupInput) {
    setIsLoading(true)
    const result = await signUp(data.email, data.password, data.name, next)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    if (result?.needsConfirmation) {
      setConfirmedEmail(data.email)
      setNeedsConfirmation(true)
      return
    }
    // On success with session, signUp() redirects to /onboarding
  }

  if (needsConfirmation) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Verifique seu e-mail</h1>
            <p className="text-sm text-muted-foreground">
              Enviamos um link de confirmação para{' '}
              <span className="font-medium text-foreground">{confirmedEmail}</span>
            </p>
          </div>
          <p className="max-w-xs text-xs text-muted-foreground">
            Clique no link do e-mail para ativar sua conta e acessar o PipeFlow.
          </p>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/login">Ir para o login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Criar conta grátis</h1>
        <p className="text-sm text-muted-foreground">
          Já tem conta?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>

      <Form {...form}>
        <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu nome"
                    autoComplete="name"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <PasswordStrength password={password} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-0.5 h-4 w-4 rounded border-input accent-primary cursor-pointer"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    Concordo com os{' '}
                    <Link href="#" className="text-primary hover:underline">
                      Termos de Uso
                    </Link>{' '}
                    e a{' '}
                    <Link href="#" className="text-primary hover:underline">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'Criando conta…' : 'Criar conta grátis'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
