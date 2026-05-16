'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkspaceTab } from '@/components/features/settings/workspace-tab'
import { MembersTab } from '@/components/features/settings/members-tab'
import { PlanTab } from '@/components/features/settings/plan-tab'
import { ProfileTab } from '@/components/features/settings/profile-tab'
import { MOCK_WORKSPACES } from '@/lib/mocks/workspaces'

// Workspace ativo mockado (seria derivado do parâmetro de rota + auth)
const ACTIVE_WORKSPACE = MOCK_WORKSPACES[0]

export default function SettingsPage() {
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
            <WorkspaceTab workspace={ACTIVE_WORKSPACE} />
          </TabsContent>

          <TabsContent value="membros">
            <MembersTab plan={ACTIVE_WORKSPACE.plan} />
          </TabsContent>

          <TabsContent value="plano">
            <PlanTab plan={ACTIVE_WORKSPACE.plan} />
          </TabsContent>

          <TabsContent value="perfil">
            <ProfileTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
