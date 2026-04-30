import bcrypt from 'bcryptjs'
import { User } from '../entities/User'
import { CreateUserDTO } from '../../application/dto/CreateUserDTO'
import { IUserRepository } from '../../application/interfaces/IUserRepository'
import { AppError } from '../../shared/errors/AppError'

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<Omit<User, 'password'>> {
    const existing = await this.userRepository.findByEmail(data.email)
    if (existing) throw new AppError('E-mail já cadastrado.', 409)

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await this.userRepository.create({ ...data, password: hashedPassword })

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
