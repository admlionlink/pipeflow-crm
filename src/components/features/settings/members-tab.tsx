'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { UserPlus, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InviteMemberDialog } from '@/components/features/settings/invite-member-dialog'
import { MOCK_MEMBERS, CURRENT_USER_ID, type WorkspaceMember } from '@/lib/mocks/members'
import { type Plan } from '@/types/workspace'

const MAX_FREE_MEMBERS = 2

interface MembersTabProps {
  plan: Plan
}

export function MembersTab({ plan }: MembersTabProps) {
  const [members, setMembers] = useState<WorkspaceMember[]>(MOCK_MEMBERS)
  const [inviteOpen, setInviteOpen] = useState(false)
  const atLimit = plan === 'free' && members.length >= MAX_FREE_MEMBERS

  function handleRemove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
    toast.success('Membro removido')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Membros</h3>
          <p className="text-xs text-muted-foreground">
            {members.length}/{plan === 'free' ? MAX_FREE_MEMBERS : '∞'} membros
            {plan === 'free' && atLimit && (
              <span className="ml-1.5 text-amber-500">— limite atingido</span>
            )}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setInviteOpen(true)}
          disabled={atLimit}
          title={atLimit ? 'Limite de membros do plano Free atingido' : undefined}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Convidar
        </Button>
      </div>

      {atLimit && plan === 'free' && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Você atingiu o limite de {MAX_FREE_MEMBERS} membros do plano Free.{' '}
            <a href="/signup" className="font-medium underline">
              Faça upgrade para Pro
            </a>{' '}
            para membros ilimitados.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-border divide-y divide-border">
        {members.map((member) => {
          const initials = member.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
          const isCurrentUser = member.userId === CURRENT_USER_ID

          return (
            <div key={member.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {member.name}
                    {isCurrentUser && (
                      <span className="ml-1.5 text-xs text-muted-foreground">(você)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.role === 'admin' ? 'default' : 'outline'} className="text-xs">
                  {member.role === 'admin' ? 'Admin' : 'Membro'}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemove(member.id)}
                  disabled={isCurrentUser}
                  title={isCurrentUser ? 'Você não pode remover a si mesmo' : 'Remover membro'}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}
