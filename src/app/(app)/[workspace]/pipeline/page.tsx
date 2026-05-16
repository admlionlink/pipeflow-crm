import { KanbanBoard } from '@/components/features/pipeline/kanban-board'

interface PipelinePageProps {
  params: Promise<{ workspace: string }>
}

export default async function PipelinePage({ params }: PipelinePageProps) {
  const { workspace } = await params
  return <KanbanBoard workspaceId={workspace} />
}
