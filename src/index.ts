import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { prisma } from './config/database'
import { AppError } from './shared/errors/AppError'
import authRoutes from './infrastructure/web/routes/auth.routes'
import transactionRoutes from './infrastructure/web/routes/transaction.routes'
import { authMiddleware } from './infrastructure/web/middleware/auth'
import installmentRoutes from './infrastructure/web/routes/installment.routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/installments', authMiddleware, installmentRoutes)

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: 'ok',
      database: 'connected',
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    })
  } catch {
    res.status(500).json({ status: 'error', database: 'disconnected' })
  }
})

// Rotas públicas
app.use('/auth', authRoutes)

// Rotas protegidas
app.use('/transactions', authMiddleware, transactionRoutes)

// Handler global de erros
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message })
  }
  console.error(err)
  return res.status(500).json({ error: 'Erro interno do servidor.' })
})

app.listen(env.port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${env.port}`)
  console.log(`📋 Ambiente: ${env.nodeEnv}`)
})
