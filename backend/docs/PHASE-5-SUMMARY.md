# Fase 5: Infrastructure Layer - COMPLETA ✅

## Resumo da Implementação

A Fase 5 implementou toda a camada de infraestrutura, conectando a lógica de negócio (Application Layer) com tecnologias concretas como Prisma ORM, bcrypt e JWT.

## Estrutura Criada

```
src/infrastructure/
├── database/
│   └── prisma.service.ts           # Singleton Prisma Client com health check
│
├── services/
│   ├── bcrypt-hash.service.ts      # Implementação de IHashService
│   └── jwt-token.service.ts        # Implementação de ITokenService
│
├── repositories/
│   ├── prisma-user.repository.ts   # Implementação de IUserRepository
│   ├── prisma-vendor.repository.ts # Implementação de IVendorRepository (com PostGIS)
│   ├── prisma-product.repository.ts# Implementação de IProductRepository
│   └── prisma-ad.repository.ts     # Implementação de IAdRepository
│
└── di-container.ts                 # Container de Injeção de Dependências
```

## Componentes Implementados

### 🔧 Infrastructure Services (3)

#### 1. BcryptHashService
```typescript
- hash(password: string): Promise<string>
- compare(password: string, hash: string): Promise<boolean>
- Salt rounds configurável (padrão: 10 via env)
```

**Características:**
- Implementa `IHashService`
- Salt rounds configurável via `BCRYPT_SALT_ROUNDS`
- Hashing assíncrono para não bloquear event loop
- Adequado para produção

#### 2. JwtTokenService
```typescript
- generateAccessToken(payload, expiresIn?): string
- generateRefreshToken(payload): string
- verifyAccessToken(token): TokenPayload | null
- verifyRefreshToken(token): TokenPayload | null
```

**Características:**
- Implementa `ITokenService`
- Access token: 15 minutos (configurável)
- Refresh token: 7 dias (configurável)
- Secrets separados para cada tipo
- Retorna `null` em vez de lançar erro na verificação

#### 3. PrismaService
```typescript
- getInstance(): PrismaService (Singleton)
- connect(): Promise<void>
- disconnect(): Promise<void>
- healthCheck(): Promise<boolean>
```

**Características:**
- Pattern Singleton para única instância
- Connection pooling automático
- Logs configuráveis por ambiente:
  - Development: query, error, warn
  - Production: apenas error
- Health check via `SELECT 1`

### 📦 Repositories (4)

#### 1. PrismaUserRepository

**Métodos Implementados:**
```typescript
- findById(id: string): Promise<User | null>
- findByEmail(email: Email): Promise<User | null>
- save(user: User): Promise<User>
- update(user: User): Promise<User>
```

**Mapeamento:**
- Domain Entity ↔️ Prisma Model
- Email Value Object ↔️ string
- UserRole enum preservado
- Datas opcionais tratadas (emailVerifiedAt, deletedAt)

#### 2. PrismaVendorRepository

**Métodos Implementados:**
```typescript
- findById(id: string): Promise<Vendor | null>
- findByCNPJ(cnpj: CNPJ): Promise<Vendor | null>
- findNearby(location, radiusKm, type?): Promise<Vendor[]>
- save(vendor: Vendor): Promise<Vendor>
- update(vendor: Vendor): Promise<Vendor>
```

**Features Geoespaciais:**
```sql
-- Query PostGIS para busca por proximidade
SELECT * FROM "Vendor"
WHERE ST_DWithin(
  location::geography,
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
  radiusMeters
)
ORDER BY ST_Distance(...)
```

**Mapeamento Espacial:**
- `ST_MakePoint(lon, lat)` para criar geometria
- `ST_SetSRID(..., 4326)` para definir sistema de coordenadas (WGS84)
- Parse de WKT: `"POINT(lon lat)"` → Location value object
- Conversão km → metros (radiusKm * 1000)

#### 3. PrismaProductRepository

**Métodos Implementados:**
```typescript
- findById(id: string): Promise<Product | null>
- findByVendorId(vendorId, page, limit): Promise<{products, total}>
- search(filters, page, limit): Promise<{products, total}>
- save(product: Product): Promise<Product>
- update(product: Product): Promise<Product>
```

**Filtros de Busca:**
- `vendorId`: produtos de um vendedor específico
- `brand`: busca case-insensitive por marca
- `volumeMl`: volume exato
- `minPrice/maxPrice`: faixa de preço
- `isActive`: apenas produtos ativos

**Paginação:**
- Usa `skip` e `take` do Prisma
- Retorna total de registros para calcular páginas
- Ordenação por `createdAt DESC`

#### 4. PrismaAdRepository

**Métodos Implementados:**
```typescript
- findById(id: string): Promise<Ad | null>
- findByStatus(status: AdStatus): Promise<Ad[]>
- findActiveByProduct(productId: string): Promise<Ad[]>
- save(ad: Ad): Promise<Ad>
- update(ad: Ad): Promise<Ad>
```

**Características:**
- Queries otimizadas por status
- Ordenação por prioridade (DESC)
- Suporte a múltiplos anúncios por produto

### 🏗️ Dependency Injection Container

**DIContainer** - Container centralizado com ~40 métodos

#### Serviços Base:
```typescript
DIContainer.getPrismaService()
DIContainer.getHashService()
DIContainer.getTokenService()
```

#### Repositories:
```typescript
DIContainer.getUserRepository()
DIContainer.getVendorRepository()
DIContainer.getProductRepository()
DIContainer.getAdRepository()
```

#### Use Cases (22 total):
```typescript
// Auth
DIContainer.getRegisterUserUseCase()
DIContainer.getAuthenticateUserUseCase()
DIContainer.getRefreshTokenUseCase()
DIContainer.getConfirmEmailUseCase()
DIContainer.getRequestPasswordResetUseCase()
DIContainer.getResetPasswordUseCase()

// Vendor
DIContainer.getCreateVendorUseCase()
DIContainer.getUpdateVendorUseCase()
DIContainer.getGetVendorProfileUseCase()
DIContainer.getSearchNearbyVendorsUseCase()
DIContainer.getVerifyVendorUseCase()

// Product (9 use cases)
DIContainer.getCreateProductUseCase()
// ... etc

// Ad (4 use cases)
DIContainer.getCreateAdUseCase()
// ... etc
```

#### Lifecycle Management:
```typescript
// Inicialização
await DIContainer.initialize()  // Conecta ao banco

// Health Check
const health = await DIContainer.healthCheck()
// { database: true, services: true }

// Shutdown gracioso
await DIContainer.shutdown()  // Desconecta do banco
```

**Pattern Utilizado:**
- Singleton para cada dependência
- Lazy initialization (só cria quando necessário)
- Todas as dependências configuradas automaticamente

## Configuração de Ambiente

### Variáveis Adicionadas ao .env.example:

```env
# JWT
JWT_ACCESS_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=10
```

## Mapeamento Domain ↔ Infrastructure

### Exemplo: User

**Domain Entity (User):**
```typescript
{
  id: string
  name: string
  email: Email  // Value Object
  passwordHash: string
  role: UserRole  // Enum
  isAdultConfirmed: boolean
  emailVerified: boolean
  emailVerifiedAt?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

**Prisma Model:**
```prisma
model User {
  id               String    @id @default(uuid())
  name             String
  email            String    @unique
  passwordHash     String
  role             String
  isAdultConfirmed Boolean
  emailVerified    Boolean   @default(false)
  emailVerifiedAt  DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  deletedAt        DateTime?
}
```

**Mapeamento no Repository:**
```typescript
// Domain → Prisma (save)
await this.prisma.user.create({
  data: {
    id: user.id,
    name: user.name,
    email: user.email.getValue(),  // Value Object → string
    // ...
  }
})

// Prisma → Domain (reconstitute)
return User.reconstitute({
  id: raw.id,
  name: raw.name,
  email: Email.create(raw.email),  // string → Value Object
  // ...
})
```

## Queries Geoespaciais

### Busca de Vendedores Próximos

**Input:**
```typescript
location: Location { latitude: -23.5505, longitude: -46.6333 }
radiusKm: 5
type?: 'BAR' | 'MERCADO' | 'DISTRIBUIDORA'
```

**SQL Gerado:**
```sql
SELECT * FROM "Vendor"
WHERE ST_DWithin(
  location::geography,
  ST_SetSRID(ST_MakePoint(-46.6333, -23.5505), 4326)::geography,
  5000  -- 5km em metros
)
AND type = 'BAR'  -- opcional
ORDER BY ST_Distance(
  location::geography,
  ST_SetSRID(ST_MakePoint(-46.6333, -23.5505), 4326)::geography
)
```

**Funções PostGIS Utilizadas:**
- `ST_MakePoint(lon, lat)`: Cria ponto geométrico
- `ST_SetSRID(geom, 4326)`: Define sistema de coordenadas WGS84
- `::geography`: Converte para tipo geography (cálculos em metros)
- `ST_DWithin(a, b, distance)`: Verifica se distância ≤ raio
- `ST_Distance(a, b)`: Calcula distância para ordenação

## Padrões e Boas Práticas

### ✅ Separation of Concerns
- Infrastructure isolada do domínio
- Interfaces (ports) no domínio
- Implementações (adapters) na infrastructure

### ✅ Dependency Inversion
- Domínio define interfaces
- Infrastructure implementa interfaces
- Application Layer depende apenas de interfaces

### ✅ Singleton Pattern
- PrismaService: única conexão ao banco
- DIContainer: gestão centralizada
- Services e Repositories: instância única

### ✅ Lazy Initialization
- Dependências criadas apenas quando necessárias
- Economia de recursos
- Inicialização rápida da aplicação

### ✅ Error Handling
- Null em vez de exception para "not found"
- Exceptions do Prisma tratadas nos repositories
- Validações delegadas ao domain layer

### ✅ Type Safety
- Mapeamento explícito entre tipos
- Value Objects preservados
- Enums preservados

### ✅ Geospatial Best Practices
- Índice GiST já criado no schema
- Queries otimizadas com ST_DWithin
- Ordenação por distância
- Conversão correta de unidades (km → m)

## Performance Considerations

### Connection Pooling
- Prisma gerencia pool automaticamente
- Default: 10 conexões
- Configurável via DATABASE_URL

### Geospatial Queries
- Índice GiST na coluna `location`
- Queries otimizadas com `ST_DWithin`
- Filtro antes de ordenar (mais eficiente)

### Lazy Loading
- Dependências criadas sob demanda
- Reduz memória em startup
- Singleton evita duplicação

## Próximos Passos

### Fase 6: Presentation Layer
- **Controllers** para cada use case
- **Rotas Express** organizadas por módulo
- **Middlewares**:
  - Authentication (JWT)
  - Authorization (roles)
  - Validation (Zod/Joi)
  - Error handling
  - Rate limiting
  - CORS
  - Helmet

### Fase 7: Testes de Integração
- Testes de repositórios com banco real
- Testes de serviços (hash, token)
- Testes E2E das rotas
- Coverage mínimo de 80%

## Estatísticas da Fase 5

- **Services**: 3 (Hash, Token, Prisma)
- **Repositories**: 4 (User, Vendor, Product, Ad)
- **DI Container**: 40+ métodos
- **Linhas de Código**: ~1.000
- **Arquivos Criados**: 9

## Uso Básico

### Inicialização da Aplicação:
```typescript
import { DIContainer } from '@/infrastructure/di-container';

async function main() {
  // Inicializar conexões
  await DIContainer.initialize();
  
  // Usar um use case
  const registerUseCase = DIContainer.getRegisterUserUseCase();
  const result = await registerUseCase.execute({
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
    role: UserRole.CLIENT,
    isAdult: true,
  });
  
  console.log('Usuário criado:', result.user.id);
}

// Shutdown gracioso
process.on('SIGTERM', async () => {
  await DIContainer.shutdown();
  process.exit(0);
});
```

### Health Check Endpoint:
```typescript
app.get('/health', async (req, res) => {
  const health = await DIContainer.healthCheck();
  
  if (health.database && health.services) {
    res.status(200).json({ status: 'healthy', ...health });
  } else {
    res.status(503).json({ status: 'unhealthy', ...health });
  }
});
```

---

**Status**: ✅ COMPLETA  
**Próximo**: Fase 6 - Presentation Layer (Controllers, Routes, Middlewares)
