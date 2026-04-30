import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { LoginDTO } from '../../application/dto/CreateUserDTO'
import { IUserRepository } from '../../application/interfaces/IUserRepository'
import { AppError } from '../../shared/errors/AppError'
import { env } from '../../config/env'

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: LoginDTO): Promise<{ token: string; userId: string }> {
    const user = await this.userRepository.findByEmail(data.email)
    if (!user) throw new AppError('Credenciais inválidas.', 401)

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) throw new AppError('Credenciais inválidas.', 401)

    const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: '7d' })
    return { token, userId: user.id }
  }
}
