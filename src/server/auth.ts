'use server'

import { redirect } from 'next/navigation'
import { getServerClient } from '@/server/server'

function mapAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (message.includes('Email not confirmed')) return 'Confirme seu e-mail antes de entrar.'
  if (message.includes('User already registered')) return 'Já existe uma conta com este e-mail.'
  if (message.includes('Password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.'
  if (message.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos.'
  return 'Algo deu errado. Tente novamente.'
}

export async function signIn(
  email: string,
  password: string
): Promise<{ error: string } | undefined> {
  const supabase = await getServerClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: mapAuthError(error.message) }

  const { data } = await supabase
    .from('workspace_members')
    .select('workspaces(slug)')
    .limit(1)
    .single()

  const ws = data?.workspaces as { slug: string } | null
  redirect(ws?.slug ? `/${ws.slug}/dashboard` : '/onboarding')
}

export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<{ error: string; needsConfirmation?: never } | { needsConfirmation: true; error?: never } | undefined> {
  const supabase = await getServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })

  if (error) return { error: mapAuthError(error.message) }

  // Session is null when email confirmation is required
  if (!data.session) {
    return { needsConfirmation: true }
  }

  redirect('/onboarding')
}

export async function signOut(): Promise<void> {
  const supabase = await getServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function resetPassword(
  email: string
): Promise<{ error: string } | undefined> {
  const supabase = await getServerClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  })

  if (error) return { error: mapAuthError(error.message) }
}

export async function updatePassword(
  password: string
): Promise<{ error: string } | undefined> {
  const supabase = await getServerClient()

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: mapAuthError(error.message) }

  redirect('/login')
}
