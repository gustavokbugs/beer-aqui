# Backend Tasks - BeerAqui API

## Fase 1: Setup e Fundação ✅

### 1.1 Configuração Inicial do Projeto ✅
- [x] Inicializar projeto Node.js com TypeScript
- [x] Configurar tsconfig.json com strict mode
- [x] Configurar ESLint + Prettier
- [x] Configurar editorconfig
- [x] Criar estrutura de pastas (Clean Architecture)
  ```
  src/
  ├── domain/           # Entidades e regras de negócio
  ├── application/      # Casos de uso
  ├── infrastructure/   # Implementações técnicas
  │   ├── database/
  │   ├── http/
  │   └── services/
  └── presentation/     # Controllers e rotas
  ```
- [x] Configurar variáveis de ambiente (.env, .env.example)
- [x] Configurar Docker e Docker Compose
- [x] Adicionar .gitignore adequado

### 1.2 Setup do Banco de Dados ✅
- [x] Configurar PostgreSQL via Docker
- [x] Instalar e configurar migration tool (ex: TypeORM, Prisma ou Knex)
- [x] Habilitar extensão PostGIS para geolocalização
- [x] Criar script de inicialização do banco
- [x] Configurar connection pooling
- [x] Implementar health check do banco

### 1.3 Configuração de Qualidade e Testes ✅
- [x] Configurar Jest para testes unitários
- [x] Configurar Supertest para testes de integração
- [x] Configurar cobertura de testes (mínimo 80%)
- [x] Configurar Husky para pre-commit hooks
- [x] Configurar lint-staged
- [ ] Criar pipeline básico de CI

### 1.4 Configuração de Internacionalização ✅
- [x] Instalar biblioteca i18n (i18next ou similar)
- [x] Criar estrutura de arquivos de tradução
  ```
  src/locales/
  ├── pt-BR/
  │   ├── errors.json
  │   ├── validation.json
  │   └── emails.json
  ├── en/
  │   └── ...
  └── es/
      └── ...
  ```
- [x] Configurar detecção de idioma via header Accept-Language
- [x] Configurar fallback para pt-BR
- [x] Criar helper para tradução de mensagens de erro
- [x] Criar helper para tradução de emails
- [x] Configurar tradução de mensagens de validação

---

## Fase 2: Modelagem de Dados ✅

### 2.1 Criar Migrations - Entidades Base ✅
- [x] Migration: Tabela `users`
  - id (UUID)
  - name (VARCHAR)
  - email (VARCHAR UNIQUE)
  - password_hash (VARCHAR)
  - role (ENUM: CLIENT, VENDOR)
  - is_adult_confirmed (BOOLEAN)
  - email_verified (BOOLEAN)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
  - deleted_at (TIMESTAMP) - soft delete

- [x] Migration: Tabela `vendors`
  - id (UUID)
  - user_id (UUID FK)
  - company_name (VARCHAR)
  - cnpj (VARCHAR UNIQUE)
  - type (ENUM: bar, mercado, distribuidora)
  - location (GEOGRAPHY POINT) - PostGIS
  - address_street (VARCHAR)
  - address_number (VARCHAR)
  - address_city (VARCHAR)
  - address_state (VARCHAR)
  - address_zip (VARCHAR)
  - phone (VARCHAR)
  - is_verified (BOOLEAN)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

- [x] Migration: Tabela `products`
  - id (UUID)
  - vendor_id (UUID FK)
  - brand (VARCHAR)
  - volume (INTEGER) - em ML
  - price (DECIMAL)
  - is_active (BOOLEAN)
  - stock_quantity (INTEGER)
  - description (TEXT)
  - image_url (VARCHAR)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

- [x] Migration: Tabela `ads`
  - id (UUID)
  - product_id (UUID FK)
  - start_date (TIMESTAMP)
  - end_date (TIMESTAMP)
  - priority (INTEGER)
  - status (ENUM: active, expired, cancelled)
  - payment_status (ENUM: pending, paid, refunded)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

### 2.2 Criar Índices e Constraints ✅
- [x] Índice geoespacial em vendors.location
- [x] Índice composto (vendor_id, is_active) em products
- [x] Índice em ads (product_id, status, priority)
- [x] Índice em users.email (unique já cria índice)
- [x] Constraints de validação (ex: price > 0)

### 2.3 Seeds de Desenvolvimento ✅
- [x] Seed: Usuários de teste
- [x] Seed: Vendedores de teste com diferentes tipos
- [x] Seed: Produtos variados
- [x] Seed: Anúncios ativos e expirados

---

## Fase 3: Domain Layer (Entidades e Value Objects) ✅

### 3.1 Criar Entidades de Domínio ✅
- [x] Entity: User
  - Validações de email
  - Validação de idade (+18)
  - Métodos de domínio

- [x] Entity: Vendor
  - Validação de CNPJ
  - Validação de tipo
  - Cálculo de distância

- [x] Entity: Product
  - Validação de volume (valores permitidos)
  - Validação de preço
  - Ativação/desativação

- [x] Entity: Ad
  - Validação de período
  - Cálculo de status
  - Priorização

### 3.2 Criar Value Objects ✅
- [x] VO: Email
- [x] VO: CNPJ
- [x] VO: Location (latitude, longitude)
- [ ] VO: Money (price) - Usando Decimal do Prisma
- [ ] VO: Volume - Usando enum/constantes

### 3.3 Criar Interfaces de Repositório (Ports)
- [ ] IUserRepository
- [ ] IVendorRepository
- [ ] IProductRepository
- [ ] IAdRepository

---

## Fase 4: Application Layer (Casos de Uso)

### 4.1 Casos de Uso - Autenticação
- [ ] Use Case: RegisterUser
  - Validar dados
  - Hash de senha (bcrypt)
  - Criar usuário
  - Enviar email de confirmação (preparar interface)

- [ ] Use Case: AuthenticateUser
  - Validar credenciais
  - Gerar JWT com refresh token
  - Registrar último acesso

- [ ] Use Case: RefreshToken
  - Validar refresh token
  - Gerar novo access token

- [ ] Use Case: ConfirmEmail
- [ ] Use Case: RequestPasswordReset
- [ ] Use Case: ResetPassword

### 4.2 Casos de Uso - Vendedor
- [ ] Use Case: CreateVendor
  - Validar CNPJ (algoritmo + API externa preparada)
  - Validar localização
  - Geocoding de endereço

- [ ] Use Case: UpdateVendor
- [ ] Use Case: GetVendorProfile
- [ ] Use Case: VerifyVendor (admin only)

### 4.3 Casos de Uso - Produtos
- [ ] Use Case: CreateProduct
  - Validar volume permitido
  - Validar preço
  - Upload de imagem (preparar interface)

- [ ] Use Case: UpdateProduct
- [ ] Use Case: UpdateProductPrice
- [ ] Use Case: ToggleProductStatus
- [ ] Use Case: DeleteProduct (soft delete)
- [ ] Use Case: ListVendorProducts

### 4.4 Casos de Uso - Busca
- [ ] Use Case: SearchProductsByLocation
  - Query geoespacial (PostGIS)
  - Filtros (marca, preço, volume)
  - Ordenação (anúncios prioritários)
  - Paginação

- [ ] Use Case: GetProductDetails
- [ ] Use Case: SearchProductsByBrand

### 4.5 Casos de Uso - Anúncios
- [ ] Use Case: CreateAd
  - Validar período
  - Validar produto
  - Criar registro de pagamento

- [ ] Use Case: ListActiveAds
- [ ] Use Case: CancelAd
- [ ] Use Case: ExpireAds (job automático)

---

## Fase 5: Infrastructure Layer

### 5.1 Implementar Repositórios
- [ ] Repository: UserRepository (TypeORM/Prisma)
- [ ] Repository: VendorRepository (com queries geoespaciais)
- [ ] Repository: ProductRepository
- [ ] Repository: AdRepository

### 5.2 Implementar Serviços de Infraestrutura
- [ ] Service: HashService (bcrypt)
- [ ] Service: TokenService (JWT)
- [ ] Service: EmailService (interface + mock)
- [ ] Service: StorageService (upload de imagens - S3/local)
- [ ] Service: CNPJValidatorService (interface + mock API)
- [ ] Service: GeocodingService (Google Maps API/Nominatim)
- [ ] Service: TranslationService (i18n)

### 5.3 Middleware e Segurança
- [ ] Middleware: Authentication
- [ ] Middleware: Authorization (role-based)
- [ ] Middleware: Locale detection (Accept-Language header)
- [ ] Middleware: Rate limiting
- [ ] Middleware: Error handling (com mensagens traduzidas)
- [ ] Middleware: Request validation (Zod/Joi com mensagens traduzidas)
- [ ] Middleware: Logging
- [ ] Middleware: CORS configurado
- [ ] Middleware: Helmet (security headers)

---

## Fase 6: Presentation Layer (API REST)

### 6.1 Controllers - Auth
- [ ] POST /api/v1/auth/register
- [ ] POST /api/v1/auth/login
- [ ] POST /api/v1/auth/refresh
- [ ] POST /api/v1/auth/confirm-email
- [ ] POST /api/v1/auth/forgot-password
- [ ] POST /api/v1/auth/reset-password

### 6.2 Controllers - Users
- [ ] GET /api/v1/users/me
- [ ] PUT /api/v1/users/me
- [ ] DELETE /api/v1/users/me

### 6.3 Controllers - Vendors
- [ ] POST /api/v1/vendors
- [ ] GET /api/v1/vendors/:id
- [ ] PUT /api/v1/vendors/:id
- [ ] GET /api/v1/vendors/me

### 6.4 Controllers - Products
- [ ] POST /api/v1/products
- [ ] GET /api/v1/products/:id
- [ ] PUT /api/v1/products/:id
- [ ] PATCH /api/v1/products/:id/price
- [ ] PATCH /api/v1/products/:id/status
- [ ] DELETE /api/v1/products/:id
- [ ] GET /api/v1/vendors/:vendorId/products

### 6.5 Controllers - Search
- [ ] GET /api/v1/search/products (geolocalização + filtros)
- [ ] GET /api/v1/search/brands (autocomplete)

### 6.6 Controllers - Ads
- [ ] POST /api/v1/ads
- [ ] GET /api/v1/ads
- [ ] DELETE /api/v1/ads/:id

### 6.7 Documentação da API
- [ ] Configurar Swagger/OpenAPI
- [ ] Documentar todos os endpoints
- [ ] Exemplos de request/response
- [ ] Documentar códigos de erro

---

## Fase 7: Features Avançadas

### 7.1 Cache e Performance
- [ ] Implementar Redis para cache
- [ ] Cache de busca geolocalizada
- [ ] Cache de produtos populares
- [ ] Invalidação de cache inteligente

### 7.2 Background Jobs
- [ ] Configurar sistema de filas (Bull/BullMQ)
- [ ] Job: Expirar anúncios
- [ ] Job: Enviar emails (com suporte a múltiplos idiomas)
- [ ] Job: Limpar dados antigos

### 7.3 Monitoramento e Observabilidade
- [ ] Implementar logging estruturado (Winston/Pino)
- [ ] Configurar APM (Application Performance Monitoring)
- [ ] Metrics endpoint (/metrics)
- [ ] Health check endpoint (/health)
- [ ] Alertas de erro

### 7.4 Segurança Adicional
- [ ] Implementar 2FA (preparar interface)
- [ ] Audit log de ações sensíveis
- [ ] Proteção contra SQL injection
- [ ] Proteção contra XSS
- [ ] Sanitização de inputs

---

## Fase 8: Testes

### 8.1 Testes Unitários
- [ ] Testes de entidades de domínio
- [ ] Testes de value objects
- [ ] Testes de casos de uso
- [ ] Testes de validações

### 8.2 Testes de Integração
- [ ] Testes de repositórios
- [ ] Testes de endpoints
- [ ] Testes de autenticação
- [ ] Testes de autorização

### 8.3 Testes E2E
- [ ] Fluxo completo de cadastro
- [ ] Fluxo de busca geolocalizada
- [ ] Fluxo de criação de anúncios

---

## Fase 9: DevOps e Deploy

### 9.1 Containerização
- [ ] Dockerfile otimizado (multi-stage build)
- [ ] Docker Compose para desenvolvimento
- [ ] Docker Compose para produção

### 9.2 CI/CD
- [ ] Pipeline de testes
- [ ] Pipeline de build
- [ ] Pipeline de deploy
- [ ] Verificação de cobertura de testes
- [ ] Análise de código estático

### 9.3 Ambiente de Produção
- [ ] Configurar variáveis de ambiente
- [ ] Configurar secrets management
- [ ] Configurar backup automático do banco
- [ ] Configurar SSL/TLS
- [ ] Configurar load balancer (preparar)

---

## Fase 10: Documentação e Handover

### 10.1 Documentação Técnica
- [ ] README.md completo
- [ ] Guia de instalação
- [ ] Guia de desenvolvimento
- [ ] Arquitetura e diagramas
- [ ] ADRs (Architecture Decision Records)

### 10.2 Documentação Operacional
- [ ] Guia de deploy
- [ ] Guia de troubleshooting
- [ ] Runbook de incidentes
- [ ] Procedimentos de backup/restore

---

## Checklist Final

- [ ] Todas as rotas documentadas no Swagger
- [ ] Cobertura de testes > 80%
- [ ] Zero vulnerabilidades críticas
- [ ] Todas as migrations versionadas
- [ ] Logging configurado
- [ ] Monitoramento ativo
- [ ] Backup automático configurado
- [ ] Rate limiting configurado
- [ ] CORS configurado corretamente
- [ ] Validação de todos os inputs
- [ ] Tratamento de erros padronizado
- [ ] Secrets não commitados
- [ ] Docker funcionando
- [ ] CI/CD operacional
- [ ] i18n configurado (pt-BR, en, es)
- [ ] Mensagens de erro traduzidas
- [ ] Emails com templates multilíngue
- [ ] API aceita header Accept-Language
- [ ] Documentação da API em inglês
