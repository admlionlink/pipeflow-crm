import { Users } from 'lucide-react'

export default function LeadsPage() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
      </div>
      <p className="text-muted-foreground">
        Listagem, busca, filtros e CRUD de leads — disponível no M06.
      </p>
    </div>
  )
}
