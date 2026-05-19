import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, Building2, LogIn, UserPlus } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { getServerClient } from '@/server/server'
import { acceptInvite } from '@/server/members'
import type { Database } from '@/types/database'

interface InvitePageProps {
  params: { token: string }
}

// Lê info do convite usando service role (RLS de wi_select exige admin).
// Seguro: Server Component — a service key nunca vai ao cliente.
async function getInviteInfo(token: string) {
  const adminClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data } = await adminClient
    .from('workspace_invites')
    .select('email, role, expires_at, workspaces(name, slug)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  return data
}

export default async function InvitePage({ params }: InvitePageProps) {
  const supabase = await getServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar info do convite (sem autenticação — usa service role)
  const invite = await getInviteInfo(params.token)

  if (!invite) {
    return <InviteError message="Convite inválido ou expirado." />
  }

  const workspaceName = (invite.workspaces as { name: string; slug: string } | null)?.name ?? 'o workspace'
  const roleLabel = invite.role === 'admin' ? 'Administrador' : 'Membro'
  const nextUrl = `/invite/${params.token}`

  // Não autenticado: mostrar landing page de convite com opções de login/signup
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-[6px] bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-[16px]">P</span>
            </div>
            <span className="font-semibold text-lg">PipeFlow CRM</span>
          </div>

          {/* Card do convite */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4 text-center shadow-sm">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight">Você foi convidado!</h1>
              <p className="text-sm text-muted-foreground">
                Participe do workspace{' '}
                <strong className="text-foreground">{workspaceName}</strong>{' '}
                como <strong className="text-foreground">{roleLabel}</strong>.
              </p>
            </div>

            <p className="text-xs text-muted-foreground border-t border-border pt-4">
              Convite enviado para <strong>{invite.email}</strong>
            </p>
          </div>

          {/* Ações */}
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href={`/login?next=${encodeURIComponent(nextUrl)}`}>
                <LogIn className="h-4 w-4" />
                Entrar com conta existente
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/signup?next=${encodeURIComponent(nextUrl)}`}>
                <UserPlus className="h-4 w-4" />
                Criar conta nova
              </Link>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Use o e-mail <strong>{invite.email}</strong> ao criar sua conta.
          </p>
        </div>
      </div>
    )
  }

  // Autenticado: aceitar convite automaticamente via RPC
  const result = await acceptInvite(params.token)

  if (result.error) {
    return <InviteError message={result.error} />
  }

  // Buscar slug do workspace para redirecionar
  const { data: ws } = await supabase
    .from('workspaces')
    .select('slug')
    .eq('id', result.workspaceId!)
    .single()

  if (ws?.slug) redirect(`/${ws.slug}/dashboard`)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Convite aceito!</h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo ao workspace <strong>{workspaceName}</strong>.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/onboarding">Continuar</Link>
        </Button>
      </div>
    </div>
  )
}

function InviteError({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Convite inválido</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <Button variant="outline" asChild className="w-full">
          <Link href="/login">
            <LogIn className="h-4 w-4" />
            Ir para o login
          </Link>
        </Button>
      </div>
    </div>
  )
}
