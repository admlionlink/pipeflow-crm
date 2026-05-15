import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PipeFlow CRM',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Painel de branding — visível só no desktop */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-zinc-950 border-r border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">PipeFlow</span>
        </div>

        <div className="space-y-4">
          <blockquote className="space-y-2">
            <p className="text-lg text-zinc-300 leading-relaxed">
              &ldquo;Saímos de planilhas bagunçadas para um pipeline organizado em uma tarde. Nossa
              taxa de conversão subiu 40% no primeiro mês.&rdquo;
            </p>
            <footer className="text-sm text-zinc-500">
              <span className="font-medium text-zinc-400">Marina Costa</span> — CEO, Agência Viva
            </footer>
          </blockquote>
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-bold text-zinc-50 leading-tight">
            Feche mais negócios.
            <br />
            <span className="text-primary">Sem complicação.</span>
          </p>
          <p className="text-sm text-zinc-500">
            CRM de vendas para PMEs, freelancers e times ágeis.
          </p>
        </div>
      </div>

      {/* Painel do formulário */}
      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
