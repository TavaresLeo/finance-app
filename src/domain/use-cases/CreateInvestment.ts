import { Investment } from '../../application/interfaces/IInvestmentRepository'
import { CreateInvestmentDTO } from '../../application/dto/CreateInvestmentDTO'
import { IInvestmentRepository } from '../../application/interfaces/IInvestmentRepository'

export class CreateInvestment {
  constructor(private investmentRepository: IInvestmentRepository) {}

  async execute(userId: string, data: CreateInvestmentDTO): Promise<Investment> {
    // Verifica se já tem posição nesse ativo
    const existing = await this.investmentRepository.findByUserIdAndAsset(
      userId,
      data.asset
    )

    if (existing) {
      // Calcula novo preço médio ponderado
      // Fórmula: (qtdAtual * preçoAtual + qtdNova * preçoNovo) / (qtdAtual + qtdNova)
      const totalQuantity = existing.quantity + data.quantity
      const newAveragePrice =
        (existing.quantity * existing.averagePrice + data.quantity * data.averagePrice) /
        totalQuantity

      return this.investmentRepository.update(
        existing.id,
        totalQuantity,
        Math.round(newAveragePrice * 100) / 100
      )
    }

    // Cria nova posição
    return this.investmentRepository.create({
      userId,
      ...data,
    })
  }
}