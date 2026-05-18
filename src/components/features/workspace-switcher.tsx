'use client'

import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Workspace } from '@/types/workspace'

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

interface WorkspaceSwitcherProps {
  currentWorkspace: Workspace
  workspaces: Workspace[]
}

export function WorkspaceSwitcher({ currentWorkspace, workspaces }: WorkspaceSwitcherProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2 h-auto py-2 hover:bg-sidebar-accent text-left"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
              {getInitials(currentWorkspace.name)}
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-medium truncate max-w-[130px] text-sidebar-foreground">
                {currentWorkspace.name}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] h-4 px-1 border-0 font-medium',
                  currentWorkspace.plan === 'pro'
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground bg-muted',
                )}
              >
                {currentWorkspace.plan === 'pro' ? 'Pro' : 'Grátis'}
              </Badge>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start" side="bottom" sideOffset={4}>
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Meus workspaces
        </DropdownMenuLabel>

        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => router.push(`/${ws.slug}/dashboard`)}
            className="gap-2 cursor-pointer"
          >
            <div className="h-6 w-6 rounded-md bg-primary/80 flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
              {getInitials(ws.name)}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-sm">{ws.name}</span>
              <span className="text-[10px] text-muted-foreground">
                {ws.plan === 'pro' ? 'Pro' : 'Grátis'}
              </span>
            </div>
            {ws.id === currentWorkspace.id && <Check className="h-4 w-4 text-primary shrink-0" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-2 cursor-pointer text-muted-foreground"
          onClick={() => router.push('/onboarding')}
        >
          <Plus className="h-4 w-4" />
          Criar workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
