'use client'

import Link from 'next/link'
import { Zap, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { type Plan } from '@/types/workspace'

const LIMITS = {
  free: { members: 2, leads: 50 },
  pro: { members: Infinity, leads: Infinity },
}

interface UsageBarProps {
  label: string
  current: number
  max: number
  warn: boolean
}

function UsageBar({ label, current, max, warn }: UsageBarProps) {
  const pct = Math.min((current / max) * 100, 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className={warn ? 'font-semibold text-amber-500' : 'text-muted-foreground'}>
          {current} / {max}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${warn ? 'bg-amber-500' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

interface PlanTabProps {
  plan: Plan
  memberCount: number
}

export function PlanTab({ plan, memberCount }: PlanTabProps) {
  const membersCount = memberCount
  const leadsCount = 0  // Leads count via M14 (Stripe enforcement)
  const limits = LIMITS[plan]

  const membersPct = plan === 'free' ? (membersCount / limits.members) * 100 : 0
  const leadsPct = plan === 'free' ? (leadsCount / limits.leads) * 100 : 0
  const warnMembers = membersPct > 80
  const warnLeads = leadsPct > 80
  const anyWarn = warnMembers || warnLeads

  return (
    <div className="space-y-6">
      {/* Card do plano atual */}
      <div className="flex items-center justify-between rounded-lg border border-border p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Plano atual</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold capitalize">{plan === 'pro' ? 'Pro' : 'Grátis'}</p>
              {plan === 'pro' && (
                <Badge className="text-xs">Ativo</Badge>
              )}
            </div>
          </div>
        </div>
        {plan === 'free' && (
          <Button size="sm" asChild>
            <Link href="/signup">
              <Zap className="h-3.5 w-3.5" />
              Upgrade para Pro
            </Link>
          </Button>
        )}
      </div>

      {/* Aviso de uso próximo ao limite */}
      {anyWarn && plan === 'free' && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Você está chegando ao limite do plano Free.{' '}
            <Link href="/signup" className="font-medium underline">
              Faça upgrade para Pro
            </Link>{' '}
            por R$ 49/mês para membros e leads ilimitados.
          </p>
        </div>
      )}

      {/* Barras de uso (apenas no Free) */}
      {plan === 'free' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Uso do plano</h3>
          <UsageBar
            label="Membros"
            current={membersCount}
            max={limits.members}
            warn={warnMembers}
          />
          <UsageBar
            label="Leads ativos"
            current={leadsCount}
            max={limits.leads}
            warn={warnLeads}
          />
        </div>
      )}

      {/* Features do plano */}
      {plan === 'free' && (
        <div className="rounded-lg border border-border p-5">
          <h3 className="mb-3 text-sm font-semibold">O que você ganha no Pro</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              'Membros ilimitados',
              'Leads ilimitados',
              'Dashboard avançado',
              'Exportação de dados (CSV)',
              'Suporte prioritário',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>
          <Button className="mt-4 w-full" asChild>
            <Link href="/signup">Assinar Pro — R$ 49/mês</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
