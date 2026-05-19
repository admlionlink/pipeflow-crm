'use server'

import { randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { getServerClient } from '@/server/server'
import type { MemberRole } from '@/types/workspace'

export interface WorkspaceMember {
  userId: string
  role: MemberRole
  name: string
  email: string
  joinedAt: string
}

const MAX_FREE_MEMBERS = 2

// §6.2 Anti-N+1: 2 queries (members + profiles) em Promise.all, não N loops
export async function listMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const supabase = await getServerClient()

  const { data: members, error } = await supabase
    .from('workspace_members')
    .select('user_id, role, joined_at')
    .eq('workspace_id', workspaceId)
    .order('joined_at', { ascending: true })

  if (error || !members || members.length === 0) return []

  const userIds = members.map((m) => m.user_id)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .in('id', userIds)

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, { name: p.full_name || p.email, email: p.email }]),
  )

  return members.map((m) => {
    const p = profileMap.get(m.user_id)
    return {
      userId:   m.user_id,
      role:     m.role as MemberRole,
      name:     p?.name || '—',
      email:    p?.email || '',
      joinedAt: m.joined_at,
    }
  })
}

export async function inviteMember(
  workspaceId: string,
  workspaceName: string,
  email: string,
  role: MemberRole,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()

  // Verificar autenticação
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado.' }

  // Buscar workspace para verificar plano
  const { data: ws } = await supabase
    .from('workspaces')
    .select('plan')
    .eq('id', workspaceId)
    .single()

  if (!ws) return { error: 'Workspace não encontrado.' }

  // §PLAN.md: enforce limite Free no servidor
  if (ws.plan === 'free') {
    const { count } = await supabase
      .from('workspace_members')
      .select('user_id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)

    if ((count ?? 0) >= MAX_FREE_MEMBERS) {
      return { error: `Limite de ${MAX_FREE_MEMBERS} membros do plano Free atingido. Faça upgrade para Pro.` }
    }
  }

  // Verificar se o e-mail já é membro
  const { data: existingMember } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (existingMember) {
    const { data: alreadyMember } = await supabase
      .from('workspace_members')
      .select('user_id')
      .eq('workspace_id', workspaceId)
      .eq('user_id', existingMember.id)
      .maybeSingle()

    if (alreadyMember) return { error: 'Este e-mail já é membro do workspace.' }
  }

  // Verificar se já existe convite pendente para este e-mail
  const { data: pending } = await supabase
    .from('workspace_invites')
    .select('id')
    .eq('workspace_id', workspaceId)
    .eq('email', email.toLowerCase())
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (pending) return { error: 'Já existe um convite pendente para este e-mail.' }

  // Gerar token seguro (§3.1 Least Privilege: token aleatório, não adivinhável)
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias

  const { error: insertErr } = await supabase
    .from('workspace_invites')
    .insert({
      workspace_id: workspaceId,
      email:        email.toLowerCase(),
      role,
      token,
      expires_at:   expiresAt,
    })

  if (insertErr) return { error: 'Erro ao criar convite. Tente novamente.' }

  // Enviar e-mail via Resend — convite já está criado no banco mesmo se o envio falhar
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`
  const emailError = await sendInviteEmail({ email, workspaceName, inviteUrl, role })
  if (emailError) {
    console.error('[inviteMember] Falha ao enviar e-mail:', emailError)
    // Não retorna erro ao usuário — o convite foi criado e o link pode ser compartilhado manualmente
  }

  revalidatePath('/[workspace]/settings', 'page')
  return {}
}

export async function changeRole(
  workspaceId: string,
  userId: string,
  role: MemberRole,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()

  const { error } = await supabase
    .from('workspace_members')
    .update({ role })
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)

  if (error) return { error: 'Erro ao alterar papel do membro.' }

  revalidatePath('/[workspace]/settings', 'page')
  return {}
}

export async function removeMember(
  workspaceId: string,
  userId: string,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()

  // Impedir auto-remoção
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.id === userId) return { error: 'Você não pode remover a si mesmo.' }

  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)

  if (error) return { error: 'Erro ao remover membro.' }

  revalidatePath('/[workspace]/settings', 'page')
  return {}
}

// Aceitar convite via RPC SECURITY DEFINER (migration 0006)
// Necessário pois o convidado não é admin ainda e wm_insert exige is_workspace_admin
export async function acceptInvite(
  token: string,
): Promise<{ error?: string; workspaceId?: string }> {
  const supabase = await getServerClient()

  const { data, error } = await supabase.rpc('accept_invite', { p_token: token })

  if (error) {
    if (error.message.includes('inválido') || error.message.includes('expirado'))
      return { error: 'Convite inválido ou expirado.' }
    if (error.message.includes('outro e-mail'))
      return { error: 'Este convite foi enviado para outro e-mail.' }
    if (error.message.includes('limite'))
      return { error: 'O workspace atingiu o limite de membros do plano Free.' }
    return { error: 'Erro ao aceitar convite. Tente novamente.' }
  }

  const result = data as { workspace_id: string; role?: string; already_member?: boolean }
  return { workspaceId: result.workspace_id }
}

// ─── Envio de e-mail ──────────────────────────────────────────
// Retorna mensagem de erro ou undefined em caso de sucesso
async function sendInviteEmail({
  email, workspaceName, inviteUrl, role,
}: { email: string; workspaceName: string; inviteUrl: string; role: MemberRole }): Promise<string | undefined> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log(`\n[DEV] Convite para ${email} — ${workspaceName}\nLink: ${inviteUrl}\n`)
    return undefined
  }

  const resend = new Resend(apiKey)
  const roleLabel = role === 'admin' ? 'Administrador' : 'Membro'
  const fromAddress = process.env.RESEND_FROM ?? 'PipeFlow CRM <onboarding@resend.dev>'
  // Em dev sem domínio verificado, Resend só entrega para o e-mail do dono da conta.
  // RESEND_TEST_TO redireciona todos os convites para um único destino de teste.
  const toAddress = process.env.RESEND_TEST_TO ?? email

  try {
    const { error } = await resend.emails.send({
      from:    fromAddress,
      to:      toAddress,
      subject: `Você foi convidado para ${workspaceName} no PipeFlow`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
          <div style="margin-bottom: 24px;">
            <span style="background: #F59E0B; color: white; font-weight: 700; font-size: 18px; padding: 4px 10px; border-radius: 6px;">P</span>
            <span style="font-weight: 600; font-size: 16px; margin-left: 8px;">PipeFlow CRM</span>
          </div>
          <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px;">Você recebeu um convite!</h1>
          <p style="color: #6b7280; margin: 0 0 24px;">
            Você foi convidado para integrar o workspace <strong>${workspaceName}</strong>
            como <strong>${roleLabel}</strong>.
          </p>
          <a href="${inviteUrl}"
             style="display: inline-block; background: #F59E0B; color: white; font-weight: 600;
                    padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 15px;">
            Aceitar convite
          </a>
          <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0;">
            O link expira em 7 dias. Caso não tenha solicitado este convite, ignore este e-mail.
          </p>
        </div>
      `,
    })
    return error?.message
  } catch (e) {
    return e instanceof Error ? e.message : 'Erro desconhecido ao enviar e-mail'
  }
}
