import { Installment } from '@prisma/client'
import { prisma } from '../../../config/database'
import {
  CreateInstallmentData,
  IInstallmentRepository,
} from '../../../application/interfaces/IInstallmentRepository'

export class InstallmentModel implements IInstallmentRepository {
  async createMany(data: CreateInstallmentData[]): Promise<void> {
    await prisma.installment.createMany({ data })
  }

  async findByTransactionId(transactionId: string): Promise<Installment[]> {
    return prisma.installment.findMany({
      where: { transactionId },
      orderBy: { number: 'asc' },
    })
  }

  async findPendingByUserId(userId: string): Promise<Installment[]> {
    return prisma.installment.findMany({
      where: {
        paid: false,
        transaction: { userId },
      },
      orderBy: { dueDate: 'asc' },
      include: { transaction: true },
    })
  }

  async markAsPaid(installmentId: string): Promise<Installment> {
    return prisma.installment.update({
      where: { id: installmentId },
      data: { paid: true },
    })
  }
}