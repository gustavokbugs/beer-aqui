# Database Setup - BeerAqui Backend

## Opção 1: Com Docker (Recomendado)

Se você tem Docker instalado:

```bash
# Instalar Docker (Ubuntu/Debian)
sudo apt update
sudo apt install docker.io docker-compose-v2
sudo usermod -aG docker $USER
newgrp docker

# Iniciar banco de dados
docker compose up -d postgres redis

# Rodar migrations
npm run migrate:dev
```

## Opção 2: PostgreSQL Local

Se preferir usar PostgreSQL instalado localmente:

### 1. Instalar PostgreSQL e PostGIS

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib postgis

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Criar Banco de Dados

```bash
# Conectar como usuário postgres
sudo -u postgres psql

# Criar usuário e database
CREATE USER beeraqui WITH PASSWORD 'beeraqui123';
CREATE DATABASE beeraqui_dev OWNER beeraqui;

# Conectar ao database
\c beeraqui_dev

# Habilitar PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

# Sair
\q
```

### 3. Atualizar .env

```env
DATABASE_URL="postgresql://beeraqui:beeraqui123@localhost:5432/beeraqui_dev?schema=public"
```

### 4. Rodar Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Verificar Conexão

```bash
# Testar conexão
npx prisma db pull

# Ver banco no Prisma Studio
npm run prisma:studio
```

## Comandos Úteis

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npm run migrate:deploy

# Reset database (⚠️ APAGA TODOS OS DADOS)
npx prisma migrate reset

# Ver banco de dados no navegador
npm run prisma:studio
```
