#!/bin/bash

# Script de Build iOS para Beer Aqui
# Facilita o processo de build iOS no Linux via EAS Build

set -e

echo "🍺 Beer Aqui - Build iOS Script (Linux Compatible)"
echo "=================================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verifica se está na pasta frontend
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script da pasta frontend${NC}"
    exit 1
fi

# Detectar sistema operacional
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${YELLOW}⚠️  Você está no Linux/Windows${NC}"
    echo -e "${BLUE}ℹ️  Build iOS local requer macOS${NC}"
    echo -e "${GREEN}✅ Mas você pode usar EAS Build (na nuvem)!${NC}"
    echo ""
fi

# Menu de opções
echo "Escolha uma opção de build iOS:"
echo ""
echo "1) EAS Build - Preview (★ RECOMENDADO para iPhone físico)"
echo "2) EAS Build - Development (Para simulador)"
echo "3) EAS Build - Production (App Store)"
echo "4) Local Build - iOS (Requer macOS + Xcode)"
echo "5) Verificar configuração"
echo "6) Registrar Device (UDID do iPhone)"
echo ""
read -p "Opção (1-6): " option

case $option in
    1)
        echo -e "${YELLOW}📦 Iniciando EAS Build para Preview (iPhone físico)...${NC}"
        echo ""
        echo -e "${BLUE}ℹ️  Este build pode ser instalado no seu iPhone${NC}"
        echo -e "${BLUE}ℹ️  Você precisará registrar o UDID do iPhone (se primeira vez)${NC}"
        echo ""
        
        # Verificar se eas-cli está instalado
        if ! command -v eas &> /dev/null; then
            echo -e "${YELLOW}📥 Instalando EAS CLI...${NC}"
            npm install -g eas-cli
        fi
        
        # Fazer login se necessário
        echo -e "${YELLOW}🔐 Verificando login...${NC}"
        eas whoami || eas login
        
        # Build
        echo -e "${YELLOW}🚀 Iniciando build na nuvem...${NC}"
        echo -e "${BLUE}ℹ️  Isso pode demorar 15-25 minutos${NC}"
        echo ""
        eas build --platform ios --profile preview
        ;;
    2)
        echo -e "${YELLOW}📦 Iniciando EAS Build para Development (Simulador)...${NC}"
        
        if ! command -v eas &> /dev/null; then
            echo -e "${YELLOW}📥 Instalando EAS CLI...${NC}"
            npm install -g eas-cli
        fi
        
        eas whoami || eas login
        echo ""
        echo -e "${YELLOW}🚀 Iniciando build na nuvem...${NC}"
        eas build --platform ios --profile development
        ;;
    3)
        echo -e "${YELLOW}📦 Iniciando EAS Build para Production (App Store)...${NC}"
        echo -e "${BLUE}ℹ️  Requer Apple Developer Account ($99/ano)${NC}"
        echo ""
        
        if ! command -v eas &> /dev/null; then
            echo -e "${YELLOW}📥 Instalando EAS CLI...${NC}"
            npm install -g eas-cli
        fi
        
        eas whoami || eas login
        echo ""
        echo -e "${YELLOW}🚀 Iniciando build na nuvem...${NC}"
        eas build --platform ios --profile production
        ;;
    4)
        echo -e "${YELLOW}💻 Verificando se está no macOS...${NC}"
        if [[ "$OSTYPE" != "darwin"* ]]; then
            echo -e "${RED}❌ Erro: Build local iOS requer macOS + Xcode${NC}"
            echo ""
            echo -e "${YELLOW}💡 Você está no Linux!${NC}"
            echo -e "${GREEN}✅ Use EAS Build (opção 1 ou 2) para fazer build na nuvem${NC}"
            echo ""
            echo "Consulte: MAPA_IOS_NO_LINUX.md"
            exit 1
        fi
        
        echo -e "${YELLOW}📦 Instalando CocoaPods...${NC}"
        cd ios
        pod install
        cd ..
        
        echo -e "${GREEN}✅ Pods instalados!${NC}"
        echo -e "${YELLOW}🚀 Iniciando build iOS local...${NC}"
        npx expo run:ios
        ;;
    5)
        echo -e "${YELLOW}🔍 Verificando configuração...${NC}"
        echo ""
        
        # Verificar sistema operacional
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo -e "${GREEN}✅ macOS detectado${NC}"
            
            # Verificar Xcode
            if command -v xcodebuild &> /dev/null; then
                echo -e "${GREEN}✅ Xcode instalado:${NC} $(xcodebuild -version | head -1)"
            else
                echo -e "${RED}❌ Xcode não instalado${NC}"
            fi
            
            # Verificar CocoaPods
            if command -v pod &> /dev/null; then
                echo -e "${GREEN}✅ CocoaPods instalado:${NC} $(pod --version)"
            else
                echo -e "${YELLOW}⚠️  CocoaPods não instalado${NC}"
                echo -e "${BLUE}ℹ️  Instale com: sudo gem install cocoapods${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️  Linux/Windows detectado${NC}"
            echo -e "${BLUE}ℹ️  Build local iOS não disponível${NC}"
            echo -e "${GREEN}✅ Mas EAS Build funciona perfeitamente!${NC}"
        fi
        
        # Verificar EAS CLI
        echo ""
        if command -v eas &> /dev/null; then
            echo -e "${GREEN}✅ EAS CLI instalado:${NC} $(eas --version)"
            
            # Verificar login
            if eas whoami &> /dev/null; then
                echo -e "${GREEN}✅ Logado como:${NC} $(eas whoami)"
            else
                echo -e "${YELLOW}⚠️  Não está logado no EAS${NC}"
                echo -e "${BLUE}ℹ️  Faça login com: eas login${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️  EAS CLI não instalado${NC}"
            echo -e "${BLUE}ℹ️  Instale com: npm install -g eas-cli${NC}"
        fi
        
        # Verificar credenciais configuradas
        echo ""
        if [ -f "eas.json" ]; then
            echo -e "${GREEN}✅ eas.json configurado${NC}"
        else
            echo -e "${YELLOW}⚠️  eas.json não encontrado${NC}"
            echo -e "${BLUE}ℹ️  Configure com: eas build:configure${NC}"
        fi
        
        echo ""
        echo -e "${BLUE}📝 Recomendação:${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "- Você pode usar build local (opção 4) ou EAS Build (opção 1-3)"
        else
            echo "- Use EAS Build (opção 1 para iPhone físico)"
            echo "- Consulte: MAPA_IOS_NO_LINUX.md"
        fi
        ;;
    6)
        echo -e "${YELLOW}📱 Registrar Device (iPhone)...${NC}"
        echo ""
        
        if ! command -v eas &> /dev/null; then
            echo -e "${YELLOW}📥 Instalando EAS CLI...${NC}"
            npm install -g eas-cli
        fi
        
        eas whoami || eas login
        
        echo ""
        echo -e "${BLUE}ℹ️  Você precisará do UDID do seu iPhone${NC}"
        echo ""
        echo "Como obter o UDID:"
        echo "1. Acesse https://www.udid.io/ no Safari do iPhone"
        echo "2. Ou conecte iPhone no computador e use iTunes/Finder"
        echo "3. Ou digite manualmente aqui"
        echo ""
        
        eas device:create
        ;;
    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Processo concluído!${NC}"
echo ""
echo -e "${BLUE}📝 Próximos passos:${NC}"
if [ "$option" -eq 1 ] || [ "$option" -eq 2 ] || [ "$option" -eq 3 ]; then
    echo "   1. Aguarde o build terminar (15-25 min)"
    echo "   2. Escaneie o QR code com a câmera do iPhone"
    echo "   3. Siga as instruções para instalar"
    echo "   4. Teste a funcionalidade de mapa!"
    echo ""
    echo "   📖 Guia completo: MAPA_IOS_NO_LINUX.md"
elif [ "$option" -eq 4 ]; then
    echo "   - O app deve abrir automaticamente no simulador/device"
    echo "   - Teste a funcionalidade de mapa!"
fi
echo ""
