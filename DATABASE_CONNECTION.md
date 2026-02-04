# 🗄️ Guia de Conexão com Banco de Dados

Este guia explica como conectar ao banco de dados PostgreSQL do BeerAqui usando o DBeaver em diferentes ambientes.

## 📥 Instalação do DBeaver

### Download

Baixe o DBeaver Community Edition em: https://dbeaver.io/download/

### Instalação

**Windows**: Execute o instalador `.exe`  
**Linux**: 
```bash
sudo snap install dbeaver-ce
```

**macOS**: 
```bash
brew install --cask dbeaver-community
```

## 🔌 Configurando Conexões

### 1. Development (Local)

Conecta ao PostgreSQL rodando no Docker localmente.

#### Configuração da Conexão

1. Abra o DBeaver
2. Clique em **Database** → **New Database Connection**
3. Selecione **PostgreSQL**
4. Clique em **Next**

#### Parâmetros de Conexão

| Campo | Valor |
|-------|-------|
| **Host** | `localhost` |
| **Port** | `5432` |
| **Database** | `beeraqui_dev` |
| **Username** | `beeraqui_user` |
| **Password** | `beeraqui_dev_password` |

#### Configurações Adicionais

- **Tab: PostgreSQL**
  - ✅ Show all databases
  
- **Tab: Driver Properties**
  - `ssl` = `false`
  - `sslmode` = `disable`

5. Clique em **Test Connection**
6. Se bem-sucedido, clique em **Finish**

#### Connection String (Alternativa)

```
postgresql://beeraqui_user:beeraqui_dev_password@localhost:5432/beeraqui_dev
```

---

### 2. Staging

Conecta ao banco de dados de staging (pré-produção).

#### Configuração da Conexão

1. Abra o DBeaver
2. Clique em **Database** → **New Database Connection**
3. Selecione **PostgreSQL**
4. Clique em **Next**

#### Parâmetros de Conexão

| Campo | Valor |
|-------|-------|
| **Host** | `staging-db.beeraqui.com` *(ou IP do servidor)* |
| **Port** | `5432` |
| **Database** | `beeraqui_staging` |
| **Username** | `beeraqui_staging_user` |
| **Password** | *(solicitar ao time DevOps)* |

#### Configurações Adicionais

- **Tab: PostgreSQL**
  - ✅ Show all databases
  
- **Tab: Driver Properties**
  - `ssl` = `true`
  - `sslmode` = `require`

- **Tab: SSH**
  - Se necessário túnel SSH:
    - ✅ Use SSH Tunnel
    - **Host/IP**: IP do servidor de bastion
    - **Port**: `22`
    - **User**: seu usuário SSH
    - **Authentication**: Private Key ou Password

5. Clique em **Test Connection**
6. Se bem-sucedido, clique em **Finish**

#### Connection String (Alternativa)

```
postgresql://beeraqui_staging_user:PASSWORD@staging-db.beeraqui.com:5432/beeraqui_staging?sslmode=require
```

---

### 3. Production

⚠️ **CUIDADO**: Ambiente de produção. Use apenas para consultas read-only quando necessário.

#### Configuração da Conexão

1. Abra o DBeaver
2. Clique em **Database** → **New Database Connection**
3. Selecione **PostgreSQL**
4. Clique em **Next**

#### Parâmetros de Conexão

| Campo | Valor |
|-------|-------|
| **Host** | `prod-db.beeraqui.com` *(ou IP do servidor)* |
| **Port** | `5432` |
| **Database** | `beeraqui_prod` |
| **Username** | `beeraqui_readonly_user` |
| **Password** | *(solicitar ao time DevOps)* |

#### Configurações Adicionais

- **Tab: PostgreSQL**
  - ✅ Show all databases
  
- **Tab: Driver Properties**
  - `ssl` = `true`
  - `sslmode` = `require`
  - `sslrootcert` = `/path/to/ca-certificate.crt` *(se necessário)*

- **Tab: SSH**
  - Se necessário túnel SSH:
    - ✅ Use SSH Tunnel
    - **Host/IP**: IP do servidor de bastion
    - **Port**: `22`
    - **User**: seu usuário SSH
    - **Authentication**: Private Key ou Password

- **Tab: Connection**
  - ✅ Read-only connection

5. Clique em **Test Connection**
6. Se bem-sucedido, clique em **Finish**

#### Connection String (Alternativa)

```
postgresql://beeraqui_readonly_user:PASSWORD@prod-db.beeraqui.com:5432/beeraqui_prod?sslmode=require
```

---

## 🔍 Verificando a Conexão

### 1. Testando Conectividade

Após configurar, execute uma consulta simples:

```sql
SELECT version();
```

### 2. Listando Tabelas

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### 3. Verificando Extensões PostGIS

```sql
SELECT * FROM pg_extension WHERE extname = 'postgis';
```

---

## 📊 Estrutura do Banco de Dados

### Principais Tabelas

| Tabela | Descrição |
|--------|-----------|
| `users` | Dados dos usuários |
| `vendors` | Vendedores/estabelecimentos |
| `products` | Produtos (cervejas) |
| `ads` | Anúncios promocionais |

### Schemas

- **public**: Tabelas principais
- **prisma**: Metadata do Prisma ORM

---

## 🔐 Boas Práticas de Segurança

### ✅ Recomendações

1. **Nunca commit credenciais** no código
2. **Use usuários read-only** em produção
3. **Rotacione senhas** periodicamente
4. **Use túnel SSH** quando possível
5. **Habilite SSL/TLS** em staging e produção
6. **Limite IPs** que podem conectar (firewall)
7. **Use VPN** para acesso a ambientes sensíveis

### ⚠️ Cuidados em Produção

- ❌ NÃO execute `DELETE` ou `UPDATE` sem `WHERE`
- ❌ NÃO altere schema em produção sem approval
- ❌ NÃO exponha a senha em logs ou screenshots
- ✅ SEMPRE faça backup antes de mudanças
- ✅ USE transações para múltiplas alterações
- ✅ TESTE queries em staging primeiro

---

## 🛠️ Troubleshooting

### Erro: Connection refused

**Causa**: PostgreSQL não está rodando ou porta bloqueada

**Solução**:
```bash
# Verificar se container está rodando
docker ps | grep postgres

# Iniciar container
cd backend
docker-compose up -d postgres
```

### Erro: Authentication failed

**Causa**: Credenciais incorretas

**Solução**:
- Verifique usuário e senha no `.env`
- Confirme que está usando o banco correto (dev/staging/prod)

### Erro: SSL connection required

**Causa**: Servidor exige SSL mas conexão não está configurada

**Solução**:
- No DBeaver, vá em **Driver Properties**
- Configure `sslmode` = `require`
- Se necessário, adicione certificado em `sslrootcert`

### Erro: Timeout

**Causa**: Firewall bloqueando conexão ou servidor offline

**Solução**:
- Verifique se VPN está conectada
- Configure túnel SSH se necessário
- Confirme IP/porta do servidor

---

## 📞 Suporte

Para problemas com credenciais ou acesso aos ambientes de staging/produção, entre em contato com:

- **DevOps Team**: devops@beeraqui.com
- **Tech Lead**: tech@beeraqui.com

---

## 📚 Recursos Adicionais

- [DBeaver Documentation](https://dbeaver.com/docs/)
- [PostgreSQL SSL/TLS](https://www.postgresql.org/docs/current/ssl-tcp.html)
- [PostGIS Documentation](https://postgis.net/documentation/)

---

**Última atualização**: 03/02/2026
