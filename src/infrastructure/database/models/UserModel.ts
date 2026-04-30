import { prisma } from '../../../config/database'
import { User } from '../../../domain/entities/User'
import { CreateUserData, IUserRepository } from '../../../application/interfaces/IUserRepository'

export class UserModel implements IUserRepository {
  async create(data: CreateUserData): Promise<User> {
    const user = await prisma.user.create({ data })
    return user as User
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    return user as User | null
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } })
    return user as User | null
  }
}
