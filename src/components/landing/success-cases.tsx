import { AnimateOnScroll } from '@/components/shared/animate-on-scroll'

const cases = [
  {
    idx: '01',
    company: 'TechScale',
    metric: '+89%',
    metricLabel: 'de taxa de conversão',
    quote:
      'Migramos do Pipedrive e perdemos menos de um dia de setup. Em 2 semanas o pipeline estava completamente organizado e a equipe não queria mais voltar atrás.',
    name: 'Lucas Ferreira',
    role: 'Head de Vendas',
  },
  {
    idx: '02',
    company: 'NovaBiz',
    metric: '3 empresas',
    metricLabel: 'num único login',
    quote:
      'Gerencio 3 workspaces separados com uma conta só. Nunca mais perdi lead por não saber de qual empresa era. O multi-workspace salvou a operação.',
    name: 'Mariana Costa',
    role: 'CEO & Fundadora',
  },
  {
    idx: '03',
    company: 'RF Consultoria',
    metric: 'R$ 0/mês',
    metricLabel: 'para começar',
    quote:
      'O plano Free resolve tudo que o HubSpot cobrava R$ 300/mês pra fazer. Quando precisei de mais membros, o Pro custou menos que um almoço de equipe.',
    name: 'Rafael Duarte',
    role: 'Consultor Autônomo',
  },
]

export function SuccessCases() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimateOnScroll>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted mb-4">
            Cases de Sucesso
          </div>
          <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-1.5px] leading-[1.15] mb-12">
            Times que já fecham mais.<br />Com o mesmo esforço de antes.
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-pf-border rounded-xl overflow-hidden">
            {cases.map((c) => (
              <div
                key={c.idx}
                className="bg-pf-surface p-8 md:p-9 flex flex-col gap-6 relative group hover:bg-pf-surface-2 transition-all"
              >
                <div className="absolute top-0 left-0 w-0 h-[2px] bg-pf-accent group-hover:w-full transition-all duration-300" />

                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] tracking-[0.1em] text-pf-accent/60">
                    {c.idx}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-pf-text-muted">
                    {c.company}
                  </span>
                </div>

                <div>
                  <div className="font-display text-[32px] font-extrabold tracking-[-2px] text-pf-accent leading-none">
                    {c.metric}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-pf-text-muted mt-1">
                    {c.metricLabel}
                  </div>
                </div>

                <p className="text-[13px] leading-[1.75] text-pf-text-secondary flex-1">
                  &ldquo;{c.quote}&rdquo;
                </p>

                <div className="border-t border-pf-border-subtle pt-4">
                  <div className="text-[13px] font-semibold text-pf-text">{c.name}</div>
                  <div className="font-mono text-[10px] text-pf-text-muted mt-0.5">{c.role}</div>
                </div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
