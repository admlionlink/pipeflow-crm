import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(80),
    email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
    password: z
      .string()
      .min(8, 'Mínimo de 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve conter pelo menos um número'),
    terms: z
      .boolean()
      .refine((val) => val === true, { message: 'Você precisa aceitar os termos' }),
  })
  .required()

export const onboardingSchema = z.object({
  workspaceName: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>
