import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/features/auth/login-form'
import { getServerClient } from '@/server/server'

export const metadata = {
  title: 'Entrar — PipeFlow CRM',
}

interface LoginPageProps {
  searchParams: { next?: string }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await getServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Se há um destino pendente (ex: aceitar convite), redirecionar para lá
    if (searchParams.next) redirect(searchParams.next)

    const { data } = await supabase
      .from('workspace_members')
      .select('workspaces(slug)')
      .limit(1)
      .single()

    const ws = data?.workspaces as { slug: string } | null
    redirect(ws?.slug ? `/${ws.slug}/dashboard` : '/onboarding')
  }

  return <LoginForm next={searchParams.next} />
}
