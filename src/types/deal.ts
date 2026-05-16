export type DealStage =
  | 'novo'
  | 'contatado'
  | 'qualificado'
  | 'negociando'
  | 'convertido'
  | 'perdido'

export interface Deal {
  id: string
  title: string
  leadName: string
  company: string
  estimatedValue: number
  stage: DealStage
  ownerName: string
  workspaceId: string
  createdAt: string
  deadline?: string
  notes?: string
}

export interface PipelineStageConfig {
  id: DealStage
  label: string
  headerLabel: string
  barClass: string
  dotClass: string
  headerTextClass: string
  textClass: string
  badgeClass: string
  glowShadow: string
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    id: 'novo',
    label: 'Novo Lead',
    headerLabel: 'NOVO LEAD',
    barClass: 'bg-blue-500',
    dotClass: 'bg-blue-500',
    headerTextClass: 'text-blue-400',
    textClass: 'text-blue-500',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    glowShadow: '0 4px 14px rgba(59,130,246,0.25)',
  },
  {
    id: 'contatado',
    label: 'Contatado',
    headerLabel: 'CONTATO REALIZADO',
    barClass: 'bg-cyan-500',
    dotClass: 'bg-cyan-500',
    headerTextClass: 'text-cyan-400',
    textClass: 'text-cyan-500',
    badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    glowShadow: '0 4px 14px rgba(6,182,212,0.25)',
  },
  {
    id: 'qualificado',
    label: 'Proposta Enviada',
    headerLabel: 'PROPOSTA ENVIADA',
    barClass: 'bg-amber-500',
    dotClass: 'bg-amber-500',
    headerTextClass: 'text-amber-400',
    textClass: 'text-amber-500',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    glowShadow: '0 4px 14px rgba(245,158,11,0.25)',
  },
  {
    id: 'negociando',
    label: 'Negociação',
    headerLabel: 'NEGOCIAÇÃO',
    barClass: 'bg-orange-500',
    dotClass: 'bg-orange-500',
    headerTextClass: 'text-orange-400',
    textClass: 'text-orange-500',
    badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    glowShadow: '0 4px 14px rgba(249,115,22,0.3)',
  },
  {
    id: 'convertido',
    label: 'Fechado',
    headerLabel: 'FECHADO',
    barClass: 'bg-emerald-500',
    dotClass: 'bg-emerald-500',
    headerTextClass: 'text-emerald-400',
    textClass: 'text-emerald-500',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    glowShadow: '0 4px 14px rgba(16,185,129,0.25)',
  },
  {
    id: 'perdido',
    label: 'Perdido',
    headerLabel: 'PERDIDO',
    barClass: 'bg-red-500',
    dotClass: 'bg-red-500',
    headerTextClass: 'text-red-400',
    textClass: 'text-red-500',
    badgeClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    glowShadow: '0 4px 14px rgba(239,68,68,0.25)',
  },
]

export const DEAL_STAGE_OPTIONS: { value: DealStage; label: string }[] = PIPELINE_STAGES.map(
  (s) => ({ value: s.id, label: s.label }),
)
