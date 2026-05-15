'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { onboardingSchema, type OnboardingInput } from '@/lib/validations/auth'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function OnboardingForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { workspaceName: '' },
  })

  const workspaceName = form.watch('workspaceName')
  const slug = toSlug(workspaceName)

  async function onSubmit(data: OnboardingInput) {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast.success(`Workspace "${data.workspaceName}" criado com sucesso!`)
    router.push(`/${toSlug(data.workspaceName)}/dashboard`)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="size-5 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">P</span>
            </div>
            <span className="font-semibold text-base tracking-tight">PipeFlow</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Crie seu workspace</h1>
        <p className="text-sm text-muted-foreground">
          O workspace é onde sua equipe vai gerenciar leads e negócios. Você pode criar outros
          depois.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="workspaceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do workspace</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Agência Criativa, Freelance Dev…"
                    autoFocus
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                {slug && (
                  <FormDescription>
                    URL:{' '}
                    <span className="font-mono text-foreground/80">
                      pipeflow.com.br/{slug}
                    </span>
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'Criando workspace…' : 'Criar workspace e entrar'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
