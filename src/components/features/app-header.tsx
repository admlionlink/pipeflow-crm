'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, LogOut, Menu, Moon, Search, Settings, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { AppSidebar } from '@/components/features/app-sidebar'
import { type Workspace } from '@/types/workspace'
import { type User as UserType } from '@/types/user'
import { signOut } from '@/server/auth'

const SECTION_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  pipeline: 'Pipeline',
  activities: 'Atividades',
  settings: 'Configurações',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

interface AppHeaderProps {
  workspace: Workspace
  workspaces: Workspace[]
  user: UserType
}

export function AppHeader({ workspace, workspaces, user }: AppHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const segments = pathname.split('/').filter(Boolean)
  const currentSection = segments[1] ?? 'dashboard'
  const sectionLabel = SECTION_LABELS[currentSection] ?? currentSection

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border px-4 bg-background shrink-0">
      {/* Hamburger — mobile only */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <AppSidebar workspace={workspace} workspaces={workspaces} />
        </SheetContent>
      </Sheet>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm min-w-0">
        <span className="text-muted-foreground hidden sm:inline truncate max-w-[120px]">
          {workspace.name}
        </span>
        <span className="text-muted-foreground hidden sm:inline">/</span>
        <span className="font-medium text-foreground">{sectionLabel}</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto">
        <div className="relative hidden md:flex items-center mr-1">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar..."
            className="w-48 lg:w-60 pl-8 h-8 text-sm bg-muted/40 border-muted focus-visible:ring-1"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notificações</span>
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[11px] bg-primary text-primary-foreground font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal py-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              Meu perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              Configurações
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {resolvedTheme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
