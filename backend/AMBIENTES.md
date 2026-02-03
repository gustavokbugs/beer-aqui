# 🔄 Guia de Ambientes - BeerAqui Backend

## 📦 Ambientes Disponíveis

O projeto possui 3 ambientes separados, cada um com seu próprio banco de dados:

### 1. Development (Desenvolvimento)
- **Porta do banco**: 5432
- **Database**: `beeraqui_dev`
- **Uso**: Desenvolvimento diário, testes manuais
- **Container**: `beeraqui-postgres-dev`

### 2. Staging (Homologação/Testes)
- **Porta do banco**: 5433
- **Database**: `beeraqui_staging`  
- **Uso**: Ambiente para popular com dados de teste, simular produção
- **Container**: `beeraqui-postgres-staging`

### 3. Test (Testes Automatizados)
- **Porta do banco**: 5434
- **Database**: `beeraqui_test`
- **Uso**: Testes automatizados, CI/CD
- **Container**: `beeraqui-postgres-test`

---

## 🚀 Como Alternar Entre Ambientes

### Método 1: Script Automático (Recomendado)

```bash
# Alternar para development
npm run env:dev

# Alternar para staging
npm run env:staging

# Alternar para test
npm run env:test
```

O script faz automaticamente:
- ✅ Copia o arquivo `.env.{ambiente}` para `.env`
- ✅ Inicia o container do banco se não estiver rodando
- ✅ Aplica as migrations
- ✅ Gera o Prisma Client
- ✅ Verifica a conexão

### Método 2: Manual

```bash
# 1. Copiar arquivo de ambiente
cp .env.staging .env

# 2. Iniciar container específico
sudo docker compose --profile staging up -d postgres-staging

# 3. Aplicar migrations
npx prisma migrate deploy

# 4. Gerar Prisma Client
npx prisma generate
```

---

## 🌱 Populando com Dados de Teste

### Seed Completo

Popula o banco com dados fictícios (usuários, vendedores, produtos, anúncios):

```bash
# No ambiente atual
npm run seed

# Em ambiente específico
npm run seed:development
npm run seed:staging
npm run seed:test
```

### Dados Criados pelo Seed

**Usuários** (senha: `123456`):
- `cliente@test.com` - Cliente
- `joao@bar.com` - Vendedor (Bar do João)
- `maria@mercado.com` - Vendedor (Mercado da Maria)
- `pedro@distribuidora.com` - Vendedor (Distribuidora)

**Estabelecimentos**:
- 3 vendedores verificados
- Localizações em São Paulo
- Tipos: bar, mercado, distribuidora

**Produtos**:
- 8 produtos diferentes
- Marcas variadas (Brahma, Skol, Heineken, etc.)
- Volumes: 330ml, 350ml, 1000ml
- Preços entre R$ 4,00 e R$ 8,90

**Anúncios**:
- 2 anúncios ativos
- 1 anúncio expirado

---

## 🔧 Gerenciamento dos Bancos

### Iniciar Containers

```bash
# Development (sempre ativo por padrão)
sudo docker compose up -d postgres-dev redis

# Staging
sudo docker compose --profile staging up -d

# Test
sudo docker compose --profile test up -d

# Todos
sudo docker compose --profile staging --profile test up -d
```

### Parar Containers

```bash
# Parar todos
sudo docker compose down

# Parar apenas staging
sudo docker compose --profile staging down

# Parar e remover volumes (⚠️ APAGA DADOS)
sudo docker compose down -v
```

### Ver Status

```bash
# Listar containers rodando
sudo docker ps

# Logs do banco
sudo docker logs beeraqui-postgres-staging -f
```

---

## 🗄️ Operações no Banco

### Acessar via Prisma Studio

```bash
# Abre interface web para visualizar/editar dados
npm run prisma:studio
```

### Resetar Banco

```bash
# ⚠️ CUIDADO: Apaga todos os dados e recria o schema
npm run db:reset

# Resetar e popular novamente
npm run db:reset && npm run seed
```

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations pendentes
npx prisma migrate deploy

# Ver status das migrations
npx prisma migrate status
```

### Acessar via psql

```bash
# Development
sudo docker exec -it beeraqui-postgres-dev psql -U beeraqui -d beeraqui_dev

# Staging
sudo docker exec -it beeraqui-postgres-staging psql -U beeraqui -d beeraqui_staging

# Test
sudo docker exec -it beeraqui-postgres-test psql -U beeraqui -d beeraqui_test
```

---

## 📋 Workflows Comuns

### Começar a Trabalhar

```bash
# 1. Garantir que está no ambiente correto
npm run env:dev

# 2. Iniciar servidor
npm run dev
```

### Testar com Dados Limpos

```bash
# 1. Alternar para staging
npm run env:staging

# 2. Resetar e popular
npm run db:reset && npm run seed:staging

# 3. Iniciar servidor
npm run dev
```

### Criar Dados Customizados

```bash
# 1. Popular com seed padrão
npm run seed:staging

# 2. Abrir Prisma Studio
npm run prisma:studio

# 3. Adicionar/editar dados pela interface
```

### Preparar Testes Automatizados

```bash
# 1. Alternar para test
npm run env:test

# 2. Rodar migrations
npx prisma migrate deploy

# 3. Rodar testes
npm test
```

---

## ⚠️ Importante

1. **Nunca commitar** arquivos `.env` (exceto `.env.example`)
2. **Staging** é para teste manual com dados falsos
3. **Test** é para testes automatizados
4. **Development** é para desenvolvimento diário
5. Sempre verifique qual `.env` está ativo antes de rodar comandos

---

## 🎯 Verificar Ambiente Atual

```bash
# Ver qual .env está ativo
cat .env | head -1

# Ver porta do banco configurada
cat .env | grep DATABASE_URL
```

---

## 🆘 Troubleshooting

### Container não inicia

```bash
# Ver logs
sudo docker logs beeraqui-postgres-staging

# Recriar container
sudo docker compose --profile staging up -d --force-recreate
```

### Erro de conexão

```bash
# Verificar se porta está em uso
sudo netstat -tlnp | grep 5433

# Verificar status do container
sudo docker ps -a | grep postgres
```

### Migrations desincronizadas

```bash
# Resetar migrations
npm run db:reset

# Ou forçar sincronização
npx prisma db push
```
