import { redirect } from 'next/navigation'
import { OnboardingForm } from '@/components/features/auth/onboarding-form'
import { getServerClient } from '@/server/server'

export const metadata = {
  title: 'Criar workspace — PipeFlow CRM',
}

export default async function OnboardingPage() {
  const supabase = await getServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // If user already has a workspace, send them there
  const { data } = await supabase
    .from('workspace_members')
    .select('workspaces(slug)')
    .limit(1)
    .single()

  const ws = data?.workspaces as { slug: string } | null
  if (ws?.slug) redirect(`/${ws.slug}/dashboard`)

  return <OnboardingForm />
}
