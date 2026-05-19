import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkspaceTab } from '@/components/features/settings/workspace-tab'
import { MembersTab } from '@/components/features/settings/members-tab'
import { PlanTab } from '@/components/features/settings/plan-tab'
import { ProfileTab } from '@/components/features/settings/profile-tab'
import { getServerClient } from '@/server/server'
import { listMembers } from '@/server/members'

interface SettingsPageProps {
  params: { workspace: string }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const supabase = await getServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 1. Buscar workspace (necessário para o id usado nas demais queries)
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, name, slug, plan')
    .eq('slug', params.workspace)
    .single()

  if (!workspace) notFound()

  // 2. Demais dados em paralelo com o workspace.id já disponível (§6.2 Promise.all)
  const [members, profileResult, membershipResult] = await Promise.all([
    listMembers(workspace.id),
    supabase.from('profiles').select('full_name, email').eq('id', user.id).single(),
    supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspace.id)
      .eq('user_id', user.id)
      .single(),
  ])

  const profile = profileResult.data
  const isAdmin = membershipResult.data?.role === 'admin'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie o workspace, membros, plano e perfil.
        </p>
      </div>

      <Tabs defaultValue="workspace">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="membros">Membros</TabsTrigger>
          <TabsTrigger value="plano">Plano</TabsTrigger>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="workspace">
            <WorkspaceTab workspace={workspace} isAdmin={isAdmin} />
          </TabsContent>

          <TabsContent value="membros">
            <MembersTab
              workspaceId={workspace.id}
              workspaceName={workspace.name}
              plan={workspace.plan}
              initialMembers={members}
              currentUserId={user.id}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="plano">
            <PlanTab plan={workspace.plan} memberCount={members.length} />
          </TabsContent>

          <TabsContent value="perfil">
            <ProfileTab
              initialName={profile?.full_name ?? ''}
              initialEmail={profile?.email ?? user.email ?? ''}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
