import { Kanban } from 'lucide-react'

export default function PipelinePage() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Kanban className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
      </div>
      <p className="text-muted-foreground">
        Board Kanban com drag-and-drop de negócios — disponível no M07.
      </p>
    </div>
  )
}
