import { redirect } from 'next/navigation'
import { SignupForm } from '@/components/features/auth/signup-form'
import { getServerClient } from '@/server/server'

export const metadata = {
  title: 'Criar conta — PipeFlow CRM',
}

interface SignupPageProps {
  searchParams: { next?: string }
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const supabase = await getServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    if (searchParams.next) redirect(searchParams.next)
    redirect('/onboarding')
  }

  return <SignupForm next={searchParams.next} />
}
