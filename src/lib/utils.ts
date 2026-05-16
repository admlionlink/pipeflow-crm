import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMin < 1) return 'agora mesmo'
  if (diffMin < 60) return `há ${diffMin} minuto${diffMin !== 1 ? 's' : ''}`
  if (diffHours < 24) return `há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
  if (diffDays < 7) return `há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`

  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${date.getUTCDate()} de ${months[date.getUTCMonth()]}, ${date.getUTCFullYear()}`
}

export function formatAbsoluteDate(dateStr: string): string {
  const date = new Date(dateStr)
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const h = String(date.getUTCHours()).padStart(2, '0')
  const m = String(date.getUTCMinutes()).padStart(2, '0')
  return `${date.getUTCDate()} de ${months[date.getUTCMonth()]}, ${date.getUTCFullYear()} às ${h}:${m}`
}
