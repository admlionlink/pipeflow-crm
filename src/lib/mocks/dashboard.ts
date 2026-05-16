import { MOCK_DEALS } from './deals'
import { MOCK_LEADS } from './leads'

export type Period = '7d' | '30d' | '90d'

const ACTIVE_STAGES = new Set(['novo', 'contatado', 'qualificado', 'negociando'])

function daysAgo(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

function pctChange(curr: number, prev: number): number {
  if (prev === 0) return curr > 0 ? 100 : 0
  return Math.round(((curr - prev) / prev) * 100)
}

export function getDashboardMetrics(period: Period = '30d') {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90

  const cutoff = daysAgo(days)
  const prevCutoff = daysAgo(days * 2)

  const currLeads = MOCK_LEADS.filter((l) => new Date(l.createdAt) >= cutoff)
  const prevLeads = MOCK_LEADS.filter((l) => {
    const d = new Date(l.createdAt)
    return d >= prevCutoff && d < cutoff
  })

  const currDeals = MOCK_DEALS.filter((d) => new Date(d.createdAt) >= cutoff)
  const prevDeals = MOCK_DEALS.filter((d) => {
    const date = new Date(d.createdAt)
    return date >= prevCutoff && date < cutoff
  })

  const currOpen = currDeals.filter((d) => ACTIVE_STAGES.has(d.stage))
  const prevOpen = prevDeals.filter((d) => ACTIVE_STAGES.has(d.stage))

  const currPipeline = currOpen.reduce((s, d) => s + d.estimatedValue, 0)
  const prevPipeline = prevOpen.reduce((s, d) => s + d.estimatedValue, 0)

  const currConverted = currLeads.filter((l) => l.status === 'convertido').length
  const prevConverted = prevLeads.filter((l) => l.status === 'convertido').length

  const currConvRate = currLeads.length > 0 ? (currConverted / currLeads.length) * 100 : 0
  const prevConvRate = prevLeads.length > 0 ? (prevConverted / prevLeads.length) * 100 : 0

  return {
    totalLeads: {
      value: currLeads.length,
      change: pctChange(currLeads.length, prevLeads.length),
    },
    openDeals: {
      value: currOpen.length,
      change: pctChange(currOpen.length, prevOpen.length),
    },
    pipelineValue: {
      value: currPipeline,
      change: pctChange(currPipeline, prevPipeline),
    },
    conversionRate: {
      value: currConvRate,
      change: pctChange(currConvRate, prevConvRate),
    },
  }
}

export function getFunnelData() {
  const stages = [
    { stage: 'novo', label: 'Novo Lead', color: '#5B7FFF' },
    { stage: 'contatado', label: 'Contatado', color: '#00B4D8' },
    { stage: 'qualificado', label: 'Proposta', color: '#f5d10d' },
    { stage: 'negociando', label: 'Negociação', color: '#FF6B35' },
    { stage: 'convertido', label: 'Ganho', color: '#2ED573' },
    { stage: 'perdido', label: 'Perdido', color: '#FF4757' },
  ]

  return stages.map(({ stage, label, color }) => ({
    stage,
    label,
    color,
    count: MOCK_DEALS.filter((d) => d.stage === stage).length,
    value: MOCK_DEALS.filter((d) => d.stage === stage).reduce((s, d) => s + d.estimatedValue, 0),
  }))
}

export function getUpcomingDeals(limit = 8) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return MOCK_DEALS.filter((d) => d.deadline && ACTIVE_STAGES.has(d.stage))
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, limit)
    .map((d) => {
      const deadline = new Date(d.deadline!)
      deadline.setHours(0, 0, 0, 0)
      const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { ...d, isOverdue: daysUntil < 0, daysUntil }
    })
}
