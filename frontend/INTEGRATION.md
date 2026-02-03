# BeerAqui - Integração Frontend + Backend

## 🔗 Fase 4 - Integração com Backend

### ✅ Configuração Completa

#### Endpoints Mapeados

**Auth** (`/api/v1/auth`)
- `POST /register` - Registro de usuário
- `POST /login` - Login
- `POST /refresh` - Refresh token

**Products** (`/api/v1/products`)
- `GET /search` - Buscar produtos com filtros
- `GET /brands/:brand` - Buscar por marca
- `GET /:id` - Detalhes do produto
- `GET /vendors/:vendorId/products` - Produtos de um vendedor

**Vendors** (`/api/v1/vendors`)
- `GET /nearby` - Vendedores próximos (com cache)
- `GET /:id` - Perfil do vendedor

### 🔄 Services Atualizados

#### [auth.service.ts](src/services/auth.service.ts)
```typescript
✅ POST /auth/login - { email, password }
✅ POST /auth/register - { name, email, password, role, isAdultConfirmed }
✅ POST /auth/refresh - { refreshToken }
```

**Ajuste importante**: Backend espera `isAdultConfirmed` em vez de `isAdult`

#### [product.service.ts](src/services/product.service.ts)
```typescript
✅ GET /products/search - Com paginação (page, limit)
✅ GET /products/brands/:brand - Busca por marca
✅ GET /products/:id - Detalhes
✅ GET /products/vendors/:vendorId/products - Produtos do vendedor
```

**Response**: Inclui `{ products, total, page, limit }`

#### [vendor.service.ts](src/services/vendor.service.ts)
```typescript
✅ GET /vendors/nearby - Conversão radiusKm → radiusInMeters
✅ GET /vendors/:id - Perfil do vendedor
```

**Conversão**: Frontend usa `radiusKm`, backend espera `radiusInMeters` (multiplicado por 1000)

### 🎯 Types Sincronizados

#### Product
```typescript
{
  id: string;
  vendorId: string;
  brand: string;
  volume: number;          // Backend usa 'volume'
  volumeMl?: number;       // Alias para compatibilidade
  volumeInLiters?: number; // Calculado pelo backend
  price: number;
  pricePerLiter?: number;  // Calculado pelo backend
  isActive: boolean;
  stockQuantity?: number;
  description?: string;
  imageUrl?: string;
  vendor?: Vendor;
}
```

#### Vendor
```typescript
{
  id: string;
  userId: string;
  companyName: string;
  cnpj?: string;
  type: 'bar' | 'mercado' | 'distribuidora';
  location: { latitude, longitude };
  address: { street, number, city, state, zip };
  phone?: string;
  isVerified: boolean;
  distance?: number; // Em metros
}
```

#### SearchFilters
```typescript
{
  brand?: string;
  volumeMl?: number;      // Convertido para 'volume'
  minPrice?: number;
  maxPrice?: number;
  vendorType?: string;
  vendorId?: string;
  radiusKm?: number;      // Convertido para radiusInMeters
  page?: number;
  limit?: number;
}
```

### 🛠️ Utils Adicionados

**getProductVolume(product)**
- Compatibilidade entre `volume` e `volumeMl`
- Retorna o volume em ml independente do campo usado

### 📡 API Client

**Interceptors configurados**:
1. **Request**: Adiciona `Authorization: Bearer ${token}` automaticamente
2. **Response**: Detecta 401 e tenta refresh token automático
3. **Erro 401 no refresh**: Limpa tokens e redireciona para login

**Timeout**: 30 segundos

### 🚀 Como Conectar com Backend

#### 1. Configure a URL da API

Edite `.env` (crie a partir de `.env.example`):

**Desenvolvimento Local (iOS Simulator)**:
```bash
API_URL=http://localhost:3000/api/v1
```

**Android Emulator**:
```bash
API_URL=http://10.0.2.2:3000/api/v1
```

**Dispositivo Físico** (substitua pelo IP da sua máquina):
```bash
API_URL=http://192.168.1.100:3000/api/v1
```

#### 2. Inicie o Backend

```bash
cd backend
npm run dev
```

O backend estará rodando em `http://localhost:3000`

#### 3. Inicie o Frontend

```bash
cd frontend
npm start
```

Escolha:
- `i` para iOS Simulator
- `a` para Android Emulator
- Scan QR code para dispositivo físico

### ✨ Funcionalidades Integradas

#### Autenticação
- ✅ Login funcional com validação
- ✅ Registro com verificação de maioridade
- ✅ Auto-refresh de tokens
- ✅ Logout limpa tokens locais
- ✅ Navegação automática baseada em auth

#### Busca de Produtos
- ✅ Busca por marca
- ✅ Filtros de preço e volume
- ✅ Paginação (50 produtos por página)
- ✅ Pull-to-refresh
- ✅ Loading states
- ✅ Empty states

#### Geolocalização
- ✅ Permissão de localização
- ✅ Busca de vendedores próximos
- ✅ Conversão automática de radiusKm → radiusInMeters
- ✅ Fallback para São Paulo se sem permissão

### 🐛 Troubleshooting

#### Erro de conexão no Android Emulator
```bash
# Use 10.0.2.2 em vez de localhost
API_URL=http://10.0.2.2:3000/api/v1
```

#### Erro 401 persistente
- Verifique se o backend está rodando
- Verifique as variáveis de ambiente JWT no backend
- Limpe o AsyncStorage do app

#### Produtos não aparecem
- Verifique se há dados seed no backend
- Confirme que a permissão de localização foi concedida
- Verifique o raio de busca (padrão: 5km)

### 📊 Cache

Backend usa Redis para cache com TTLs:
- Vendors nearby: Cache ativo
- Product search: Cache ativo
- Product details: Cache ativo

Headers de cache retornados:
- `X-Cache: HIT` ou `X-Cache: MISS`

### 🔐 Autenticação

**Flow completo**:
1. Login → Recebe `accessToken` + `refreshToken`
2. Tokens salvos no AsyncStorage
3. Cada request inclui `Authorization: Bearer ${accessToken}`
4. Token expira → Interceptor detecta 401
5. Tenta refresh automático
6. Refresh falha → Logout automático

### 📱 Telas Funcionais

- ✅ **LoginScreen**: Integrado com `/auth/login`
- ✅ **RegisterScreen**: Integrado com `/auth/register`
- ✅ **SearchScreen**: Integrado com `/products/search`
- ✅ **MapScreen**: Preparado para markers de vendedores
- ✅ **ProfileScreen**: Exibe dados do usuário + logout

---

**Status**: ✅ Fase 4 completa - Frontend totalmente integrado com backend!
**Próximo**: Testes end-to-end e refinamentos de UX
