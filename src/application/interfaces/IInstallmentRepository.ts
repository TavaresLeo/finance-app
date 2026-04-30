import { Installment } from '@prisma/client'

export interface CreateInstallmentData {
  transactionId: string
  number: number
  total: number
  amount: number
  dueDate: Date
}

export interface IInstallmentRepository {
  createMany(data: CreateInstallmentData[]): Promise<void>
  findByTransactionId(transactionId: string): Promise<Installment[]>
  findPendingByUserId(userId: string): Promise<Installment[]>
  markAsPaid(installmentId: string): Promise<Installment>
}