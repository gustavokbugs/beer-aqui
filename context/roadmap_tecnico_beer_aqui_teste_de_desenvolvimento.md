# Roadmap Técnico – BeerAqui

**Objetivo deste documento**
Este documento é um **passo a passo direto, técnico e sequencial**, pensado como um **teste prático de desenvolvimento**. Ele deve ser seguido do início ao fim por **um único desenvolvedor**, utilizando **IA como apoio**, sem decisões abertas ou subjetivas.

O foco é:
- Clareza absoluta do que fazer
- Ordem correta de execução
- Evitar retrabalho
- Construir um MVP funcional e escalável

---

## ETAPA 0 – Preparação Obrigatória

### 0.1 Definições Fixas (não alterar)
- Front-end: **React Native**
- Backend: **API REST**
- Banco de dados: **PostgreSQL (com suporte a geolocalização)**
- Arquitetura: **Clean Architecture / Separação de responsabilidades**
- Usuários: **Cliente** e **Vendedor**

### 0.2 Regras de Negócio Base
- O app trabalha **exclusivamente com cerveja**
- Vendedor obrigatoriamente cadastra empresa
- Produto sempre possui:
  - Marca
  - Volume
  - Preço
  - Localização
- Usuário precisa confirmar **+18 anos**

---

## ETAPA 1 – Modelagem de Dados

### 1.1 Criar entidades principais

Criar tabelas:
1. users
   - id
   - name
   - email
   - password
   - role (CLIENT | VENDOR)
   - created_at

2. vendors
   - id
   - user_id
   - company_name
   - cnpj
   - type (bar | mercado | distribuidora)
   - latitude
   - longitude

3. products
   - id
   - vendor_id
   - brand
   - volume
   - price
   - active

4. ads
   - id
   - product_id
   - start_date
   - end_date
   - priority

---

## ETAPA 2 – Backend Base

### 2.1 Estrutura do projeto

Criar estrutura:
- src/
  - controllers/
  - services/
  - repositories/
  - routes/
  - middlewares/

### 2.2 Autenticação

Implementar:
- Cadastro de usuário
- Login
- Geração de JWT
- Middleware de autenticação
- Middleware de autorização por role

---

## ETAPA 3 – Backend de Negócio

### 3.1 Usuários
- Criar usuário cliente
- Criar usuário vendedor

### 3.2 Vendedores
- Criar empresa
- Atualizar dados da empresa
- Validar CNPJ

### 3.3 Produtos
- Criar produto
- Atualizar preço
- Desativar produto
- Validar volume permitido

### 3.4 Busca Geolocalizada

Implementar endpoint que:
- Recebe latitude e longitude
- Retorna produtos próximos
- Permite filtros:
  - Marca
  - Preço mínimo/máximo
  - Volume

---

## ETAPA 4 – Anúncios e Monetização

### 4.1 Regras
- Produtos com anúncio aparecem primeiro
- Anúncios têm prazo

### 4.2 Implementação
- Criar anúncio
- Validar período
- Ordenar resultados por prioridade

---

## ETAPA 5 – Setup do App React Native

### 5.1 Inicialização
- Criar projeto React Native
- Configurar navegação
- Configurar cliente HTTP

### 5.2 Estrutura

Criar pastas:
- screens/
- components/
- services/
- hooks/
- store/

---

## ETAPA 6 – Fluxo Inicial do App

### 6.1 Onboarding

Tela única contendo:
- Texto curto explicativo
- Dois botões:
  - Sou Cliente
  - Sou Vendedor

Salvar escolha localmente.

---

## ETAPA 7 – Autenticação no App

### 7.1 Telas
- Cadastro Cliente
- Cadastro Vendedor
- Login

### 7.2 Regras
- Inputs obrigatórios
- Feedback visual de erro
- Persistir token

---

## ETAPA 8 – Fluxo do Cliente

### 8.1 Localização
- Solicitar permissão
- Capturar coordenadas

### 8.2 Busca

Tela contendo:
- Campo de busca
- Botão de filtros
- Lista de resultados

### 8.3 Filtros
- Marca
- Volume
- Faixa de preço

### 8.4 Detalhes
- Nome da cerveja
- Preço
- Estabelecimento
- Endereço

---

## ETAPA 9 – Fluxo do Vendedor

### 9.1 Empresa
- Cadastro
- Edição

### 9.2 Produtos
- Cadastro
- Edição de preço
- Ativar/desativar

### 9.3 Anúncios
- Criar anúncio
- Escolher produto
- Definir período

---

## ETAPA 10 – Qualidade e Performance

Implementar:
- Loading states
- Empty states
- Tratamento de erros
- Paginação
- Cache simples

---

## ETAPA 11 – Testes Obrigatórios

Validar manualmente:
- Cadastro completo
- Login
- Busca por localização
- Filtros
- Criação de anúncios

---

## ETAPA 12 – Preparação para Publicação

- Textos legais (+18)
- Configurar permissões
- Build Android
- Build iOS

---

## REGRA FINAL DO TESTE

- Não pular etapas
- Não adicionar features extras
- IA pode ser usada apenas como apoio
- O resultado final deve ser um MVP funcional

