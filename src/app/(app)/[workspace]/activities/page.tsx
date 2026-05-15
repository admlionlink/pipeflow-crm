import { Activity } from 'lucide-react'

export default function ActivitiesPage() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Atividades</h1>
      </div>
      <p className="text-muted-foreground">
        Timeline cronológica de ligações, e-mails, reuniões e notas — disponível no M08.
      </p>
    </div>
  )
}
