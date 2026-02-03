# Frontend - BeerAqui Mobile App

## 📱 Fase 1 - Fundação (Concluída)

### ✅ Implementado

#### 1. Setup do Projeto
- ✅ Inicializado projeto Expo com template TypeScript
- ✅ Configurado ESLint + Prettier para qualidade de código
- ✅ Criada estrutura de pastas organizada

#### 2. Internacionalização (i18n)
- ✅ Configurado i18next + react-i18next
- ✅ Criadas traduções em pt-BR para:
  - Textos comuns (botões, erros, etc)
  - Autenticação (login/registro)
  - Busca de produtos
- ✅ Detecção automática de idioma do dispositivo

#### 3. Design System & Theme
- ✅ Sistema de cores com paleta primária/secundária
- ✅ Tipografia padronizada (tamanhos, pesos)
- ✅ Espaçamentos consistentes
- ✅ Sombras e elevações
- ✅ Border radius
- ✅ Tema exportado e tipado

#### 4. TypeScript Types
- ✅ Interfaces para User, Vendor, Product, Ad
- ✅ Types para Location, AuthTokens
- ✅ SearchFilters interface

#### 5. Constants
- ✅ Configurações de API
- ✅ Configurações de mapa (lat/lng padrão, raio)
- ✅ Chaves do AsyncStorage
- ✅ Volumes de cerveja disponíveis
- ✅ Tipos de vendedor

#### 6. Services (Camada de API)
- ✅ **api.ts**: Cliente Axios configurado
  - Interceptor para adicionar token JWT
  - Interceptor para refresh token automático
  - Tratamento de erro 401
  - Timeout de 30s
- ✅ **auth.service.ts**: Login, registro, refresh token
- ✅ **vendor.service.ts**: Busca de vendedores próximos
- ✅ **product.service.ts**: Busca e filtros de produtos

#### 7. State Management (Zustand)
- ✅ **auth.store.ts**: Gerenciamento de autenticação
  - Login/Registro
  - Logout
  - Persistência de tokens no AsyncStorage
  - Carregamento de auth armazenada
- ✅ **product.store.ts**: Gerenciamento de produtos
  - Busca com filtros
  - Produtos selecionados
  - Filtros de busca
- ✅ **location.store.ts**: Gerenciamento de geolocalização
  - Requisição de permissão
  - Obter localização atual
  - Fallback para localização padrão (São Paulo)

#### 8. Path Aliases
- ✅ Configurado `@/` alias para `src/`
- ✅ babel-plugin-module-resolver instalado
- ✅ tsconfig.json com paths configurados

#### 9. Aplicação Inicial
- ✅ App.tsx atualizado com:
  - Import de i18n
  - Loading state durante carregamento de auth
  - Uso do theme
  - Verificação de autenticação

### 📦 Dependências Instaladas

```json
{
  "navigation": [
    "@react-navigation/native",
    "@react-navigation/stack",
    "@react-navigation/bottom-tabs",
    "react-native-screens",
    "react-native-safe-area-context"
  ],
  "state": ["zustand"],
  "http": ["axios"],
  "forms": ["react-hook-form", "zod"],
  "storage": ["@react-native-async-storage/async-storage"],
  "i18n": ["i18next", "react-i18next", "react-native-localize"],
  "maps": ["expo-location", "react-native-maps"],
  "devDeps": [
    "@typescript-eslint/parser",
    "@typescript-eslint/eslint-plugin",
    "eslint-config-prettier",
    "eslint-plugin-prettier",
    "prettier",
    "babel-plugin-module-resolver"
  ]
}
```

### 📁 Estrutura Criada

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── screens/            # Telas da aplicação
│   ├── navigation/         # Configuração de navegação
│   ├── services/           # ✅ API services (auth, vendor, product)
│   ├── hooks/              # Custom hooks
│   ├── store/              # ✅ Zustand stores (auth, product, location)
│   ├── utils/              # Funções utilitárias
│   ├── constants/          # ✅ Constantes da aplicação
│   ├── types/              # ✅ TypeScript types
│   ├── assets/             # Imagens, ícones
│   ├── theme/              # ✅ Design system
│   └── locales/            # ✅ Traduções (pt-BR)
├── App.tsx                 # ✅ Entry point atualizado
├── babel.config.js         # ✅ Babel com path aliases
├── tsconfig.json           # ✅ TypeScript com paths
├── .eslintrc.js           # ✅ ESLint config
├── .prettierrc.js         # ✅ Prettier config
├── .editorconfig          # ✅ Editor config
└── .env.example           # Template de variáveis

```

### 🎯 Próximos Passos (Fase 2)

#### Componentes Base
- [ ] Button component (primary, secondary, outline)
- [ ] Input component (text, password, email)
- [ ] Card component
- [ ] Loading indicator
- [ ] Error message component

#### Navegação
- [ ] Configurar Stack Navigator
- [ ] Configurar Bottom Tab Navigator
- [ ] Criar navegação autenticada vs não autenticada

#### Telas de Autenticação
- [ ] LoginScreen
- [ ] RegisterScreen
- [ ] Integração com auth.store

#### Tela de Busca
- [ ] SearchScreen com input
- [ ] Integração com product.store
- [ ] Lista de produtos

#### Mapa
- [ ] MapScreen com React Native Maps
- [ ] Marcadores de vendedores
- [ ] Integração com location.store

### 💡 Observações Técnicas

1. **Path Aliases**: Use `@/` para importar de `src/`
   ```ts
   import { theme } from '@/theme';
   import { useAuthStore } from '@/store/auth.store';
   ```

2. **i18n**: Traduções organizadas por namespace
   ```ts
   // common namespace é padrão
   t('loading') // => "Carregando..."
   
   // outros namespaces
   t('auth:login.title') // => "Entrar"
   t('search:search.title') // => "Buscar cervejas"
   ```

3. **API Client**: Já configurado para:
   - Auto-refresh de tokens
   - Headers de autenticação automáticos
   - Timeout de 30s
   - Base URL do .env

4. **Stores**: Já implementam:
   - Loading states
   - Error handling
   - Persistência (auth)
   - Limpar erros

---

**Status**: ✅ Fase 1 completa - Fundação sólida estabelecida
**Próximo**: Fase 2 - Componentes e Navegação
