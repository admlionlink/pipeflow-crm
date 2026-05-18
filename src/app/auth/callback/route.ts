import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`)
  }

  // If next was explicitly provided (e.g. password reset), go there directly
  if (searchParams.has('next')) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  // Email confirmation: redirect to workspace or onboarding
  const { data } = await supabase
    .from('workspace_members')
    .select('workspaces(slug)')
    .limit(1)
    .single()

  const ws = data?.workspaces as { slug: string } | null
  return NextResponse.redirect(`${origin}${ws?.slug ? `/${ws.slug}/dashboard` : '/onboarding'}`)
}
