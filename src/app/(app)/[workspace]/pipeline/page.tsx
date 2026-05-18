import { getServerClient } from '@/server/server'
import { listDeals } from '@/server/deals'
import { KanbanBoard } from '@/components/features/pipeline/kanban-board'

interface PipelinePageProps {
  params: { workspace: string }
}

export default async function PipelinePage({ params }: PipelinePageProps) {
  const supabase = await getServerClient()

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('slug', params.workspace)
    .single()

  if (!workspace) return null

  const deals = await listDeals(workspace.id)

  return <KanbanBoard workspaceId={workspace.id} initialDeals={deals} />
}
