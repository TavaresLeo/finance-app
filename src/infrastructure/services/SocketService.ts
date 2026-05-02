import { Server as HttpServer } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'

class SocketService {
  private io: SocketServer | null = null

  initialize(httpServer: HttpServer): void {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    })

    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Cliente conectado: ${socket.id}`)

      // Usuário entra na sala pessoal dele
      socket.on('join', (userId: string) => {
        socket.join(userId)
        console.log(`👤 Usuário ${userId} entrou na sala`)
      })

      socket.on('disconnect', () => {
        console.log(`❌ Cliente desconectado: ${socket.id}`)
      })
    })
  }

  // Emite evento para um usuário específico
  emitToUser(userId: string, event: string, data: unknown): void {
    if (!this.io) return
    this.io.to(userId).emit(event, data)
  }

  // Emite evento para todos conectados
  emitToAll(event: string, data: unknown): void {
    if (!this.io) return
    this.io.emit(event, data)
  }
}

// Singleton — mesma instância em toda a aplicação
export const socketService = new SocketService()