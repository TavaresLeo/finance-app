import { z } from 'zod'

export const CreateInstallmentSchema = z.object({
  accountId: z.string().min(1, 'Conta é obrigatória'),
  amount: z.number().positive('Valor total deve ser maior que zero'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  installments: z.number().int().min(2, 'Mínimo de 2 parcelas').max(48, 'Máximo de 48 parcelas'),
  startDate: z.coerce.date(),
})

export type CreateInstallmentDTO = z.infer<typeof CreateInstallmentSchema>