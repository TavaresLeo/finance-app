import { prisma } from '../../config/database'
import { CreateInstallmentDTO } from '../../application/dto/CreateInstallmentDTO'
import { IInstallmentRepository } from '../../application/interfaces/IInstallmentRepository'
import { AppError } from '../../shared/errors/AppError'

export class CreateInstallment {
  constructor(private installmentRepository: IInstallmentRepository) {}

  async execute(userId: string, data: CreateInstallmentDTO) {
    // Verifica se a conta existe e pertence ao usuário
    const account = await prisma.account.findFirst({
      where: { id: data.accountId, userId },
    })
    if (!account) throw new AppError('Conta não encontrada.', 404)

    // Calcula valor de cada parcela (arredonda para 2 casas decimais)
    const installmentAmount = Math.round((data.amount / data.installments) * 100) / 100

    // Cria a transação principal
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        accountId: data.accountId,
        type: 'DEBIT',
        amount: data.amount,
        description: data.description,
        category: data.category,
        date: data.startDate,
        isParceled: true,
      },
    })

    // Gera as parcelas com datas mensais
    const installmentsData = Array.from({ length: data.installments }, (_, i) => {
      const dueDate = new Date(data.startDate)
      dueDate.setMonth(dueDate.getMonth() + i)

      return {
        transactionId: transaction.id,
        number: i + 1,
        total: data.installments,
        amount: installmentAmount,
        dueDate,
      }
    })

    // Salva todas as parcelas
    await this.installmentRepository.createMany(installmentsData)

    // Atualiza saldo da conta (desconta o valor total)
    await prisma.account.update({
      where: { id: data.accountId },
      data: { balance: account.balance - data.amount },
    })

    // Retorna transação com parcelas
    return prisma.transaction.findUnique({
      where: { id: transaction.id },
      include: { installments: { orderBy: { number: 'asc' } } },
    })
  }
}