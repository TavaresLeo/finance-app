export type TransactionType = 'CREDIT' | 'DEBIT'

export interface Transaction {
  id: string
  userId: string
  accountId: string
  type: TransactionType
  amount: number
  description: string
  category: string
  date: Date
  isParceled: boolean
  createdAt: Date
}
