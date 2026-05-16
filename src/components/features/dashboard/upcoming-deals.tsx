import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { PIPELINE_STAGES } from '@/types/deal'

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

function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
    .toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
    .replace('.', '')
}

export function UpcomingDeals({ deals, workspaceSlug }: UpcomingDealsProps) {
  if (deals.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-5">
        <h3 className="text-sm font-semibold mb-4">Negócios com Prazo Próximo</h3>
        <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
          <Calendar className="h-8 w-8 opacity-30" />
          <p className="text-sm">Nenhum prazo próximo</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-sm font-semibold">Negócios com Prazo Próximo</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Negócio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Etapa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Prazo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {deals.map((deal) => {
              const stageConfig = PIPELINE_STAGES.find((s) => s.id === deal.stage)

              return (
                <tr key={deal.id} className="group hover:bg-muted/20 transition-colors">
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
                      <span className="text-xs text-muted-foreground">{deal.ownerName}</span>
                    </div>
                  </td>

                  {/* Lead */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{deal.leadName}</span>
                      <span className="text-xs text-muted-foreground">{deal.company}</span>
                    </div>
                  </td>

                  {/* Etapa */}
                  <td className="px-6 py-4">
                    {stageConfig && (
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
                          stageConfig.badgeClass,
                        )}
                      >
                        {stageConfig.label}
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
                              ? 'text-red-500'
                              : deal.daysUntil <= 7
                                ? 'text-amber-500'
                                : 'text-muted-foreground',
                          )}
                        >
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatShortDate(deal.deadline)}</span>
                        </div>
                        {deal.isOverdue && (
                          <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-wide">
                            Vencido
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Valor */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-semibold tabular-nums">
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
