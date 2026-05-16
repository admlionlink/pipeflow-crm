'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, BarChart3, Kanban, Settings, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WorkspaceSwitcher } from '@/components/features/workspace-switcher'
import { type Workspace } from '@/types/workspace'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: BarChart3, href: 'dashboard' },
  { label: 'Leads', icon: Users, href: 'leads' },
  { label: 'Pipeline', icon: Kanban, href: 'pipeline' },
  { label: 'Atividades', icon: Activity, href: 'activities' },
  { label: 'Configurações', icon: Settings, href: 'settings' },
]

interface AppSidebarProps {
  workspace: Workspace
}

export function AppSidebar({ workspace }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border shrink-0">
        <Link
          href={`/${workspace.slug}/dashboard`}
          className="flex items-center gap-2.5 font-bold text-sidebar-foreground"
        >
          <div className="w-7 h-7 rounded-[6px] bg-pf-accent flex items-center justify-center shrink-0">
            <span className="font-display font-extrabold text-pf-bg text-[15px] leading-none">P</span>
          </div>
          <span className="font-display font-semibold">
            Pipe<span className="text-pf-accent">Flow</span>
          </span>
        </Link>
      </div>

      {/* Workspace Switcher */}
      <div className="px-2 py-3 border-b border-sidebar-border shrink-0">
        <WorkspaceSwitcher currentWorkspace={workspace} />
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const href = `/${workspace.slug}/${item.href}`
          const isActive = pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-pf-accent/[0.08] text-pf-accent'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon
                className={cn('h-4 w-4 shrink-0', isActive ? 'text-pf-accent' : 'text-current')}
              />
              {item.label}

              {/* Indicador de rota ativa */}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-pf-accent" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-sidebar-border shrink-0">
        <p className="text-[11px] font-mono text-muted-foreground">PipeFlow CRM v0.1.0</p>
      </div>
    </div>
  )
}
