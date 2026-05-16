import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/shared/logo'
import { WaveSeparator } from '@/components/shared/wave-separator'
import { AnimateOnScroll } from '@/components/shared/animate-on-scroll'
import { SuccessCases } from '@/components/landing/success-cases'
import { NavbarMobile } from '@/components/landing/navbar-mobile'

export const metadata: Metadata = {
  title: 'PipeFlow CRM — O CRM que fecha mais negócios',
  description:
    'CRM de vendas para PMEs, freelancers e times. Pipeline Kanban, gestão de leads e dashboard analítico. Comece grátis, sem cartão.',
  openGraph: {
    title: 'PipeFlow CRM — O CRM que fecha mais negócios',
    description:
      'CRM de vendas para PMEs, freelancers e times. Pipeline Kanban, gestão de leads e dashboard analítico.',
    type: 'website',
  },
}

// ─── Data ────────────────────────────────────────────────────────────────────

const pipelineData = [
  { stage: 'novo', color: '#5B7FFF', width: '75%', value: 'R$ 32k', count: 12 },
  { stage: 'contato', color: '#00B4D8', width: '55%', value: 'R$ 24k', count: 8 },
  { stage: 'proposta', color: '#f5d10d', width: '40%', value: 'R$ 18k', count: 5 },
  { stage: 'negociação', color: '#FF6B35', width: '28%', value: 'R$ 12k', count: 3 },
  { stage: 'fechado ✓', color: '#2ED573', width: '65%', value: 'R$ 45k', count: 9 },
]

const stats = [
  { value: '+47%', label: 'taxa de conversão', sub: 'em 90 dias de uso' },
  { value: '3.2x', label: 'leads qualificados', sub: 'priorizados pelo pipeline' },
  { value: '-62%', label: 'ciclo de venda', sub: 'vs. CRMs anteriores' },
  { value: '1.200+', label: 'times ativos', sub: 'em 38 países' },
]

const features = [
  {
    idx: '01',
    name: 'Pipeline Kanban',
    desc: 'Arraste negócios entre etapas. Valor total por coluna atualizado em tempo real. Sem reload, sem espera.',
  },
  {
    idx: '02',
    name: 'Multi-Empresa',
    desc: 'Cada empresa no seu workspace isolado. Dados separados por design. Troca de contexto com um clique.',
  },
  {
    idx: '03',
    name: 'Dashboard de Vendas',
    desc: 'Funil, conversão, valor do pipeline, velocidade de fechamento. Métricas que importam, zero ruído.',
  },
  {
    idx: '04',
    name: 'Timeline de Atividades',
    desc: 'Cada ligação, e-mail, reunião e nota registrada no histórico do lead. Contexto completo, sempre.',
  },
  {
    idx: '05',
    name: 'Segurança Nativa',
    desc: 'Row Level Security no banco. Cada workspace é uma fortaleza. Criptografia em todas as camadas.',
  },
  {
    idx: '06',
    name: 'Monetização Real',
    desc: 'Stripe integrado. Planos Free e Pro. Webhook automático para ativação instantânea da assinatura.',
  },
]

const freePlan = [
  'Até 2 colaboradores',
  'Até 50 leads',
  'Pipeline Kanban completo',
  'Dashboard de vendas',
  'Timeline de atividades',
]

const proPlan = [
  'Colaboradores ilimitados',
  'Leads ilimitados',
  'Tudo do plano Free',
  'Workspaces ilimitados',
  'Suporte prioritário',
  'Histórico completo de atividades',
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-pf-bg text-pf-text">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full border-b border-pf-border-subtle bg-pf-bg/85 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Logo size="md" />

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-[13px] text-pf-text-secondary transition-colors hover:text-pf-text"
            >
              Funcionalidades
            </a>
            <a
              href="#results"
              className="text-[13px] text-pf-text-secondary transition-colors hover:text-pf-text"
            >
              Resultados
            </a>
            <a
              href="#pricing"
              className="text-[13px] text-pf-text-secondary transition-colors hover:text-pf-text"
            >
              Planos
            </a>
            <div className="h-4 w-px bg-pf-border" />
            <Link
              href="/login"
              className="text-[13px] font-medium text-pf-text-secondary transition-colors hover:text-pf-text"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-pf-accent px-5 py-2 text-[13px] font-semibold text-pf-bg pf-glow-btn"
            >
              Começar grátis
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/signup"
              className="rounded-md bg-pf-accent px-4 py-2 text-[12px] font-semibold text-pf-bg pf-glow-btn"
            >
              Começar grátis
            </Link>
            <NavbarMobile />
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-24">
        {/* Orbs */}
        <div
          className="pf-orb h-[400px] w-[400px]"
          style={{
            top: '5%',
            left: '5%',
            background: 'radial-gradient(circle, rgba(245,209,13,0.13), transparent 70%)',
          }}
        />
        <div
          className="pf-orb h-[320px] w-[320px]"
          style={{
            bottom: '10%',
            right: '8%',
            background: 'radial-gradient(circle, rgba(91,127,255,0.11), transparent 70%)',
            animationDelay: '-4s',
          }}
        />
        <div
          className="pf-orb h-[200px] w-[200px]"
          style={{
            top: '40%',
            right: '30%',
            background: 'radial-gradient(circle, rgba(0,180,216,0.08), transparent 70%)',
            animationDelay: '-7s',
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

            {/* Left — copy */}
            <div className="pf-page-enter">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pf-accent/20 bg-pf-accent/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-pf-accent">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pf-accent" />
                CRM de vendas multi-empresa
              </div>

              <h1 className="mb-6 font-display text-[clamp(38px,5vw,62px)] font-extrabold leading-[1.04] tracking-[-2.5px]">
                Vendas em
                <br />
                <span className="relative inline-block text-pf-accent">
                  fluxo contínuo
                  <span className="pf-flow-pulse absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-pf-accent/30" />
                </span>
                .
              </h1>

              <p className="mb-10 max-w-[460px] text-[17px] leading-[1.75] text-pf-text-secondary">
                Gerencie leads, negócios e equipe num CRM que respeita a velocidade
                do seu time. Pipeline visual. Multi-empresa. Sem fricção.
              </p>

              <div className="mb-10 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-lg bg-pf-accent px-7 py-3.5 text-sm font-semibold text-pf-bg pf-glow-btn"
                >
                  Começar grátis →
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-lg border border-pf-border px-7 py-3.5 text-sm font-medium text-pf-text-secondary transition-all hover:border-pf-text-muted hover:text-pf-text"
                >
                  Ver funcionalidades
                </a>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-pf-text-muted">
                <span className="h-px w-4 bg-pf-border" />
                Sem cartão de crédito · Plano grátis para sempre
              </div>
            </div>

            {/* Right — terminal pipeline viz */}
            <div
              className="pf-page-enter hidden overflow-hidden rounded-xl border border-pf-border bg-pf-surface lg:block"
              style={{ animationDelay: '150ms' }}
            >
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 border-b border-pf-border-subtle bg-pf-surface-2 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                <span className="ml-3 font-mono text-[11px] text-pf-text-muted">
                  pipeline — workspace: acme-corp
                </span>
              </div>

              {/* Pipeline rows */}
              <div className="space-y-1 p-5">
                {pipelineData.map((row) => (
                  <div
                    key={row.stage}
                    className="group flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-pf-accent/[0.06]"
                  >
                    <span
                      className="w-[88px] shrink-0 font-mono text-[10px] uppercase tracking-[0.1em]"
                      style={{ color: row.color }}
                    >
                      {row.stage}
                    </span>
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full">
                      <div className="absolute inset-0 rounded-full bg-pf-surface-2" />
                      <div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                          width: row.width,
                          background: row.color,
                          transition: 'width 1.6s cubic-bezier(.4,0,.2,1)',
                        }}
                      />
                    </div>
                    <span className="w-[68px] text-right font-mono text-xs font-medium">
                      {row.value}
                    </span>
                    <span className="w-8 text-right font-mono text-[11px] text-pf-text-muted">
                      {row.count}
                    </span>
                  </div>
                ))}

                <div className="mt-4 flex items-center justify-between border-t border-pf-border-subtle pt-3">
                  <span className="font-mono text-[10px] text-pf-text-muted">total pipeline</span>
                  <span className="font-mono text-xs font-semibold text-pf-accent">R$ 131.000</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <WaveSeparator />
        </div>
      </section>

      {/* ── Stats / Números de resultado ───────────────────────────────────── */}
      <section id="results" className="py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <AnimateOnScroll>
            <div className="overflow-hidden rounded-xl border border-pf-border">
              <div className="grid grid-cols-2 lg:grid-cols-4">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className={[
                      'p-6 transition-colors hover:bg-pf-surface/50 md:p-8',
                      // Mobile (2-col): left column has right border
                      i % 2 === 0 ? 'border-r border-pf-border-subtle' : '',
                      // Desktop (4-col): item 1 also needs right border (not covered above)
                      i === 1 ? 'lg:border-r lg:border-pf-border-subtle' : '',
                      // Desktop (4-col): last item has no right border (even if i%2===0 gave one)
                      i === 3 ? 'lg:border-r-0' : '',
                      // Mobile: top row has bottom border, removed on desktop
                      i < 2 ? 'border-b border-pf-border-subtle lg:border-b-0' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div className="mb-2 font-display text-[32px] font-extrabold leading-none tracking-[-2px] text-pf-accent md:text-[36px]">
                      {s.value}
                    </div>
                    <div className="mb-1 text-[13px] font-semibold text-pf-text">{s.label}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-pf-text-muted">
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <WaveSeparator />

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <AnimateOnScroll>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted">
              Funcionalidades
            </div>
            <h2 className="mb-12 font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.15] tracking-[-1.5px]">
              O essencial pra vender mais.<br />Nada que atrapalhe.
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-pf-border sm:grid-cols-2 md:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative bg-pf-surface p-8 transition-all hover:bg-pf-surface-2 md:p-9"
              >
                <div className="absolute left-0 top-0 h-[2px] w-0 bg-pf-accent transition-all duration-300 group-hover:w-full" />
                <div className="mb-5 font-mono text-[10px] tracking-[0.1em] text-pf-accent/60">
                  {f.idx}
                </div>
                <div className="mb-3 font-display text-[17px] font-semibold">{f.name}</div>
                <div className="text-[13px] leading-[1.7] text-pf-text-secondary">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveSeparator />

      {/* ── Success Cases ──────────────────────────────────────────────────── */}
      <SuccessCases />

      <WaveSeparator />

      {/* ── Pricing ────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <AnimateOnScroll>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted">
              Planos
            </div>
            <h2 className="mb-4 font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.15] tracking-[-1.5px]">
              Comece grátis.<br />Escale quando fizer sentido.
            </h2>
            <p className="mb-12 max-w-[460px] text-[15px] text-pf-text-secondary">
              Sem pegadinhas, sem cobranças escondidas. Faça upgrade apenas quando sua equipe crescer.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-pf-border md:grid-cols-2">

              {/* Free */}
              <div className="bg-pf-surface p-10 md:p-12">
                <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-pf-text-muted">
                  Free
                </div>
                <div className="mb-1 flex items-end gap-2">
                  <span className="font-display text-[52px] font-extrabold leading-none tracking-[-3px]">
                    R$ 0
                  </span>
                </div>
                <div className="mb-8 text-[13px] text-pf-text-muted">Para sempre</div>

                <ul className="mb-10 space-y-0">
                  {freePlan.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border-b border-pf-border-subtle py-3 text-[13px] text-pf-text-secondary last:border-b-0"
                    >
                      <span className="shrink-0 font-mono text-[10px] text-pf-text-muted">✓</span>
                      {item}
                    </li>
                  ))}
                  <li className="flex items-center gap-3 border-b border-pf-border-subtle py-3 text-[13px] text-pf-text-muted last:border-b-0">
                    <span className="shrink-0 font-mono text-[10px] text-pf-border">✗</span>
                    Suporte prioritário
                  </li>
                </ul>

                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-pf-border py-3 text-sm font-semibold text-pf-text-secondary transition-all hover:border-pf-text-muted hover:text-pf-text"
                >
                  Começar grátis
                </Link>
              </div>

              {/* Pro */}
              <div className="relative overflow-hidden bg-pf-surface-2 p-10 md:p-12">
                <div
                  className="pointer-events-none absolute right-0 top-0 h-[200px] w-[200px]"
                  style={{
                    background:
                      'radial-gradient(circle at top right, rgba(245,209,13,0.07), transparent 70%)',
                  }}
                />

                <div className="mb-6 flex items-center justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pf-accent">
                    Pro
                  </div>
                  <span className="rounded-full border border-pf-accent/20 bg-pf-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-pf-accent">
                    recomendado
                  </span>
                </div>

                <div className="mb-1 flex items-end gap-2">
                  <span className="font-display text-[52px] font-extrabold leading-none tracking-[-3px]">
                    R$ 49
                  </span>
                  <span className="mb-3 text-[14px] text-pf-text-muted">/mês</span>
                </div>
                <div className="mb-8 text-[13px] text-pf-text-muted">por workspace</div>

                <ul className="mb-10 space-y-0">
                  {proPlan.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border-b border-pf-border-subtle py-3 text-[13px] text-pf-text-secondary last:border-b-0"
                    >
                      <span className="shrink-0 font-mono text-[10px] text-pf-accent">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-pf-accent py-3 text-sm font-semibold text-pf-bg pf-glow-btn"
                >
                  Assinar Pro →
                </Link>
              </div>

            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <WaveSeparator />

      {/* ── CTA Final ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 text-center md:py-28">
        <div
          className="pf-orb h-[300px] w-[300px]"
          style={{
            top: '10%',
            left: '15%',
            background: 'radial-gradient(circle, rgba(245,209,13,0.09), transparent 70%)',
          }}
        />
        <div
          className="pf-orb h-[250px] w-[250px]"
          style={{
            bottom: '10%',
            right: '20%',
            background: 'radial-gradient(circle, rgba(91,127,255,0.07), transparent 70%)',
            animationDelay: '-5s',
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6">
          <AnimateOnScroll>
            <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-pf-text-muted">
              Pronto pra começar?
            </div>
            <h2 className="mb-6 font-display text-[clamp(32px,4.5vw,56px)] font-extrabold leading-[1.05] tracking-[-2.5px]">
              Coloque suas vendas<br />em <span className="text-pf-accent">fluxo</span> hoje.
            </h2>
            <p className="mx-auto mb-10 max-w-[440px] text-[16px] leading-[1.7] text-pf-text-secondary">
              Crie sua conta, configure seu workspace e comece a gerenciar leads
              em menos de 2 minutos. Sem cartão de crédito.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-pf-accent px-9 py-4 text-base font-semibold text-pf-bg pf-glow-btn"
              >
                Começar agora — é grátis →
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-pf-border px-7 py-4 text-sm font-medium text-pf-text-secondary transition-all hover:border-pf-text-muted hover:text-pf-text"
              >
                Já tenho conta
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-pf-border-subtle px-6 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo size="sm" />
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-xs text-pf-text-muted transition-colors hover:text-pf-text-secondary"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="text-xs text-pf-text-muted transition-colors hover:text-pf-text-secondary"
            >
              Cadastro
            </Link>
            <a
              href="#pricing"
              className="text-xs text-pf-text-muted transition-colors hover:text-pf-text-secondary"
            >
              Planos
            </a>
          </div>
          <p className="font-mono text-[11px] text-pf-text-muted">
            Construído com Claude Code · No Code Start Up © {new Date().getFullYear()}
          </p>
        </div>
      </footer>

    </div>
  )
}
