'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

type Period = '7d' | '30d' | '90d'

const OPTIONS: { value: Period; label: string }[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
]

export function PeriodFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = (searchParams.get('period') as Period | null) ?? '30d'

  function select(period: Period) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('period', period)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border bg-card p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => select(opt.value)}
          className={cn(
            'px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-[0.15em] transition-all',
            current === opt.value
              ? 'bg-pf-accent/10 text-pf-accent'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
