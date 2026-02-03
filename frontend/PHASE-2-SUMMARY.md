# Frontend - BeerAqui Mobile App

## 📱 Fase 2 - Design System & Theme (Concluída)

### ✅ Componentes Reutilizáveis Implementados

#### 1. **Text Component**
- **Localização**: [src/components/Text.tsx](src/components/Text.tsx)
- **Variants**: h1, h2, h3, body, caption, label
- **Weights**: regular, medium, semibold, bold
- **Colors**: primary, secondary, light, inverse, error, success
- **Props**: variant, weight, color, center
- **Uso**:
  ```tsx
  <Text variant="h1" weight="bold" color="primary">
    Título
  </Text>
  ```

#### 2. **Button Component**
- **Localização**: [src/components/Button.tsx](src/components/Button.tsx)
- **Variants**: primary, secondary, outline, ghost, danger
- **Sizes**: sm, md, lg
- **Features**:
  - Loading state com ActivityIndicator
  - Ícones (left/right)
  - Full width
  - Disabled state
- **Uso**:
  ```tsx
  <Button 
    variant="primary" 
    size="lg" 
    loading={isLoading}
    onPress={handlePress}
  >
    Entrar
  </Button>
  ```

#### 3. **Input Component**
- **Localização**: [src/components/Input.tsx](src/components/Input.tsx)
- **Types**: text, password, email, phone, number
- **Features**:
  - Label e helper text
  - Error state
  - Ícones (left/right)
  - Toggle de visibilidade para senha
  - Focus state
  - Disabled state
- **Uso**:
  ```tsx
  <Input
    label="E-mail"
    type="email"
    placeholder="seu@email.com"
    error={errors.email?.message}
  />
  ```

#### 4. **Card Component**
- **Localização**: [src/components/Card.tsx](src/components/Card.tsx)
- **Variants**: default, elevated, outlined
- **Padding**: none, sm, md, lg
- **Features**:
  - Touchable (onPress opcional)
  - Sombras configuráveis
- **Uso**:
  ```tsx
  <Card variant="elevated" padding="md" onPress={handlePress}>
    <Text>Conteúdo do card</Text>
  </Card>
  ```

#### 5. **Loading Component**
- **Localização**: [src/components/Loading.tsx](src/components/Loading.tsx)
- **Props**: size (small/large), color, message, fullScreen
- **Uso**:
  ```tsx
  <Loading fullScreen message="Carregando produtos..." />
  ```

#### 6. **ErrorMessage Component**
- **Localização**: [src/components/ErrorMessage.tsx](src/components/ErrorMessage.tsx)
- **Props**: title, message, onRetry, retryLabel
- **Uso**:
  ```tsx
  <ErrorMessage
    message="Erro ao carregar dados"
    onRetry={handleRetry}
  />
  ```

#### 7. **Spacing Component**
- **Localização**: [src/components/Spacing.tsx](src/components/Spacing.tsx)
- **Props**: size (xs, sm, md, lg, xl, xxl, xxxl), horizontal, vertical
- **Uso**:
  ```tsx
  <Spacing size="lg" />
  ```

#### 8. **Container Component**
- **Localização**: [src/components/Container.tsx](src/components/Container.tsx)
- **Props**: safe (SafeAreaView), padding, center
- **Uso**:
  ```tsx
  <Container safe padding>
    <Text>Conteúdo da tela</Text>
  </Container>
  ```

### 🧭 Sistema de Navegação

#### **RootNavigator**
- **Localização**: [src/navigation/RootNavigator.tsx](src/navigation/RootNavigator.tsx)
- Controla navegação entre Auth e Main baseado em autenticação
- Loading screen durante verificação de auth

#### **AuthNavigator** (Stack)
- **Localização**: [src/navigation/AuthNavigator.tsx](src/navigation/AuthNavigator.tsx)
- Telas: Login, Register, ForgotPassword
- Header oculto
- Placeholders criados (serão substituídos na Fase 3)

#### **MainNavigator** (Bottom Tabs)
- **Localização**: [src/navigation/MainNavigator.tsx](src/navigation/MainNavigator.tsx)
- 4 Tabs:
  - 🔍 **Search**: Busca de produtos
  - 🗺️ **Map**: Mapa com vendedores
  - ⭐ **Favorites**: Produtos favoritos
  - 👤 **Profile**: Perfil do usuário
- Estilização customizada com theme
- Placeholders criados

#### **Navigation Types**
- **Localização**: [src/navigation/types.ts](src/navigation/types.ts)
- Type-safe navigation
- Params tipados para todas as telas
- Global type declaration para TypeScript

### 🔧 Hooks Customizados

#### **useTheme**
- **Localização**: [src/hooks/useTheme.ts](src/hooks/useTheme.ts)
- Retorna objeto theme completo
- **Uso**: `const theme = useTheme();`

#### **useForm**
- **Localização**: [src/hooks/useForm.ts](src/hooks/useForm.ts)
- Wrapper do react-hook-form com Zod resolver
- Validação automática
- **Uso**:
  ```tsx
  const { control, handleSubmit } = useForm(loginSchema);
  ```

### 🛠️ Utils

#### **Formatters** ([src/utils/formatters.ts](src/utils/formatters.ts))
- `formatPrice(value)`: R$ 10,50
- `formatDistance(meters)`: 1,5 km ou 500 m
- `formatVolume(ml)`: 350ml ou 1L
- `calculatePricePerLiter(price, volumeMl)`: Calcula preço por litro
- `formatPhone(phone)`: (11) 98765-4321
- `truncateText(text, maxLength)`: Trunca com ellipsis

#### **Validations** ([src/utils/validations.ts](src/utils/validations.ts))
- `loginSchema`: Validação de login (email + senha)
- `registerSchema`: Validação de registro (nome, email, senha, confirmação, isAdult)
- `searchSchema`: Validação de filtros de busca
- Types exportados: `LoginFormData`, `RegisterFormData`, `SearchFormData`

### 📦 Dependências Adicionadas

```bash
npm install @hookform/resolvers
```

### 🎨 Design Tokens

Todos os componentes usam tokens do theme system:

```typescript
// Cores
theme.colors.primary.main    // #FFA500 (laranja)
theme.colors.secondary.main  // #2C3E50 (azul escuro)
theme.colors.success.main    // #27AE60
theme.colors.error.main      // #E74C3C

// Espaçamentos
theme.spacing.xs   // 4px
theme.spacing.sm   // 8px
theme.spacing.md   // 16px
theme.spacing.lg   // 24px

// Tipografia
theme.typography.fontSize.md    // 16
theme.typography.fontWeight.bold // '700'

// Sombras
theme.shadows.sm
theme.shadows.md
theme.shadows.lg

// Border Radius
theme.borderRadius.md  // 8
theme.borderRadius.lg  // 12
```

### ✨ Características dos Componentes

1. **Totalmente Reutilizáveis**: Props bem definidas e variantes
2. **Type-Safe**: TypeScript com interfaces exportadas
3. **Consistentes**: Usam theme system
4. **Acessíveis**: Componentes nativos otimizados
5. **Flexíveis**: Permitem style override
6. **Composáveis**: Podem ser combinados

### 📱 App.tsx Atualizado

- Integrado com RootNavigator
- Carregamento automático de auth
- Navegação condicional (Auth vs Main)
- i18n inicializado

### 🎯 Próximos Passos (Fase 3)

- [ ] Implementar telas de autenticação (Login, Register)
- [ ] Criar formulários com react-hook-form + Zod
- [ ] Integrar com auth.store e auth.service
- [ ] Implementar validações visuais
- [ ] Criar fluxo de recuperação de senha

### 💡 Exemplos de Uso

#### Formulário Completo
```tsx
import { useForm } from '@/hooks';
import { loginSchema } from '@/utils';
import { Button, Input, Container } from '@/components';

const { control, handleSubmit, formState: { errors } } = useForm(loginSchema);

return (
  <Container safe padding>
    <Input
      label="E-mail"
      type="email"
      error={errors.email?.message}
    />
    <Spacing size="md" />
    <Input
      label="Senha"
      type="password"
      error={errors.password?.message}
    />
    <Spacing size="lg" />
    <Button 
      variant="primary" 
      fullWidth 
      onPress={handleSubmit(onSubmit)}
    >
      Entrar
    </Button>
  </Container>
);
```

#### Card com Produto
```tsx
<Card variant="elevated" padding="md" onPress={() => navigate('ProductDetails')}>
  <Text variant="h3" weight="bold">{product.brand}</Text>
  <Spacing size="sm" />
  <Text variant="body" color="secondary">
    {formatVolume(product.volumeMl)} • {formatPrice(product.price)}
  </Text>
</Card>
```

---

**Status**: ✅ Fase 2 completa - Design System robusto e reutilizável
**Próximo**: Fase 3 - Telas de Autenticação
