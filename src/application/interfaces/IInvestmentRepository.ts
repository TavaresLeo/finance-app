import { Investment } from '@prisma/client'

export interface CreateInvestmentData {
  userId: string
  type: 'STOCK' | 'ETF' | 'CDI' | 'CRYPTO'
  asset: string
  quantity: number
  averagePrice: number
}

export interface IInvestmentRepository {
  create(data: CreateInvestmentData): Promise<Investment>
  findByUserId(userId: string): Promise<Investment[]>
  findByUserIdAndAsset(userId: string, asset: string): Promise<Investment | null>
  update(id: string, quantity: number, averagePrice: number): Promise<Investment>
  delete(id: string): Promise<void>
}