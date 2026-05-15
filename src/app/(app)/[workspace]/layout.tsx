import { notFound } from 'next/navigation'
import { AppSidebar } from '@/components/features/app-sidebar'
import { AppHeader } from '@/components/features/app-header'
import { MOCK_WORKSPACES } from '@/lib/mocks/workspaces'
import { MOCK_USER } from '@/lib/mocks/user'

interface AppLayoutProps {
  children: React.ReactNode
  params: { workspace: string }
}

export default function AppLayout({ children, params }: AppLayoutProps) {
  const workspace = MOCK_WORKSPACES.find((w) => w.slug === params.workspace)

  if (!workspace) notFound()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — visível só no desktop */}
      <aside className="hidden md:flex w-60 shrink-0">
        <AppSidebar workspace={workspace} />
      </aside>

      {/* Área principal */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppHeader workspace={workspace} user={MOCK_USER} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
