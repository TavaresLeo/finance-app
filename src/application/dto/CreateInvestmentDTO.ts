import { z } from 'zod'

export const CreateInvestmentSchema = z.object({
  type: z.enum(['STOCK', 'ETF', 'CDI', 'CRYPTO']),
  asset: z.string().min(1, 'Ativo é obrigatório').toUpperCase(),
  quantity: z.number().positive('Quantidade deve ser maior que zero'),
  averagePrice: z.number().positive('Preço médio deve ser maior que zero'),
})

export const UpdateInvestmentSchema = z.object({
  quantity: z.number().positive('Quantidade deve ser maior que zero'),
  averagePrice: z.number().positive('Preço médio deve ser maior que zero'),
})

export type CreateInvestmentDTO = z.infer<typeof CreateInvestmentSchema>
export type UpdateInvestmentDTO = z.infer<typeof UpdateInvestmentSchema>