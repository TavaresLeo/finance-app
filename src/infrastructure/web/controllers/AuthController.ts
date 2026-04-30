import { Request, Response, NextFunction } from 'express'
import { CreateUserSchema, LoginSchema } from '../../../application/dto/CreateUserDTO'
import { CreateUser } from '../../../domain/use-cases/CreateUser'
import { LoginUser } from '../../../domain/use-cases/LoginUser'
import { UserModel } from '../../database/models/UserModel'
import { AppError } from '../../../shared/errors/AppError'

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateUserSchema.safeParse(req.body)
      if (!parsed.success) {
        const errors = parsed.error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
        throw new AppError(JSON.stringify(errors), 422)
      }

      const repository = new UserModel()
      const useCase = new CreateUser(repository)
      const user = await useCase.execute(parsed.data)

      return res.status(201).json(user)
    } catch (err) {
      next(err)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = LoginSchema.safeParse(req.body)
      if (!parsed.success) {
        const errors = parsed.error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
        throw new AppError(JSON.stringify(errors), 422)
      }

      const repository = new UserModel()
      const useCase = new LoginUser(repository)
      const result = await useCase.execute(parsed.data)

      return res.json(result)
    } catch (err) {
      next(err)
    }
  }
}
