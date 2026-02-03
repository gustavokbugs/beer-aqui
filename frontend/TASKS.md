# Frontend Tasks - BeerAqui Mobile App

## Fase 1: Setup e Fundação

### 1.1 Configuração Inicial do Projeto
- [ ] Inicializar projeto React Native (CLI ou Expo)
- [ ] Configurar TypeScript
- [ ] Configurar ESLint + Prettier
- [ ] Configurar editorconfig
- [ ] Criar estrutura de pastas
  ```
  src/
  ├── components/       # Componentes reutilizáveis
  ├── screens/         # Telas do app
  ├── navigation/      # Configuração de navegação
  ├── services/        # Chamadas API
  ├── hooks/           # Custom hooks
  ├── store/           # Gerenciamento de estado
  ├── utils/           # Funções utilitárias
  ├── constants/       # Constantes e configurações
  ├── types/           # TypeScript types/interfaces
  ├── assets/          # Imagens, fontes, etc
  └── theme/           # Tema, cores, estilos
  ```
- [ ] Configurar .gitignore adequado
- [ ] Configurar variáveis de ambiente (.env)

### 1.2 Dependências Essenciais
- [ ] Instalar React Navigation (Stack + Bottom Tabs)
- [ ] Instalar biblioteca de gerenciamento de estado (Zustand/Redux Toolkit)
- [ ] Instalar biblioteca HTTP (Axios)
- [ ] Instalar biblioteca de formulários (React Hook Form)
- [ ] Instalar biblioteca de validação (Zod/Yup)
- [ ] Instalar AsyncStorage
- [ ] Instalar React Native Maps
- [ ] Instalar Geolocation service
- [ ] Instalar biblioteca de UI (opcional: React Native Paper/NativeBase)
- [ ] Instalar i18n (react-i18next + i18next)
- [ ] Instalar react-native-localize (detecção de idioma do dispositivo)

### 1.3 Configuração de Qualidade
- [ ] Configurar Reactotron para debugging
- [ ] Configurar Flipper
- [ ] Configurar testes (Jest + React Native Testing Library)
- [ ] Configurar Husky para pre-commit
- [ ] Configurar CI básico
- [ ] Configurar análise de bundle size

### 1.4 Configuração de Internacionalização (i18n)
- [ ] Configurar i18next
- [ ] Configurar react-i18next
- [ ] Criar estrutura de arquivos de tradução
  ```
  src/locales/
  ├── pt-BR/
  │   ├── common.json
  │   ├── auth.json
  │   ├── search.json
  │   ├── products.json
  │   └── vendor.json
  ├── en/
  │   └── ...
  └── es/
      └── ...
  ```
- [ ] Configurar detecção automática de idioma do dispositivo
- [ ] Configurar fallback para pt-BR
- [ ] Criar hook customizado useTranslation
- [ ] Configurar interpolação de variáveis
- [ ] Configurar pluralização
- [ ] Configurar formatação de datas por locale
- [ ] Configurar formatação de moedas por locale

---

## Fase 2: Design System e Theme

### 2.1 Definir Sistema de Design
- [ ] Criar paleta de cores
  - Primary color
  - Secondary color
  - Error, warning, success
  - Neutrals (grays)
  - Background colors

- [ ] Definir tipografia
  - Font families
  - Font sizes (scale)
  - Font weights
  - Line heights

- [ ] Definir espaçamentos
  - Padding scale (4, 8, 16, 24, 32...)
  - Margin scale
  - Border radius scale

- [ ] Definir shadows e elevations
- [ ] Definir tamanhos de ícones
- [ ] Criar tokens de design

### 2.2 Componentes Base
- [ ] Component: Button (primary, secondary, outline, text)
- [ ] Component: Input (text, email, password, search)
- [ ] Component: Card
- [ ] Component: Typography (Heading, Text)
- [ ] Component: Icon
- [ ] Component: Avatar
- [ ] Component: Badge
- [ ] Component: Divider
- [ ] Component: Chip/Tag
- [ ] Component: Loading Spinner
- [ ] Component: Skeleton Loader

### 2.3 Componentes de Feedback
- [ ] Component: Alert/Notification
- [ ] Component: Toast
- [ ] Component: Modal
- [ ] Component: BottomSheet
- [ ] Component: EmptyState
- [ ] Component: ErrorState
- [ ] Component: LoadingState

---

## Fase 3: Navegação e Estrutura Base

### 3.1 Configurar Navegação
- [ ] Stack Navigator principal
- [ ] Auth Stack (Login, Register)
- [ ] App Stack (após login)
- [ ] Bottom Tab Navigator (Cliente)
- [ ] Stack Navigator para Vendedor
- [ ] Configurar deep linking
- [ ] Configurar linking de notificações

### 3.2 Screens Placeholder
- [ ] Screen: Splash
- [ ] Screen: Onboarding
- [ ] Screen: Login
- [ ] Screen: Register
- [ ] Screen: Home (Cliente)
- [ ] Screen: Search
- [ ] Screen: ProductDetails
- [ ] Screen: Profile
- [ ] Screen: VendorDashboard
- [ ] Screen: VendorProducts
- [ ] Screen: VendorAds

---

## Fase 4: Serviços e API Integration

### 4.1 API Client
- [ ] Configurar Axios instance
- [ ] Configurar base URL
- [ ] Configurar timeout
- [ ] Interceptor de request (token)
- [ ] Interceptor de response (erros)
- [ ] Interceptor para refresh token
- [ ] Tratamento de erros de rede

### 4.2 API Services
- [ ] Service: AuthService
  - register()
  - login()
  - logout()
  - refreshToken()
  - confirmEmail()
  - forgotPassword()
  - resetPassword()

- [ ] Service: UserService
  - getMe()
  - updateProfile()
  - deleteAccount()

- [ ] Service: VendorService
  - createVendor()
  - getVendor()
  - updateVendor()
  - getMyVendor()

- [ ] Service: ProductService
  - createProduct()
  - getProduct()
  - updateProduct()
  - updatePrice()
  - toggleStatus()
  - deleteProduct()
  - getVendorProducts()

- [ ] Service: SearchService
  - searchProducts()
  - searchBrands()

- [ ] Service: AdService
  - createAd()
  - listAds()
  - cancelAd()

### 4.3 Cache e Offline
- [ ] Configurar cache de requisições
- [ ] Configurar estratégia offline-first
- [ ] Sincronização quando voltar online
- [ ] Indicador de modo offline

---

## Fase 5: Gerenciamento de Estado

### 5.1 Stores Globais
- [ ] Store: AuthStore
  - User data
  - Token management
  - isAuthenticated
  - login/logout actions

- [ ] Store: LocationStore
  - Current location
  - Permission status
  - requestPermission()
  - getCurrentLocation()

- [ ] Store: SearchStore
  - Search query
  - Filters
  - Results
  - Loading states

- [ ] Store: VendorStore
  - Vendor data
  - Products
  - Ads

### 5.2 Persistência
- [ ] Persistir auth state
- [ ] Persistir preferências do usuário
- [ ] Persistir idioma selecionado
- [ ] Persistir histórico de busca
- [ ] Limpar dados ao logout

---

## Fase 6: Tela de Onboarding

### 6.1 Implementar Onboarding
- [ ] Design da tela
- [ ] Texto explicativo sobre o app
- [ ] Verificação de +18 anos (checkbox obrigatório)
- [ ] Botão "Sou Cliente"
- [ ] Botão "Sou Vendedor"
- [ ] Salvar escolha no AsyncStorage
- [ ] Animações de transição
- [ ] Não mostrar novamente após primeira vez

---

## Fase 7: Autenticação

### 7.1 Tela de Login
- [ ] UI da tela de login
- [ ] Input de email com validação
- [ ] Input de senha com toggle de visibilidade
- [ ] Validação em tempo real
- [ ] Botão de login com loading state
- [ ] Link "Esqueci minha senha"
- [ ] Link para cadastro
- [ ] Tratamento de erros (credenciais inválidas)

### 7.2 Tela de Cadastro - Cliente
- [ ] UI da tela de cadastro
- [ ] Input de nome
- [ ] Input de email
- [ ] Input de senha (com requisitos)
- [ ] Input de confirmação de senha
- [ ] Checkbox +18 anos (obrigatório)
- [ ] Checkbox de termos de uso
- [ ] Validação de formulário
- [ ] Botão de cadastro com loading
- [ ] Feedback de sucesso/erro

### 7.3 Tela de Cadastro - Vendedor
- [ ] Herdar campos de Cliente
- [ ] Input de CNPJ com máscara
- [ ] Input de nome da empresa
- [ ] Select de tipo de estabelecimento
- [ ] Input de endereço
- [ ] Integração com API de CEP
- [ ] Validação de CNPJ
- [ ] Captura de localização (mapa)

### 7.4 Recuperação de Senha
- [ ] Tela de solicitação (email)
- [ ] Feedback de email enviado
- [ ] Tela de reset (com token)
- [ ] Validação de nova senha

---

## Fase 8: Fluxo do Cliente

### 8.1 Permissões e Localização
- [ ] Solicitar permissão de localização
- [ ] Tela de explicação da permissão
- [ ] Tratamento de permissão negada
- [ ] Capturar localização atual
- [ ] Loading state durante captura
- [ ] Permitir busca manual por endereço

### 8.2 Tela Home/Busca
- [ ] Header com localização atual
- [ ] Barra de busca
- [ ] Botão de filtros
- [ ] Lista de produtos próximos
- [ ] Card de produto:
  - Imagem da cerveja
  - Marca e volume
  - Preço
  - Nome do estabelecimento
  - Distância
  - Badge de anúncio (se aplicável)

- [ ] Infinite scroll/paginação
- [ ] Pull to refresh
- [ ] Empty state (sem resultados)
- [ ] Loading skeleton
- [ ] Ordenação (anúncios primeiro)

### 8.3 Filtros
- [ ] Modal/BottomSheet de filtros
- [ ] Filtro por marca (autocomplete)
- [ ] Filtro por volume (chips)
- [ ] Filtro por faixa de preço (slider)
- [ ] Filtro por distância máxima
- [ ] Botão "Aplicar filtros"
- [ ] Botão "Limpar filtros"
- [ ] Indicador visual de filtros ativos

### 8.4 Tela de Detalhes do Produto
- [ ] Imagem grande do produto
- [ ] Marca, volume, preço
- [ ] Nome do estabelecimento
- [ ] Tipo de estabelecimento
- [ ] Endereço completo
- [ ] Distância
- [ ] Mapa com localização
- [ ] Botão "Como chegar" (abrir no Maps)
- [ ] Horário de funcionamento (futuro)
- [ ] Disponibilidade em estoque

### 8.5 Tela de Perfil - Cliente
- [ ] Informações do usuário
- [ ] Opção de editar perfil
- [ ] Histórico de buscas
- [ ] Favoritos (futuro)
- [ ] Configurações
  - [ ] Seleção de idioma (pt-BR, English, Español)
  - [ ] Preview de mudança de idioma em tempo real
  - [ ] Salvar preferência de idioma
- [ ] Botão de logout
- [ ] Opção de deletar conta

---

## Fase 9: Fluxo do Vendedor

### 9.1 Dashboard do Vendedor
- [ ] Resumo de produtos ativos
- [ ] Resumo de anúncios ativos
- [ ] Estatísticas básicas (visualizações - futuro)
- [ ] Acesso rápido para adicionar produto
- [ ] Acesso rápido para criar anúncio
- [ ] Lista de produtos recentes

### 9.2 Gestão de Empresa
- [ ] Tela de perfil da empresa
- [ ] Visualizar dados da empresa
- [ ] Editar dados da empresa
- [ ] Atualizar localização
- [ ] Upload de logo (preparar)
- [ ] Validação de campos

### 9.3 Gestão de Produtos
- [ ] Lista de produtos do vendedor
- [ ] Filtros (ativos/inativos)
- [ ] Card de produto com ações rápidas
- [ ] Botão de adicionar produto

### 9.4 Adicionar/Editar Produto
- [ ] Input de marca (autocomplete sugerido)
- [ ] Select de volume (valores pré-definidos)
- [ ] Input de preço (máscara monetária)
- [ ] Input de quantidade em estoque
- [ ] Input de descrição (opcional)
- [ ] Upload de imagem
- [ ] Preview da imagem
- [ ] Toggle ativo/inativo
- [ ] Validação de formulário
- [ ] Botão de salvar com loading

### 9.5 Edição Rápida de Preço
- [ ] Modal para editar preço
- [ ] Input com valor atual
- [ ] Validação
- [ ] Salvar e atualizar lista

### 9.6 Gestão de Anúncios
- [ ] Lista de anúncios
- [ ] Status (ativo, expirado, cancelado)
- [ ] Período de vigência
- [ ] Produto anunciado

### 9.7 Criar Anúncio
- [ ] Select de produto
- [ ] Date picker (data início)
- [ ] Date picker (data fim)
- [ ] Select de prioridade/plano
- [ ] Resumo do valor
- [ ] Informações de pagamento (preparar)
- [ ] Validação de período
- [ ] Confirmação de criação

---

## Fase 10: Traduções e Localização

### 10.1 Traduzir Textos - Português (pt-BR)
- [ ] Traduzir textos de onboarding
- [ ] Traduzir textos de autenticação (login, cadastro, recuperação)
- [ ] Traduzir textos de busca e filtros
- [ ] Traduzir textos de produtos
- [ ] Traduzir textos do perfil
- [ ] Traduzir textos do vendedor
- [ ] Traduzir mensagens de erro
- [ ] Traduzir mensagens de sucesso
- [ ] Traduzir labels de formulários
- [ ] Traduzir botões e CTAs
- [ ] Traduzir empty states
- [ ] Traduzir textos legais (termos, privacidade)

### 10.2 Traduzir Textos - Inglês (en)
- [ ] Traduzir todos os textos para inglês
- [ ] Revisar traduções técnicas
- [ ] Adaptar expressões culturais
- [ ] Validar formatação de datas (MM/DD/YYYY)
- [ ] Validar formatação de moeda (USD)

### 10.3 Traduzir Textos - Espanhol (es)
- [ ] Traduzir todos os textos para espanhol
- [ ] Revisar traduções técnicas
- [ ] Adaptar expressões culturais
- [ ] Validar formatação de datas (DD/MM/YYYY)
- [ ] Validar formatação de moeda (USD/EUR/ARS conforme região)

### 10.4 Localização de Conteúdo Dinâmico
- [ ] Implementar formatação de preços por locale
- [ ] Implementar formatação de datas por locale
- [ ] Implementar formatação de distâncias por locale (km/mi)
- [ ] Implementar formatação de volumes (ml/oz)
- [ ] Traduzir nomes de meses e dias da semana
- [ ] Implementar pluralização correta por idioma

### 10.5 Testes de Internacionalização
- [ ] Testar app em pt-BR
- [ ] Testar app em inglês
- [ ] Testar app em espanhol
- [ ] Testar mudança de idioma em tempo real
- [ ] Testar layouts com textos longos (alemão como referência)
- [ ] Testar RTL (preparar para árabe - futuro)
- [ ] Validar que não há textos hardcoded
- [ ] Validar formatações de data/moeda

---

## Fase 11: Features de UX

### 10.1 Loading States
- [ ] Skeleton loaders para listas
- [ ] Spinners para ações
- [ ] Shimmer effect
- [ ] Progress bars onde aplicável

### 10.2 Empty States
- [ ] Ilustrações/ícones amigáveis
- [ ] Mensagens claras
- [ ] CTAs quando aplicável
- [ ] Empty state para busca sem resultados
- [ ] Empty state para vendedor sem produtos

### 10.3 Error Handling
- [ ] Tela de erro genérico
- [ ] Retry automático
- [ ] Botão de retry manual
- [ ] Mensagens de erro específicas
- [ ] Toast para erros rápidos
- [ ] Offline indicator

### 10.4 Feedback Visual
- [ ] Animações de transição
- [ ] Micro-interações
- [ ] Haptic feedback (vibração)
- [ ] Toast de sucesso
- [ ] Confirmação de ações destrutivas

---

## Fase 12: Otimizações e Performance

### 12.1 Performance
- [ ] Memoização de componentes (React.memo)
- [ ] useMemo e useCallback onde necessário
- [ ] Lazy loading de telas
- [ ] Otimização de imagens
- [ ] Code splitting
- [ ] Remover console.logs em produção

### 12.2 Otimização de Listas
- [ ] FlatList otimizado
- [ ] Virtualização
- [ ] getItemLayout quando aplicável
- [ ] keyExtractor otimizado
- [ ] removeClippedSubviews

### 12.3 Cache de Imagens
- [ ] Cache de imagens de produtos
- [ ] Placeholder durante carregamento
- [ ] Retry em caso de falha

---

## Fase 13: Acessibilidade

### 13.1 Implementar A11y
- [ ] Labels acessíveis em todos os inputs
- [ ] accessibilityLabel em elementos
- [ ] accessibilityHint onde necessário
- [ ] Suporte a VoiceOver/TalkBack
- [ ] Contraste adequado de cores
- [ ] Tamanho mínimo de toque (44x44)
- [ ] Foco de teclado lógico
- [ ] Testar com leitor de tela

---

## Fase 14: Testes

### 14.1 Testes Unitários
- [ ] Testes de componentes base
- [ ] Testes de hooks customizados
- [ ] Testes de utils
- [ ] Testes de validações

### 14.2 Testes de Integração
- [ ] Testes de fluxo de login
- [ ] Testes de fluxo de cadastro
- [ ] Testes de busca
- [ ] Testes de navegação

### 13.3 Testes E2E (Detox/Appium)
- [ ] Fluxo completo de cliente
- [ ] Fluxo completo de vendedor
- [ ] Testes em diferentes dispositivos

---

## Fase 15: Preparação para Publicação

### 15.1 Configurações Gerais
- [ ] Configurar ícone do app
- [ ] Configurar splash screen
- [ ] Configurar nome do app
- [ ] Configurar bundle identifier
- [ ] Versioning adequado

### 15.2 Permissões
- [ ] Declarar permissão de localização (iOS/Android)
- [ ] Textos de permissão em português
- [ ] Declarar permissão de câmera (se aplicável)
- [ ] Declarar permissão de armazenamento

### 15.3 Textos Legais
- [ ] Termos de uso (pt-BR, en, es)
- [ ] Política de privacidade (pt-BR, en, es)
- [ ] Aviso +18 anos (pt-BR, en, es)
- [ ] LGPD/GDPR/CCPA compliance

### 15.4 Build Android
- [ ] Configurar signing config
- [ ] Gerar keystore
- [ ] Build APK de release
- [ ] Build AAB para Google Play
- [ ] Testar build de release
- [ ] ProGuard/R8 configurado

### 15.5 Build iOS
- [ ] Configurar certificados
- [ ] Configurar provisioning profiles
- [ ] Build de release
- [ ] Testar em dispositivos reais
- [ ] Submeter para TestFlight

### 15.6 Assets para Stores
- [ ] Screenshots (vários tamanhos) em pt-BR, en e es
- [ ] Feature graphic
- [ ] Descrição do app (pt-BR, en, es)
- [ ] Keywords/tags (pt-BR, en, es)
- [ ] Categorização
- [ ] Rating de conteúdo
- [ ] Nome do app localizado (se aplicável)
- [ ] Nome do app localizado (se aplicável)

---

## Fase 16: Monitoramento

### 16.1 Analytics
- [ ] Integrar analytics (Firebase/Amplitude)
- [ ] Eventos de tela
- [ ] Eventos de ações importantes
- [ ] Funil de conversão
- [ ] User properties
- [ ] Tracking de idioma selecionado

### 16.2 Crash Reporting
- [ ] Integrar crash reporting (Sentry/Crashlytics)
- [ ] Source maps configurados
- [ ] Alertas configurados
- [ ] Breadcrumbs configurados

### 16.3 Performance Monitoring
- [ ] Monitorar tempo de carregamento
- [ ] Monitorar chamadas API
- [ ] Monitorar renderização

---

## Fase 17: Features Futuras (Preparar)

### 17.1 Notificações Push
- [ ] Configurar Firebase Cloud Messaging
- [ ] Pedir permissão
- [ ] Lidar com notificações
- [ ] Deep linking de notificações
- [ ] Notificações localizadas por idioma

### 17.2 Favoritos
- [ ] UI para favoritar produtos
- [ ] Persistir favoritos
- [ ] Tela de favoritos
- [ ] Notificações de mudança de preço

### 17.3 Chat/Mensagens
- [ ] Preparar estrutura para chat
- [ ] Interface básica
- [ ] Mensagens localizadas

### 17.4 Avaliações
- [ ] Sistema de rating
- [ ] Comentários

---

## Checklist Final

- [ ] App funciona offline (funcionalidades básicas)
- [ ] Todas as telas responsivas
- [ ] Testado em Android e iOS
- [ ] Testado em diferentes tamanhos de tela
- [ ] Loading states em todas as ações assíncronas
- [ ] Error handling em todos os casos
- [ ] Validação de formulários completa
- [ ] Navegação fluida
- [ ] Animações performáticas
- [ ] Imagens otimizadas
- [ ] Bundle size aceitável
- [ ] Sem memory leaks
- [ ] Acessibilidade básica implementada
- [ ] Analytics configurado
- [ ] Crash reporting ativo
- [ ] Textos legais incluídos (pt-BR, en, es)
- [ ] Permissões configuradas
- [ ] Builds de release testados
- [ ] Assets para stores preparados (multilíngue)
- [ ] i18n configurado e funcionando
- [ ] Todos os textos traduzidos (pt-BR, en, es)
- [ ] Nenhum texto hardcoded no código
- [ ] Formatações de data/moeda por locale
- [ ] Testado em todos os idiomas suportados
- [ ] Seleção de idioma funcionando (multilíngue)
- [ ] i18n configurado e funcionando
- [ ] Todos os textos traduzidos (pt-BR, en, es)
- [ ] Nenhum texto hardcoded no código
- [ ] Formatações de data/moeda por locale
- [ ] Testado em todos os idiomas suportados
- [ ] Seleção de idioma funcionando
