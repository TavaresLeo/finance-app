import { Investment } from '@prisma/client'
import { prisma } from '../../../config/database'
import {
  CreateInvestmentData,
  IInvestmentRepository,
} from '../../../application/interfaces/IInvestmentRepository'

export class InvestmentModel implements IInvestmentRepository {
  async create(data: CreateInvestmentData): Promise<Investment> {
    return prisma.investment.create({ data })
  }

  async findByUserId(userId: string): Promise<Investment[]> {
    return prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findByUserIdAndAsset(userId: string, asset: string): Promise<Investment | null> {
    return prisma.investment.findFirst({
      where: { userId, asset },
    })
  }

  async update(id: string, quantity: number, averagePrice: number): Promise<Investment> {
    return prisma.investment.update({
      where: { id },
      data: { quantity, averagePrice },
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.investment.delete({ where: { id } })
  }
}