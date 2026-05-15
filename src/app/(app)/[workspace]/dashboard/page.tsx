import { BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <p className="text-muted-foreground">
        Métricas, funil de vendas e próximos prazos — disponível no M05.
      </p>
    </div>
  )
}
