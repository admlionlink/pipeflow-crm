import { notFound, redirect } from 'next/navigation'
import { AppSidebar } from '@/components/features/app-sidebar'
import { AppHeader } from '@/components/features/app-header'
import { getServerClient } from '@/server/server'
import { getUserWorkspaces } from '@/server/workspaces'
import type { User } from '@/types/user'

interface AppLayoutProps {
  children: React.ReactNode
  params: { workspace: string }
}

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const supabase = await getServerClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) redirect('/login')

  // Fetch workspace and all user workspaces in parallel (same client, no N+1)
  const [wsResult, allWorkspaces] = await Promise.all([
    supabase
      .from('workspaces')
      .select('id, name, slug, plan')
      .eq('slug', params.workspace)
      .single(),
    getUserWorkspaces(supabase),
  ])

  if (!wsResult.data) notFound()
  const workspace = wsResult.data

  // Fetch membership — needs workspace.id from the parallel query above
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspace.id)
    .single()

  if (!membership) notFound()

  const user: User = {
    id: authUser.id,
    name: (authUser.user_metadata?.full_name as string | undefined) ?? authUser.email ?? 'Usuário',
    email: authUser.email ?? '',
    role: membership.role,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden md:flex w-60 shrink-0">
        <AppSidebar workspace={workspace} workspaces={allWorkspaces} />
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppHeader workspace={workspace} workspaces={allWorkspaces} user={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
