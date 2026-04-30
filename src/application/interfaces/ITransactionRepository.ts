import { Transaction } from '../../domain/entities/Transaction'

export interface CreateTransactionData {
  userId: string
  accountId: string
  type: 'CREDIT' | 'DEBIT'
  amount: number
  description: string
  category: string
  date: Date
  isParceled: boolean
}

export interface ITransactionRepository {
  create(data: CreateTransactionData): Promise<Transaction>
  findByUserId(userId: string): Promise<Transaction[]>
  findById(id: string): Promise<Transaction | null>
}
