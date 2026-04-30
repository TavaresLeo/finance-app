import { Transaction } from '../entities/Transaction'
import { CreateTransactionDTO } from '../../application/dto/CreateTransactionDTO'
import { ITransactionRepository } from '../../application/interfaces/ITransactionRepository'
import { AppError } from '../../shared/errors/AppError'
import { prisma } from '../../config/database'

export class CreateTransaction {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(userId: string, data: CreateTransactionDTO): Promise<Transaction> {
    const account = await prisma.account.findFirst({
      where: { id: data.accountId, userId },
    })

    if (!account) throw new AppError('Conta não encontrada.', 404)

    if (data.type === 'DEBIT' && account.balance < data.amount) {
      throw new AppError('Saldo insuficiente.')
    }

    const transaction = await this.transactionRepository.create({ userId, ...data })

    const newBalance =
      data.type === 'CREDIT'
        ? account.balance + data.amount
        : account.balance - data.amount

    await prisma.account.update({
      where: { id: data.accountId },
      data: { balance: newBalance },
    })

    return transaction
  }
}
