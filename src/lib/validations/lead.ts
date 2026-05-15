import { z } from 'zod'

export const leadSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  phone: z.string().min(1, 'Telefone obrigatório').max(20, 'Telefone inválido'),
  company: z.string().min(1, 'Empresa obrigatória').max(100, 'Nome da empresa muito longo'),
  role: z.string().min(1, 'Cargo obrigatório').max(100, 'Cargo muito longo'),
  status: z.enum(['novo', 'contatado', 'qualificado', 'negociando', 'convertido', 'perdido']),
  estimatedValue: z.number().min(0, 'Valor não pode ser negativo').optional(),
  notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
})

export type LeadInput = z.infer<typeof leadSchema>
