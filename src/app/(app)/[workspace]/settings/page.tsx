import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
      </div>
      <p className="text-muted-foreground">
        Workspace, membros, plano e perfil — disponível no M09.
      </p>
    </div>
  )
}
