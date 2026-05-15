export type LeadStatus =
  | 'novo'
  | 'contatado'
  | 'qualificado'
  | 'negociando'
  | 'convertido'
  | 'perdido'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: LeadStatus
  ownerName: string
  workspaceId: string
  createdAt: string
  notes?: string
  estimatedValue?: number
}

export const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'novo', label: 'Novo' },
  { value: 'contatado', label: 'Contatado' },
  { value: 'qualificado', label: 'Qualificado' },
  { value: 'negociando', label: 'Negociando' },
  { value: 'convertido', label: 'Convertido' },
  { value: 'perdido', label: 'Perdido' },
]
