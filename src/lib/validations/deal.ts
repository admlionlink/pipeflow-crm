import { z } from 'zod'

export const dealSchema = z.object({
  title: z.string().min(2, 'Título deve ter ao menos 2 caracteres'),
  leadName: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  company: z.string().min(1, 'Empresa é obrigatória'),
  estimatedValue: z.number().min(0, 'Valor deve ser positivo'),
  stage: z.enum(['novo', 'contatado', 'qualificado', 'negociando', 'convertido', 'perdido']),
  ownerName: z.string().min(1, 'Responsável é obrigatório'),
  deadline: z.string().optional(),
  notes: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

export type DealInput = z.infer<typeof dealSchema>
