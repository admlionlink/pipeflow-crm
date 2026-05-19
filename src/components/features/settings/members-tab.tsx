'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UserPlus, Trash2, AlertCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InviteMemberDialog } from '@/components/features/settings/invite-member-dialog'
import { removeMember, changeRole } from '@/server/members'
import { type Plan, type MemberRole } from '@/types/workspace'
import { type WorkspaceMember } from '@/server/members'

const MAX_FREE_MEMBERS = 2

interface MembersTabProps {
  workspaceId: string
  workspaceName: string
  plan: Plan
  initialMembers: WorkspaceMember[]
  currentUserId: string
  isAdmin: boolean
}

export function MembersTab({
  workspaceId, workspaceName, plan, initialMembers, currentUserId, isAdmin,
}: MembersTabProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [members, setMembers] = useState<WorkspaceMember[]>(initialMembers)
  const [inviteOpen, setInviteOpen] = useState(false)

  const atLimit = plan === 'free' && members.length >= MAX_FREE_MEMBERS

  async function handleRoleChange(userId: string, role: MemberRole) {
    setMembers((prev) => prev.map((m) => m.userId === userId ? { ...m, role } : m))
    const result = await changeRole(workspaceId, userId, role)
    if (result.error) {
      toast.error(result.error)
      startTransition(() => router.refresh())
    } else {
      toast.success('Papel atualizado')
    }
  }

  async function handleRemove(userId: string) {
    // Optimistic update
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
    const result = await removeMember(workspaceId, userId)
    if (result.error) {
      toast.error(result.error)
      startTransition(() => router.refresh())
    } else {
      toast.success('Membro removido')
    }
  }

  function handleInviteSuccess() {
    setInviteOpen(false)
    startTransition(() => router.refresh())
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
        {isAdmin && (
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
        )}
      </div>

      {atLimit && plan === 'free' && (
        <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-amber-500">Limite do plano Free atingido</p>
            <p className="text-xs text-muted-foreground">
              Faça upgrade para o plano Pro para adicionar membros ilimitados.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border divide-y divide-border">
        {members.map((member) => {
          const initials = (member.name || member.email)
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
          const isCurrentUser = member.userId === currentUserId

          return (
            <div key={member.userId} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name || member.email}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && !isCurrentUser ? (
                  <Select
                    value={member.role}
                    onValueChange={(value: string) => handleRoleChange(member.userId, value as MemberRole)}
                  >
                    <SelectTrigger className="h-7 w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member" className="text-xs">Membro</SelectItem>
                      <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {member.role === 'admin' ? 'Admin' : 'Membro'}
                    {isCurrentUser && ' (você)'}
                  </span>
                )}
                {isAdmin && !isCurrentUser && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(member.userId)}
                    title="Remover membro"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        onSuccess={handleInviteSuccess}
      />
    </div>
  )
}
