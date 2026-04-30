import { Request, Response, NextFunction } from 'express'
import { CreateTransactionSchema } from '../../../application/dto/CreateTransactionDTO'
import { CreateTransaction } from '../../../domain/use-cases/CreateTransaction'
import { TransactionModel } from '../../database/models/TransactionModel'
import { AppError } from '../../../shared/errors/AppError'

export class TransactionController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateTransactionSchema.safeParse(req.body)
      if (!parsed.success) {
        const errors = parsed.error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
        throw new AppError(JSON.stringify(errors), 422)
      }

      const userId = req.userId
      const repository = new TransactionModel()
      const useCase = new CreateTransaction(repository)
      const transaction = await useCase.execute(userId, parsed.data)

      return res.status(201).json(transaction)
    } catch (err) {
      next(err)
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId
      const repository = new TransactionModel()
      const transactions = await repository.findByUserId(userId)

      return res.json(transactions)
    } catch (err) {
      next(err)
    }
  }
}
