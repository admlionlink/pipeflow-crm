'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

type Period = '7d' | '30d' | '90d'

const OPTIONS: { value: Period; label: string }[] = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
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
    <div className="flex items-center gap-0.5 rounded-lg border bg-muted/40 p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => select(opt.value)}
          className={cn(
            'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
            current === opt.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
