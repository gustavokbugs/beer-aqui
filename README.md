# 🍺 BeerAqui

Aplicação full-stack para localização e compra de cervejas próximas ao usuário.

## 📋 Visão Geral

BeerAqui é um marketplace de cervejas que conecta consumidores a vendedores próximos, utilizando geolocalização para facilitar a busca e compra de bebidas.

### Tecnologias

**Backend:**
- Node.js + TypeScript
- Express.js
- PostgreSQL + PostGIS
- Redis (cache)
- Docker & Docker Compose

**Frontend:**
- React Native + Expo
- TypeScript
- Zustand (state management)
- React Navigation
- i18n (pt-BR, en, es)

## 🚀 Como Iniciar os Projetos

### Pré-requisitos

- Node.js 18+ e npm/yarn
- Docker e Docker Compose
- Expo Go (app mobile para testes)

### 1. Backend

```bash
# Navegar para o diretório do backend
cd backend

# Instalar dependências
npm install

# Iniciar containers Docker (PostgreSQL + Redis)
docker-compose up -d

# Executar migrations
npm run migrate

# (Opcional) Popular banco com dados de exemplo
npm run seed

# Iniciar servidor de desenvolvimento
npm run dev
```

O backend estará rodando em: **http://localhost:3000**

API disponível em: **http://localhost:3000/api/v1**

#### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Principais variáveis:
- `NODE_ENV` - development, staging ou production
- `PORT` - Porta do servidor (padrão: 3000)
- `DATABASE_URL` - URL de conexão PostgreSQL
- `REDIS_URL` - URL de conexão Redis
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_REFRESH_SECRET` - Chave secreta para refresh token

### 2. Frontend

```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar Expo Metro Bundler
npm start
```

O Expo exibirá um QR Code. Escaneie com:
- **Android**: Expo Go app
- **iOS**: App Camera nativo

#### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure a URL da API:

```
API_URL=http://localhost:3000/api/v1
```

> **Nota**: Para testes em dispositivo físico, use o IP da sua máquina ao invés de `localhost`

## 📱 Funcionalidades

- ✅ Autenticação de usuários (JWT)
- ✅ Busca de produtos por geolocalização
- ✅ Filtros por marca, preço, volume
- ✅ Mapa interativo com vendedores
- ✅ Sistema de favoritos
- ✅ Perfil de usuário
- ✅ Multi-idioma (pt-BR, en, es)
- ✅ Cache com Redis
- ✅ Sistema de refresh token automático

## 🗄️ Banco de Dados

Para informações sobre como conectar no banco de dados usando DBeaver, consulte:

📄 **[DATABASE_CONNECTION.md](./DATABASE_CONNECTION.md)**

## 📚 Documentação da API

Com o backend rodando, acesse a documentação interativa:

**Swagger UI**: http://localhost:3000/api/v1/docs

### Principais Endpoints

#### Autenticação
- `POST /api/v1/auth/register` - Criar conta
- `POST /api/v1/auth/login` - Fazer login
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/logout` - Fazer logout

#### Produtos
- `GET /api/v1/products/search` - Buscar produtos por geolocalização
- `GET /api/v1/products/:id` - Obter detalhes do produto
- `GET /api/v1/products/brand/:brand` - Buscar por marca
- `GET /api/v1/products/vendor/:vendorId` - Produtos de um vendedor

#### Vendedores
- `GET /api/v1/vendors/nearby` - Buscar vendedores próximos

#### Usuário
- `GET /api/v1/users/profile` - Obter perfil
- `PUT /api/v1/users/profile` - Atualizar perfil

## 🧪 Testes

```bash
# Backend
cd backend
npm test
npm run test:watch
npm run test:coverage

# Frontend
cd frontend
npm test
```

## 🐳 Docker

### Parar containers

```bash
cd backend
docker-compose down
```

### Limpar volumes

```bash
docker-compose down -v
```

### Ver logs

```bash
docker-compose logs -f postgres
docker-compose logs -f redis
```

## 📁 Estrutura do Projeto

```
beer-aqui/
├── backend/           # API REST Node.js
│   ├── src/
│   │   ├── domain/        # Entidades e lógica de negócio
│   │   ├── application/   # Casos de uso
│   │   ├── infrastructure/ # Repositórios, cache, JWT
│   │   └── presentation/  # Controllers e rotas
│   ├── prisma/            # Schema e migrations
│   └── docker-compose.yml
├── frontend/          # App React Native
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── screens/       # Telas do app
│   │   ├── navigation/    # Configuração de navegação
│   │   ├── services/      # Integração com API
│   │   ├── store/         # Zustand stores
│   │   ├── locales/       # Traduções i18n
│   │   └── theme/         # Tema e estilos
│   └── assets/
└── context/           # Documentação do projeto
```

## 🔧 Scripts Úteis

### Backend

```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run start        # Iniciar produção
npm run migrate      # Executar migrations
npm run seed         # Popular banco de dados
npm run lint         # Verificar código
npm run format       # Formatar código
```

### Frontend

```bash
npm start            # Iniciar Expo
npm run android      # Abrir no Android
npm run ios          # Abrir no iOS
npm run web          # Abrir no navegador
```

## 🌍 Ambientes

- **Development**: Desenvolvimento local
- **Staging**: Testes pré-produção
- **Production**: Ambiente de produção

Configure através da variável `NODE_ENV` no `.env`

## 👥 Usuários

- **Cliente**: Busca cerveja por localização, compara preços
- **Vendedor**: Cadastra estabelecimento e produtos

## 🔒 Requisitos

- Usuário deve confirmar +18 anos
- Permissão de localização obrigatória
- CNPJ válido para vendedores

## 📄 Licença

Este projeto foi desenvolvido como teste técnico.

---

**Happy Coding! 🍺**

MIT
