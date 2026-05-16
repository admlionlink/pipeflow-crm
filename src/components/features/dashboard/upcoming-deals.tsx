import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

interface UpcomingDeal {
  id: string
  title: string
  company: string
  leadName: string
  estimatedValue: number
  stage: string
  ownerName: string
  deadline?: string
  isOverdue: boolean
  daysUntil: number
}

interface UpcomingDealsProps {
  deals: UpcomingDeal[]
  workspaceSlug: string
}

const STAGE_COLORS: Record<string, { color: string; label: string }> = {
  novo:        { color: '#5B7FFF', label: 'Novo Lead' },
  contatado:   { color: '#00B4D8', label: 'Contatado' },
  qualificado: { color: '#f5d10d', label: 'Proposta' },
  negociando:  { color: '#FF6B35', label: 'Negociação' },
  convertido:  { color: '#2ED573', label: 'Ganho' },
  perdido:     { color: '#FF4757', label: 'Perdido' },
}

function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
    .toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
    .replace('.', '')
}

export function UpcomingDeals({ deals, workspaceSlug }: UpcomingDealsProps) {
  if (deals.length === 0) {
    return (
      <div className="rounded-xl border p-5">
        <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
          <Calendar className="h-8 w-8 opacity-30" />
          <p className="text-sm font-mono">Nenhum prazo próximo</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-card">
              <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                Negócio
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                Etapa
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                Prazo
              </th>
              <th className="px-6 py-3 text-right text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {deals.map((deal) => {
              const stageInfo = STAGE_COLORS[deal.stage]

              return (
                <tr key={deal.id} className="hover:bg-pf-surface-2 transition-colors">
                  {/* Negócio */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <Link
                        href={`/${workspaceSlug}/pipeline`}
                        className="font-medium leading-snug hover:text-primary transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>
                          {deal.title}{' '}
                          <span className="text-muted-foreground">—</span> {deal.company}
                        </span>
                        <span className="text-primary shrink-0">→</span>
                      </Link>
                      <span className="text-[11px] font-mono text-muted-foreground">{deal.ownerName}</span>
                    </div>
                  </td>

                  {/* Lead */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{deal.leadName}</span>
                      <span className="text-[11px] font-mono text-muted-foreground">{deal.company}</span>
                    </div>
                  </td>

                  {/* Etapa */}
                  <td className="px-6 py-4">
                    {stageInfo && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: stageInfo.color }}
                        />
                        {stageInfo.label}
                      </span>
                    )}
                  </td>

                  {/* Prazo */}
                  <td className="px-6 py-4">
                    {deal.deadline && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <div
                          className={cn(
                            'flex items-center gap-1 font-mono text-sm',
                            deal.isOverdue
                              ? 'text-pf-negative'
                              : deal.daysUntil <= 7
                                ? 'text-amber-500'
                                : 'text-muted-foreground',
                          )}
                        >
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatShortDate(deal.deadline)}</span>
                        </div>
                        {deal.isOverdue && (
                          <span className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold bg-pf-negative/10 text-pf-negative border border-pf-negative/20 uppercase tracking-wider">
                            Vencido
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Valor */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-sm tabular-nums">
                      {formatCurrency(deal.estimatedValue)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
