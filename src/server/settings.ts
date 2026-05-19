'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getServerClient } from '@/server/server'

// ─── Workspace ────────────────────────────────────────────────

export async function updateWorkspace(
  workspaceId: string,
  currentSlug: string,
  data: { name: string; slug: string },
): Promise<{ error?: string }> {
  const supabase = await getServerClient()

  const { error } = await supabase
    .from('workspaces')
    .update({ name: data.name, slug: data.slug })
    .eq('id', workspaceId)

  if (error) {
    if (error.code === '23505') return { error: 'Este slug já está em uso.' }
    return { error: 'Erro ao atualizar workspace.' }
  }

  // Se o slug mudou, revalidar e redirecionar para a nova URL
  if (data.slug !== currentSlug) {
    revalidatePath('/[workspace]/settings', 'page')
    redirect(`/${data.slug}/settings`)
  }

  revalidatePath('/[workspace]/settings', 'page')
  return {}
}

export async function deleteWorkspace(
  workspaceId: string,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()

  const { error } = await supabase
    .from('workspaces')
    .delete()
    .eq('id', workspaceId)

  if (error) return { error: 'Erro ao excluir workspace.' }

  redirect('/onboarding')
}

// ─── Perfil ───────────────────────────────────────────────────

export async function updateProfile(
  data: { fullName: string },
): Promise<{ error?: string }> {
  const supabase = await getServerClient()

  // Atualizar auth.users.user_metadata (usado pelo trigger para sincronizar profiles)
  const { error: authErr } = await supabase.auth.updateUser({
    data: { full_name: data.fullName },
  })
  if (authErr) return { error: 'Erro ao atualizar perfil.' }

  // Atualizar profiles diretamente (caso o trigger ainda não tenha disparado)
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase
      .from('profiles')
      .update({ full_name: data.fullName })
      .eq('id', user.id)
  }

  revalidatePath('/[workspace]/settings', 'page')
  return {}
}

export async function updatePassword(
  newPassword: string,
): Promise<{ error?: string }> {
  const supabase = await getServerClient()

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) {
    if (error.message.includes('Password')) return { error: 'A senha deve ter pelo menos 6 caracteres.' }
    return { error: 'Erro ao alterar senha. Tente novamente.' }
  }

  return {}
}
