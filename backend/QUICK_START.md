# 🚀 Setup Rápido do Banco de Dados

## 1️⃣ Instalar PostgreSQL com PostGIS

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib postgresql-15-postgis-3
```

## 2️⃣ Configurar Database

```bash
# Conectar ao PostgreSQL
sudo -u postgres psql

# Executar estes comandos no psql:
CREATE USER beeraqui WITH PASSWORD 'beeraqui123';
CREATE DATABASE beeraqui_dev OWNER beeraqui;
\c beeraqui_dev
CREATE EXTENSION IF NOT EXISTS postgis;
\q
```

## 3️⃣ Rodar Migrations

```bash
cd /home/imply/Documentos/beer-aqui/backend
npx prisma migrate dev --name init
```

## 4️⃣ Iniciar Servidor

O servidor já está rodando! Acesse:
- API: http://localhost:3000
- Health: http://localhost:3000/health

---

## ✅ Verificar se funcionou

```bash
# Testar conexão com banco
npx prisma db pull

# Ver dados no navegador (opcional)
npm run prisma:studio
```

---

## 📝 Próximos Passos

Após configurar o banco, podemos continuar com:
- **Fase 1.3**: Configuração de Testes
- **Fase 1.4**: Configuração de i18n
- **Fase 2**: Modelagem de Dados completa
