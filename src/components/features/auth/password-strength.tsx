'use client'

import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
}

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Muito fraca', color: 'bg-destructive' }
  if (score === 2) return { score, label: 'Fraca', color: 'bg-orange-400' }
  if (score === 3) return { score, label: 'Média', color: 'bg-amber-400' }
  if (score === 4) return { score, label: 'Forte', color: 'bg-emerald-400' }
  return { score, label: 'Muito forte', color: 'bg-emerald-500' }
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color } = getStrength(password)

  if (!password) return null

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i < score ? color : 'bg-muted',
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
