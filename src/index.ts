import http from 'http'
import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { prisma } from './config/database'
import { AppError } from './shared/errors/AppError'
import { socketService } from './infrastructure/services/SocketService'
import authRoutes from './infrastructure/web/routes/auth.routes'
import transactionRoutes from './infrastructure/web/routes/transaction.routes'
import installmentRoutes from './infrastructure/web/routes/installment.routes'
import investmentRoutes from './infrastructure/web/routes/investment.routes'
import { authMiddleware } from './infrastructure/web/middleware/auth'

const app = express()
const httpServer = http.createServer(app)

// Inicializa Socket.io
socketService.initialize(httpServer)

app.use(cors())
app.use(express.json())

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
app.use('/installments', authMiddleware, installmentRoutes)
app.use('/investments', authMiddleware, investmentRoutes)

// Handler global de erros
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message })
  }
  console.error(err)
  return res.status(500).json({ error: 'Erro interno do servidor.' })
})

// Usa httpServer em vez de app.listen
httpServer.listen(env.port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${env.port}`)
  console.log(`🔌 Socket.io ativo`)
  console.log(`📋 Ambiente: ${env.nodeEnv}`)
})