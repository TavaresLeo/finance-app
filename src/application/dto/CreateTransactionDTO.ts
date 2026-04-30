import { z } from 'zod'

export const CreateTransactionSchema = z.object({
  accountId: z.string().min(1, 'Conta é obrigatória'),
  type: z.enum(['CREDIT', 'DEBIT']),
  amount: z.number().positive('Valor deve ser maior que zero'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.coerce.date(),
  isParceled: z.boolean().default(false),
})

export type CreateTransactionDTO = z.infer<typeof CreateTransactionSchema>
