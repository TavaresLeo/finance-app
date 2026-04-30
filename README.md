# Finance App

App de controle financeiro pessoal com Node.js, TypeScript e PostgreSQL.

## Stack
- Node.js + TypeScript
- Express
- PostgreSQL
- Prisma v7
- Zod v3
- JWT + bcryptjs
- Clean Architecture

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 3. Gerar Prisma Client
npx prisma generate

# 4. Criar tabelas
npx prisma migrate dev --name init

# 5. Rodar em desenvolvimento
npm run dev
```

## Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /health | ❌ | Status da API |
| POST | /auth/register | ❌ | Cadastro |
| POST | /auth/login | ❌ | Login |
| POST | /transactions | ✅ | Criar transação |
| GET | /transactions | ✅ | Listar transações |

## Autenticação

Todas as rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```

O token é retornado no login.
