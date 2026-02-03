# Guia Rápido: Sistema Multi-Ambiente

## 🎯 Visão Geral

O projeto BeerAqui possui **3 ambientes isolados**, cada um com seu próprio banco de dados PostgreSQL:

| Ambiente | Porta | Banco de Dados | Uso |
|----------|-------|----------------|-----|
| **Development** | 5432 | `beeraqui_development` | Desenvolvimento diário |
| **Staging** | 5433 | `beeraqui_staging` | Testes com dados falsos |
| **Test** | 5434 | `beeraqui_test` | Testes automatizados |

## 🚀 Comandos Rápidos

### Alternar Entre Ambientes

```bash
# Para development (padrão)
npm run env:dev
# ou: bash scripts/switch-env.sh development

# Para staging (testes manuais)
npm run env:staging
# ou: bash scripts/switch-env.sh staging

# Para test (testes automatizados)
npm run env:test
# ou: bash scripts/switch-env.sh test
```

### Popular com Dados Falsos

```bash
# No ambiente atual
npm run seed

# Específico por ambiente
npm run seed:development
npm run seed:staging
npm run seed:test
```

### Gerenciar Banco de Dados

```bash
# Ver dados no Prisma Studio
npm run prisma:studio

# Resetar banco (CUIDADO: apaga tudo!)
npm run db:reset

# Forçar schema no banco
npm run db:push
```

## 📊 Dados de Teste

Após executar `npm run seed:staging`, você terá:

### 👥 Usuários (4)
```
Email: cliente@test.com | Senha: 123456 | Tipo: Cliente
Email: joao@bar.com | Senha: 123456 | Tipo: Vendedor (Bar do João)
Email: maria@mercado.com | Senha: 123456 | Tipo: Vendedor (Mercado da Maria)
Email: pedro@distribuidora.com | Senha: 123456 | Tipo: Vendedor (Distribuidora Costa)
```

### 🏪 Estabelecimentos (3)
- **Bar do João** - Bar/Lanchonete - R. Augusta, SP
- **Mercado da Maria** - Supermercado - Av. Paulista, SP
- **Distribuidora Costa** - Distribuidora - Zona Leste, SP

### 🍺 Produtos (8)
- Brahma 350ml - R$ 3,50
- Skol Lata 350ml - R$ 3,20
- Heineken Long Neck - R$ 6,90
- Stella Artois 330ml - R$ 7,50
- Budweiser Lata - R$ 4,20
- Corona Extra 355ml - R$ 8,90
- Brahma Chopp 1L - R$ 12,90
- Heineken Barril 5L - R$ 89,90

### 📢 Anúncios (3)
- 2 ativos (pagos)
- 1 expirado

## 🔄 Workflow Recomendado

### Para Desenvolvimento Normal
```bash
npm run env:dev
npm start
```

### Para Testes Manuais
```bash
# 1. Alterne para staging
npm run env:staging

# 2. Popule com dados falsos
npm run seed:staging

# 3. Inicie o servidor
npm start

# 4. Teste manualmente no navegador/Postman
# Dados não vão sujar o banco de desenvolvimento

# 5. Quando terminar, volte para dev
npm run env:dev
```

### Para Testes Automatizados
```bash
# 1. Alterne para test
npm run env:test

# 2. Execute os testes
npm test

# Ou deixe o Jest gerenciar (já configurado)
npm run test:watch
```

## 🐳 Containers Docker

O script de troca de ambiente gerencia os containers automaticamente:

```bash
# Ver containers rodando
docker ps

# Parar todos
sudo docker compose down

# Iniciar manualmente
sudo docker compose --profile staging up -d  # Para staging
sudo docker compose up -d  # Para development (sempre ativo)
```

## ⚠️ Dicas Importantes

1. **Sempre verifique o ambiente atual** antes de fazer migrations ou seeds
2. **Development** deve ficar limpo para desenvolvimento real
3. **Staging** é onde você testa features com dados realistas
4. **Test** é gerenciado automaticamente pelos testes Jest
5. O arquivo `.env` é **sobrescrito** na troca de ambiente

## 🔍 Verificar Ambiente Atual

```bash
# Ver qual .env está ativo
cat .env | grep NODE_ENV

# Ver porta do banco
cat .env | grep DATABASE_URL
```

## 🆘 Troubleshooting

### Porta já em uso
```bash
sudo docker compose down --remove-orphans
npm run env:dev  # ou staging/test
```

### Banco não conecta
```bash
# Verifique se o container está rodando
docker ps | grep postgres

# Reinicie o container
sudo docker compose restart postgres-dev
# ou postgres-staging, postgres-test
```

### Dados antigos/corrompidos
```bash
npm run db:reset
npm run seed
```

## 📚 Arquivos de Configuração

- `.env.development` - Configuração do ambiente de desenvolvimento
- `.env.staging` - Configuração do ambiente de testes
- `.env.test` - Configuração do ambiente de testes automatizados
- `scripts/switch-env.sh` - Script de troca de ambiente
- `prisma/seed.ts` - Script de população de dados

---

**Pronto!** Agora você tem 3 ambientes totalmente isolados e pode alternar entre eles facilmente. 🎉
