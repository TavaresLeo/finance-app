
cat > /mnt/user-data/outputs/README.md << 'EOF'
# 💰 Finance App

> Aplicativo pessoal de controle financeiro com atualização em tempo real, construído com Clean Architecture.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)

---

## 📱 Demonstração

| Dashboard | Transações | Investimentos |
|---|---|---|
| Saldo em tempo real | Crédito e débito | Preço médio ponderado |
| Entradas e saídas | Parcelamentos | STOCK, ETF, CDI, CRYPTO |

---

## 🎯 Problema Resolvido

Controle financeiro pessoal centralizado em um único app — sem planilhas, sem apps genéricos. O sistema registra transações, calcula saldo automaticamente, gerencia parcelamentos e acompanha investimentos com cálculo de preço médio ponderado.

---

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com separação clara de responsabilidades:

```
src/
├── domain/          → Entidades e regras de negócio puras
├── application/     → DTOs, interfaces e contratos
├── infrastructure/  → Banco de dados, HTTP, serviços externos
└── shared/          → Erros e utilitários compartilhados
```

### Fluxo de dados

```
HTTP Request
    ↓
Middleware (JWT + Rate Limit + Helmet)
    ↓
Controller (valida com Zod)
    ↓
Use Case (regras de negócio)
    ↓
Repository (acesso ao banco via Prisma)
    ↓
Response JSON + Evento Socket.io
    ↓
Frontend atualiza em tempo real
```

---

## 🚀 Stack Tecnológica

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + TypeScript | Runtime e tipagem estática |
| Express | Framework HTTP |
| PostgreSQL | Banco de dados relacional |
| Prisma v7 | ORM com migrations |
| Zod | Validação de schemas |
| JWT + bcryptjs | Autenticação e criptografia |
| Socket.io | Comunicação em tempo real |
| Helmet | Headers de segurança HTTP |
| express-rate-limit | Proteção contra brute force |

### Frontend
| Tecnologia | Uso |
|---|---|
| React Native | App mobile multiplataforma |
| Expo | Build e desenvolvimento |
| Expo Router | Navegação baseada em arquivos |
| Axios | Cliente HTTP com interceptors |
| AsyncStorage | Persistência local do token |
| Context API | Estado global de autenticação |

---

## ✨ Funcionalidades

### Autenticação
- Cadastro com senha criptografada (bcrypt)
- Login com token JWT (7 dias)
- Sessão persistente no dispositivo
- Proteção de rotas no backend e frontend

### Transações
- Registro de crédito e débito
- Atualização automática do saldo da conta
- Validação de saldo insuficiente
- Histórico completo por usuário

### Parcelamentos
- Compra parcelada em até 48x
- Geração automática de N parcelas com datas mensais
- Controle de parcelas pagas/pendentes

### Investimentos
- Suporte a STOCK, ETF, CDI e CRYPTO
- Cálculo automático de preço médio ponderado
- Consolidação de posições por ativo
- Resumo do portfólio com total investido

### Tempo Real
- Eventos Socket.io ao criar transações
- Usuários recebem apenas seus próprios eventos (salas privadas)
- Estrutura preparada para escalar

### Segurança
- Headers HTTP protegidos (Helmet)
- Rate limiting geral (100 req/15min)
- Rate limiting de auth (10 tentativas/15min)
- Sanitização contra prototype pollution
- Log de auditoria de ações sensíveis
- Validação de entrada com Zod em todas as rotas

---

## 📡 Endpoints da API

### Auth
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Cadastro |
| POST | `/auth/login` | ❌ | Login + JWT |
| GET | `/health` | ❌ | Status da API |

### Transações
| Método | Rota | Descrição |
|---|---|---|
| POST | `/transactions` | Criar transação |
| GET | `/transactions` | Listar transações |

### Parcelamentos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/installments` | Criar compra parcelada |
| GET | `/installments/pending` | Parcelas pendentes |
| PATCH | `/installments/:id/pay` | Marcar como paga |

### Investimentos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/investments` | Comprar ativo |
| GET | `/investments` | Portfólio completo |
| DELETE | `/investments/:asset` | Remover posição |

---

## 🗄️ Modelagem do Banco

```
User ──────┬── Account ── Transaction ── Installment
           ├── Transaction
           └── Investment
```

**Decisões de modelagem:**
- `Account` separado de `User` — suporte a múltiplas contas bancárias
- `Installment` separado de `Transaction` — uma compra gera N parcelas independentes
- `averagePrice` em `Investment` — cálculo de ROI sem histórico de preços
- `balance` em `Account` — atualizado a cada transação para performance

---

## 🔧 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL 16+

### Backend

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/finance-app.git
cd finance-app

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Gere o Prisma Client
npx prisma generate

# Execute as migrations
npx prisma migrate dev --name init

# Rode o servidor
npm run dev
```

### Frontend

```bash
git clone https://github.com/seu-usuario/finance-app-mobile.git
cd finance-app-mobile

# Instale as dependências
npm install

# Edite o IP em services/api.ts
# const BASE_URL = 'http://SEU_IP:3000'

# Rode o app
npx expo start
```

---

## 🗺️ Roadmap

### Fase 2
- [ ] Integração com Open Finance (Pluggy/Belvo)
- [ ] Sincronização automática de transações bancárias
- [ ] Notificações de parcelas próximas do vencimento
- [ ] Gráficos de evolução financeira

### Fase 3
- [ ] IA para categorização automática de gastos
- [ ] Insights financeiros personalizados
- [ ] Sincronização de cotações em tempo real
- [ ] Exportação de relatórios em PDF

---

## 🎓 Aprendizados

Este projeto foi desenvolvido como parte do portfólio de desenvolvimento Full Stack, aplicando na prática:

- **Clean Architecture** com separação real de camadas
- **TypeScript** com tipagem estrita em toda a aplicação
- **WebSockets** para comunicação bidirecional em tempo real
- **JWT** para autenticação stateless e escalável
- **Prisma** como ORM moderno com migrations versionadas
- **Zod** para validação e inferência de tipos
- **React Native** com Expo para desenvolvimento mobile

---

## 👨‍💻 Autor

**Leo Tavares**
Estudante de Ciência da Computação | Desenvolvedor Full Stack

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/seu-usuario)
EOF
echo "README gerado!"
