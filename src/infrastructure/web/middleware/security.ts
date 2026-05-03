import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express'

// Helmet — protege headers HTTP
export const helmetMiddleware = helmet()

// Rate limit geral — 100 requests por 15 minutos
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limit para auth — 10 tentativas por 15 minutos
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Sanitização — remove campos perigosos do body
export function sanitizeBody(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    const dangerous = ['__proto__', 'constructor', 'prototype']
    dangerous.forEach((key) => {
      if (key in req.body) {
        delete req.body[key]
      }
    })
  }
  next()
}

// Log de auditoria — registra ações sensíveis
export function auditLog(req: Request, res: Response, next: NextFunction) {
  const sensitivePaths = ['/auth/login', '/auth/register', '/transactions', '/investments']
  const isSensitive = sensitivePaths.some((path) => req.path.startsWith(path))

  if (isSensitive) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      ip: req.ip,
      userId: req.userId || 'anonymous',
    }))
  }

  next()
}