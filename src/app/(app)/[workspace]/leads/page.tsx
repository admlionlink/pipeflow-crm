import { getServerClient } from '@/server/server'
import { listLeads } from '@/server/leads'
import { LeadsView } from '@/components/features/leads/leads-view'
import type { LeadStatus } from '@/types/lead'

interface LeadsPageProps {
  params: { workspace: string }
  searchParams: { search?: string; status?: string; page?: string }
}

export default async function LeadsPage({ params, searchParams }: LeadsPageProps) {
  const supabase = await getServerClient()

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('slug', params.workspace)
    .single()

  if (!workspace) return null

  const search = searchParams.search ?? ''
  const statusFilter = searchParams.status
    ? (searchParams.status.split(',') as LeadStatus[])
    : []
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10))

  const { leads, total } = await listLeads(workspace.id, { search, status: statusFilter, page })

  return (
    <LeadsView
      workspaceSlug={params.workspace}
      workspaceId={workspace.id}
      initialLeads={leads}
      total={total}
      page={page}
      search={search}
      statusFilter={statusFilter}
    />
  )
}
