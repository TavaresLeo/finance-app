import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../../../config/env'
import { AppError } from '../../../shared/errors/AppError'

interface TokenPayload {
  userId: string
}

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido.', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload

    req.userId = decoded.userId
    next()
  } catch (err) {
    if (err instanceof AppError) return next(err)
    next(new AppError('Token inválido.', 401))
  }
}
