import { Request, Response, NextFunction } from 'express'
import { CreateInstallmentSchema } from '../../../application/dto/CreateInstallmentDTO'
import { CreateInstallment } from '../../../domain/use-cases/CreateInstallment'
import { InstallmentModel } from '../../database/models/InstallmentModel'
import { AppError } from '../../../shared/errors/AppError'

export class InstallmentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateInstallmentSchema.safeParse(req.body)
      if (!parsed.success) {
        const errors = parsed.error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
        throw new AppError(JSON.stringify(errors), 422)
      }

      const repository = new InstallmentModel()
      const useCase = new CreateInstallment(repository)
      const result = await useCase.execute(req.userId, parsed.data)

      return res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  }

  async listPending(req: Request, res: Response, next: NextFunction) {
    try {
      const repository = new InstallmentModel()
      const installments = await repository.findPendingByUserId(req.userId)
      return res.json(installments)
    } catch (err) {
      next(err)
    }
  }

  async markAsPaid(req: Request, res: Response, next: NextFunction) {
    try {
      const repository = new InstallmentModel()
      const installment = await repository.markAsPaid(req.params.id)
      return res.json(installment)
    } catch (err) {
      next(err)
    }
  }
}