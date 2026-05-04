import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { LoginDTO } from '../../application/dto/CreateUserDTO'
import { IUserRepository } from '../../application/interfaces/IUserRepository'
import { AppError } from '../../shared/errors/AppError'
import { env } from '../../config/env'

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: LoginDTO): Promise<{ token: string; userId: string }> {
  console.log('Buscando usuário:', data.email)
  const user = await this.userRepository.findByEmail(data.email)
  console.log('Usuário encontrado:', user ? 'sim' : 'não')
  
  if (!user) throw new AppError('Credenciais inválidas.', 401)

  console.log('Comparando senha...')
  const passwordMatch = await bcrypt.compare(data.password, user.password)
  console.log('Senha correta:', passwordMatch)
  
  if (!passwordMatch) throw new AppError('Credenciais inválidas.', 401)

  const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: '7d' })
  console.log('Token gerado, retornando...')
  return { token, userId: user.id }
}
}
