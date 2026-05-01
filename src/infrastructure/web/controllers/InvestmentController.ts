import { Request, Response, NextFunction } from 'express'
import { CreateInvestmentSchema, UpdateInvestmentSchema } from '../../../application/dto/CreateInvestmentDTO'
import { CreateInvestment } from '../../../domain/use-cases/CreateInvestment'
import { InvestmentModel } from '../../database/models/InvestmentModel'
import { AppError } from '../../../shared/errors/AppError'

export class InvestmentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateInvestmentSchema.safeParse(req.body)
      if (!parsed.success) {
        const errors = parsed.error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
        throw new AppError(JSON.stringify(errors), 422)
      }

      const repository = new InvestmentModel()
      const useCase = new CreateInvestment(repository)
      const investment = await useCase.execute(req.userId, parsed.data)

      return res.status(201).json(investment)
    } catch (err) {
      next(err)
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const repository = new InvestmentModel()
      const investments = await repository.findByUserId(req.userId)

      // Calcula total investido
      const totalInvested = investments.reduce(
        (sum, inv) => sum + inv.quantity * inv.averagePrice, 0
      )

      return res.json({ investments, totalInvested })
    } catch (err) {
      next(err)
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const repository = new InvestmentModel()
      const investment = await repository.findByUserIdAndAsset(req.userId, req.params.asset)

      if (!investment) throw new AppError('Investimento não encontrado.', 404)

      await repository.delete(investment.id)
      return res.json({ message: 'Investimento removido com sucesso.' })
    } catch (err) {
      next(err)
    }
  }
}