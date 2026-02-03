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

## Fase 4: Application Layer (Casos de Uso) ✅ COMPLETA

### 4.1 Casos de Uso - Autenticação ✅
- [x] Use Case: RegisterUser (com testes)
  - Validar dados
  - Hash de senha (bcrypt)
  - Criar usuário
  - Enviar email de confirmação (preparar interface)

- [x] Use Case: AuthenticateUser (com testes)
  - Validar credenciais
  - Gerar JWT com refresh token
  - Registrar último acesso

- [x] Use Case: RefreshToken
  - Validar refresh token
  - Gerar novo access token

- [x] Use Case: ConfirmEmail
- [x] Use Case: RequestPasswordReset
- [x] Use Case: ResetPassword

### 4.2 Casos de Uso - Vendedor ✅
- [x] Use Case: CreateVendor (com testes)
  - Validar CNPJ (algoritmo + API externa preparada)
  - Validar localização
  - Geocoding de endereço

- [x] Use Case: SearchNearbyVendors
  - Query geoespacial
  - Filtros por tipo e verificação

- [x] Use Case: UpdateVendor
- [x] Use Case: GetVendorProfile
- [x] Use Case: VerifyVendor (admin only)

### 4.3 Casos de Uso - Produtos ✅
- [x] Use Case: CreateProduct
  - Validar volume permitido
  - Validar preço
  - Upload de imagem (preparar interface)

- [x] Use Case: SearchProducts (com testes)
  - Filtros (marca, preço, volume)
  - Paginação

- [x] Use Case: UpdateProduct
- [x] Use Case: UpdateProductPrice
- [x] Use Case: ToggleProductStatus
- [x] Use Case: DeleteProduct (soft delete)
- [x] Use Case: ListVendorProducts

### 4.4 Casos de Uso - Busca ✅
- [x] Use Case: SearchProductsByLocation (via SearchNearbyVendors)
  - Query geoespacial (PostGIS)
  - Filtros (marca, preço, volume)
  - Ordenação (anúncios prioritários)
  - Paginação

- [x] Use Case: GetProductDetails
- [x] Use Case: SearchProductsByBrand

### 4.5 Casos de Uso - Anúncios ✅
- [x] Use Case: CreateAd
  - Validar período
  - Validar produto
  - Criar registro de pagamento

- [x] Use Case: ListActiveAds

- [x] Use Case: CancelAd (com reembolso)
- [x] Use Case: ExpireAds (job automático)

**Total: 22 Use Cases implementados + 4 suítes de testes**

---

## Fase 5: Infrastructure Layer ✅ COMPLETA

### 5.1 Implementar Repositórios ✅
- [x] Repository: UserRepository (Prisma)
  - Mapeamento completo entre domínio e Prisma
  - findById, findByEmail, save, update

- [x] Repository: VendorRepository (com queries geoespaciais)
  - Queries PostGIS (ST_DWithin, ST_Distance)
  - Parse de coordenadas WKT
  - Busca por proximidade otimizada

- [x] Repository: ProductRepository
  - Busca com múltiplos filtros
  - Paginação eficiente
  - findById, findByVendorId, search, save, update

- [x] Repository: AdRepository
  - Queries por status e produto
  - findById, findByStatus, findActiveByProduct, save, update

### 5.2 Implementar Serviços de Infraestrutura ✅
- [x] Service: BcryptHashService
  - Implementação de IHashService
  - Salt rounds configurável (padrão: 10)
  - hash() e compare()

- [x] Service: JwtTokenService
  - Implementação de ITokenService
  - Access token (15min) e Refresh token (7 dias)
  - Secrets separados
  - generateAccessToken, generateRefreshToken, verify methods

- [x] Service: PrismaService
  - Singleton pattern
  - Connection pooling automático
  - Health check
  - Logs configuráveis por ambiente

- [x] DIContainer
  - Injeção de dependências centralizada
  - Lazy initialization
  - 22 use cases configurados
  - Métodos de ciclo de vida (initialize, shutdown, healthCheck)

- [ ] Service: EmailService (interface + mock)
- [ ] Service: StorageService (upload de imagens - S3/local)
- [ ] Service: CNPJValidatorService (interface + mock API)
- [ ] Service: GeocodingService (Google Maps API/Nominatim)

---

## Fase 6: Presentation Layer (Controllers & Routes) ✅ COMPLETA

### 6.1 Criar Middlewares ✅
- [x] Middleware de autenticação JWT
- [x] Middleware de autorização por role
- [x] Middleware de validação (Zod schemas)
- [x] Middleware de tratamento de erros
- [x] Middleware de logging (Morgan)

### 6.2 Criar Controllers ✅
- [x] AuthController (register, login, refresh, confirmEmail, forgotPassword, resetPassword)
- [x] VendorController (create, getProfile, update, searchNearby, verify)
- [x] ProductController (create, getDetails, update, updatePrice, toggleStatus, delete, search, listByVendor, searchByBrand)
- [x] AdController (create, listActive, cancel, expire)

### 6.3 Criar Rotas ✅
- [x] Rotas de autenticação (/api/v1/auth/*)
- [x] Rotas de vendedor (/api/v1/vendors/*)
- [x] Rotas de produto (/api/v1/products/*)
- [x] Rotas de anúncio (/api/v1/ads/*)
- [x] Health check endpoints
- [x] Configurar versioning de API (v1)

### 6.4 Configurar Express App ✅
- [x] Criar classe App com configurações
- [x] Configurar servidor com graceful shutdown
- [x] Integrar DIContainer com rotas
- [x] Configurar CORS e security headers (Helmet)
- [x] Configurar body parser
- [x] Configurar logging (Morgan)
- [x] Error handling centralizado

### 6.5 Schemas de Validação ✅
- [x] Auth schemas (register, login, refresh, etc.)
- [x] Validação com Zod
- [x] Mensagens de erro customizadas

---

## Fase 7: Features Avançadas

### 7.1 Cache e Performance ✅ COMPLETA
- [x] Implementar Redis para cache
- [x] Cache de busca geolocalizada
- [x] Cache de produtos populares
- [x] Invalidação de cache inteligente
- [x] Middleware HTTP cache
- [x] Cache helpers e constantes
- [x] Integração com DIContainer

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
