import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  User,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { LeadStatusBadge } from '@/components/features/leads/lead-status-badge'
import { ActivityTimeline } from '@/components/features/leads/activity-timeline'
import { LeadDetailActions } from '@/components/features/leads/lead-detail-actions'
import { MOCK_LEADS } from '@/lib/mocks/leads'
import { MOCK_ACTIVITIES } from '@/lib/mocks/activities'

interface LeadDetailPageProps {
  params: { workspace: string; id: string }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function InfoRow({
  icon: Icon,
  label,
  value,
  truncate,
}: {
  icon: React.ElementType
  label: string
  value: string
  truncate?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium ${truncate ? 'truncate' : ''}`}>{value}</p>
      </div>
    </div>
  )
}

export default function LeadDetailPage({ params }: LeadDetailPageProps) {
  const lead = MOCK_LEADS.find((l) => l.id === params.id)
  if (!lead) notFound()

  const activities = MOCK_ACTIVITIES.filter((a) => a.leadId === lead.id)
  const initials = lead.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')

  const createdDate = new Date(lead.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Breadcrumb + ações */}
      <div className="flex items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href={`/${params.workspace}/leads`}
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Leads
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="truncate font-medium max-w-[200px]">{lead.name}</span>
        </nav>

        <LeadDetailActions lead={lead} workspaceSlug={params.workspace} />
      </div>

      {/* Layout em duas colunas */}
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Painel esquerdo — perfil */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              {/* Avatar + nome + status centralizados */}
              <div className="flex flex-col items-center pb-6 text-center border-b border-border">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-lg font-bold leading-tight">{lead.name}</h1>
                <p className="mt-0.5 text-sm text-muted-foreground">{lead.role}</p>
                <p className="text-sm text-muted-foreground">{lead.company}</p>
                <LeadStatusBadge status={lead.status} className="mt-3" />
              </div>

              {/* Campos de contato */}
              <div className="space-y-3 py-5 border-b border-border">
                <InfoRow icon={Mail} label="E-mail" value={lead.email} truncate />
                <InfoRow icon={Phone} label="Telefone" value={lead.phone} />
                <InfoRow icon={Building2} label="Empresa" value={lead.company} />
                <InfoRow icon={Briefcase} label="Cargo" value={lead.role} />
                {lead.estimatedValue !== undefined && (
                  <InfoRow
                    icon={DollarSign}
                    label="Valor estimado"
                    value={formatCurrency(lead.estimatedValue)}
                  />
                )}
                <InfoRow icon={User} label="Responsável" value={lead.ownerName} />
                <InfoRow icon={Calendar} label="Criado em" value={createdDate} />
              </div>

              {/* Notas */}
              {lead.notes && (
                <div className="pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Notas
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Painel direito — timeline */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="pt-6">
              <ActivityTimeline activities={activities} leadId={lead.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
