# BeerAqui API

> REST API para encontrar cerveja gelada perto de você

## 🚀 Quick Start

### Pré-requisitos
- Node.js >= 18
- Docker e Docker Compose
- npm >= 9

### Instalação

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar banco de dados
docker-compose up -d postgres redis

# Rodar migrations
npm run migrate:dev

# Iniciar servidor de desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── domain/              # Entidades e regras de negócio
│   ├── entities/
│   ├── value-objects/
│   └── repositories/
├── application/         # Casos de uso
│   ├── use-cases/
│   └── dtos/
├── infrastructure/      # Implementações técnicas
│   ├── database/
│   ├── http/
│   └── services/
├── presentation/        # Controllers e rotas
│   ├── controllers/
│   ├── routes/
│   └── middlewares/
└── config/             # Configurações
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento com hot reload
npm run build            # Build para produção
npm start                # Iniciar produção
npm run lint             # Verificar código
npm run lint:fix         # Corrigir problemas de lint
npm run format           # Formatar código
npm test                 # Rodar testes
npm run test:coverage    # Testes com cobertura
npm run migrate:dev      # Rodar migrations (dev)
npm run migrate:deploy   # Rodar migrations (prod)
```

## 🐳 Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar serviços
docker-compose down

# Rebuild
docker-compose up -d --build
```

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

## 📝 Variáveis de Ambiente

Ver arquivo `.env.example` para todas as variáveis disponíveis.

## 🏗️ Arquitetura

Este projeto segue os princípios da **Clean Architecture**:

- **Domain Layer**: Entidades de negócio e value objects
- **Application Layer**: Casos de uso e lógica de aplicação
- **Infrastructure Layer**: Implementações de repositórios e serviços externos
- **Presentation Layer**: Controllers, rotas e middlewares HTTP

## 📚 Documentação da API

Após iniciar o servidor, a documentação Swagger estará disponível em:
`http://localhost:3000/api-docs` (em breve)

## 🔒 Segurança

- Helmet para headers de segurança
- CORS configurável
- Rate limiting
- Validação de inputs com Zod
- JWT para autenticação

## 📄 Licença

MIT
