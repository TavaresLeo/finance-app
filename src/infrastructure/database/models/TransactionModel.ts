import { prisma } from '../../../config/database'
import { Transaction } from '../../../domain/entities/Transaction'
import { CreateTransactionData, ITransactionRepository } from '../../../application/interfaces/ITransactionRepository'

export class TransactionModel implements ITransactionRepository {
  async create(data: CreateTransactionData): Promise<Transaction> {
    const transaction = await prisma.transaction.create({ data })
    return transaction as Transaction
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    })
    return transactions as Transaction[]
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findUnique({ where: { id } })
    return transaction as Transaction | null
  }
}
