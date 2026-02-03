#!/bin/bash

# Script para alternar entre ambientes
# Uso: ./scripts/switch-env.sh [development|staging|test]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_DIR="$PROJECT_DIR"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para mostrar uso
show_usage() {
    echo "Uso: $0 [development|staging|test]"
    echo ""
    echo "Ambientes disponíveis:"
    echo "  development - Ambiente de desenvolvimento (porta 5432)"
    echo "  staging     - Ambiente de testes/staging (porta 5433)"
    echo "  test        - Ambiente de testes automatizados (porta 5434)"
    exit 1
}

# Verificar se foi passado um argumento
if [ -z "$1" ]; then
    show_usage
fi

ENVIRONMENT=$1

# Validar ambiente
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|test)$ ]]; then
    echo -e "${RED}❌ Ambiente inválido: $ENVIRONMENT${NC}"
    show_usage
fi

# Definir porta do banco de acordo com o ambiente
case $ENVIRONMENT in
    development)
        DB_PORT=5432
        PROFILE=""
        ;;
    staging)
        DB_PORT=5433
        PROFILE="--profile staging"
        ;;
    test)
        DB_PORT=5434
        PROFILE="--profile test"
        ;;
esac

echo -e "${YELLOW}🔄 Alternando para ambiente: $ENVIRONMENT${NC}"
echo ""

# 1. Copiar arquivo .env apropriado
if [ -f "$ENV_DIR/.env.$ENVIRONMENT" ]; then
    cp "$ENV_DIR/.env.$ENVIRONMENT" "$ENV_DIR/.env"
    echo -e "${GREEN}✓${NC} Arquivo .env atualizado"
else
    echo -e "${RED}❌ Arquivo .env.$ENVIRONMENT não encontrado${NC}"
    exit 1
fi

# 2. Verificar se o container do banco está rodando
CONTAINER_NAME="beeraqui-postgres-${ENVIRONMENT/development/dev}"
if ! sudo docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${YELLOW}⚠${NC}  Container $CONTAINER_NAME não está rodando"
    echo -e "${YELLOW}▶${NC}  Iniciando containers..."
    
    if [ "$ENVIRONMENT" = "development" ]; then
        sudo docker compose up -d postgres-dev redis
    else
        sudo docker compose $PROFILE up -d
    fi
    
    echo -e "${YELLOW}⏳${NC} Aguardando banco de dados ficar pronto..."
    sleep 5
fi

# 3. Verificar conexão com o banco
if nc -z localhost $DB_PORT 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Banco de dados conectado (porta $DB_PORT)"
else
    echo -e "${RED}❌ Não foi possível conectar ao banco na porta $DB_PORT${NC}"
    exit 1
fi

# 4. Gerar Prisma Client
echo -e "${YELLOW}▶${NC}  Gerando Prisma Client..."
npx prisma generate > /dev/null 2>&1
echo -e "${GREEN}✓${NC} Prisma Client gerado"

# 5. Aplicar migrations
echo -e "${YELLOW}▶${NC}  Aplicando migrations..."
if npx prisma migrate deploy > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Migrations aplicadas"
else
    echo -e "${YELLOW}⚠${NC}  Rodando migrate dev..."
    npx prisma migrate dev --name sync_$(date +%s) > /dev/null 2>&1
    echo -e "${GREEN}✓${NC} Migrations sincronizadas"
fi

echo ""
echo -e "${GREEN}✅ Ambiente $ENVIRONMENT configurado com sucesso!${NC}"
echo ""
echo "📋 Informações do ambiente:"
echo "  • Ambiente: $ENVIRONMENT"
echo "  • Porta do banco: $DB_PORT"
echo "  • Banco de dados: beeraqui_$ENVIRONMENT"
echo ""
echo "🚀 Próximos passos:"
echo "  • Popular dados: npm run seed:$ENVIRONMENT"
echo "  • Iniciar servidor: npm run dev"
echo "  • Ver banco: npm run prisma:studio"
echo ""
