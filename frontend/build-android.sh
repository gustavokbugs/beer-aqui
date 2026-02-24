#!/bin/bash

# Script de Build Android para Beer Aqui
# Facilita o processo de build Android no Linux

set -e

echo "🍺 Beer Aqui - Build Android Script"
echo "===================================="
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

# Menu de opções
echo "Escolha uma opção de build Android:"
echo ""
echo "1) EAS Build - Development (Recomendado para teste)"
echo "2) EAS Build - Preview (APK standalone)"
echo "3) EAS Build - Production (Google Play)"
echo "4) Local Build - Android (Requer Android Studio + Device/Emulator)"
echo "5) Verificar configuração do Android"
echo "6) Limpar e Rebuild"
echo ""
read -p "Opção (1-6): " option

case $option in
    1)
        echo -e "${YELLOW}📦 Iniciando EAS Build para Development...${NC}"
        echo ""
        echo -e "${BLUE}ℹ️  Após o build, você receberá um link para baixar o APK${NC}"
        echo -e "${BLUE}ℹ️  Instale diretamente no seu celular Android!${NC}"
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
        eas build --platform android --profile development
        ;;
    2)
        echo -e "${YELLOW}📦 Iniciando EAS Build para Preview...${NC}"
        
        if ! command -v eas &> /dev/null; then
            echo -e "${YELLOW}📥 Instalando EAS CLI...${NC}"
            npm install -g eas-cli
        fi
        
        eas whoami || eas login
        eas build --platform android --profile preview
        ;;
    3)
        echo -e "${YELLOW}📦 Iniciando EAS Build para Production...${NC}"
        
        if ! command -v eas &> /dev/null; then
            echo -e "${YELLOW}📥 Instalando EAS CLI...${NC}"
            npm install -g eas-cli
        fi
        
        eas whoami || eas login
        eas build --platform android --profile production
        ;;
    4)
        echo -e "${YELLOW}🤖 Verificando ambiente Android...${NC}"
        
        # Verificar adb
        if ! command -v adb &> /dev/null; then
            echo -e "${RED}❌ ADB não encontrado!${NC}"
            echo ""
            echo -e "${YELLOW}⚠️  Você precisa instalar o Android Studio e SDK${NC}"
            echo -e "${BLUE}ℹ️  Veja o guia: MAPA_SEM_MAC_GUIDE.md${NC}"
            echo ""
            echo "Opções:"
            echo "1. Instalar Android Studio: https://developer.android.com/studio"
            echo "2. Ou instalar android-sdk-platform-tools:"
            echo "   sudo apt install android-sdk-platform-tools"
            echo ""
            exit 1
        fi
        
        echo -e "${GREEN}✅ ADB encontrado!${NC}"
        
        # Verificar devices
        echo -e "${YELLOW}📱 Verificando devices/emuladores conectados...${NC}"
        echo ""
        adb devices
        echo ""
        
        device_count=$(adb devices | grep -v "List" | grep "device" | wc -l)
        
        if [ "$device_count" -eq 0 ]; then
            echo -e "${YELLOW}⚠️  Nenhum device/emulador encontrado!${NC}"
            echo ""
            echo "Para continuar:"
            echo "1. Conecte um celular Android via USB com USB Debugging ativado"
            echo "2. Ou inicie um emulador no Android Studio"
            echo ""
            read -p "Pressione Enter quando conectar um device..."
        fi
        
        echo -e "${YELLOW}🚀 Iniciando build Android...${NC}"
        echo -e "${BLUE}ℹ️  Isso pode demorar alguns minutos na primeira vez${NC}"
        echo ""
        
        npx expo run:android
        ;;
    5)
        echo -e "${YELLOW}🔍 Verificando configuração do Android...${NC}"
        echo ""
        
        # Verificar ADB
        if command -v adb &> /dev/null; then
            echo -e "${GREEN}✅ ADB instalado:${NC} $(adb --version | head -1)"
        else
            echo -e "${RED}❌ ADB não instalado${NC}"
        fi
        
        # Verificar ANDROID_HOME
        if [ -n "$ANDROID_HOME" ]; then
            echo -e "${GREEN}✅ ANDROID_HOME configurado:${NC} $ANDROID_HOME"
        else
            echo -e "${YELLOW}⚠️  ANDROID_HOME não configurado${NC}"
        fi
        
        # Verificar devices
        if command -v adb &> /dev/null; then
            echo ""
            echo -e "${BLUE}📱 Devices conectados:${NC}"
            adb devices
        fi
        
        # Verificar EAS CLI
        echo ""
        if command -v eas &> /dev/null; then
            echo -e "${GREEN}✅ EAS CLI instalado:${NC} $(eas --version)"
        else
            echo -e "${YELLOW}⚠️  EAS CLI não instalado${NC}"
            echo -e "${BLUE}ℹ️  Instale com: npm install -g eas-cli${NC}"
        fi
        
        echo ""
        echo -e "${BLUE}📝 Recomendações:${NC}"
        echo "- Para build na nuvem: Use EAS Build (não precisa de nada instalado)"
        echo "- Para build local: Instale Android Studio e configure ANDROID_HOME"
        echo "- Consulte: MAPA_SEM_MAC_GUIDE.md"
        ;;
    6)
        echo -e "${YELLOW}🧹 Limpando projeto...${NC}"
        
        # Limpar android
        if [ -d "android" ]; then
            echo "Removendo pasta android..."
            rm -rf android
        fi
        
        # Limpar node_modules
        echo "Removendo node_modules..."
        rm -rf node_modules
        
        # Limpar cache
        echo "Limpando cache..."
        npx expo start -c &
        EXPO_PID=$!
        sleep 3
        kill $EXPO_PID 2>/dev/null || true
        
        # Reinstalar dependências
        echo "Reinstalando dependências..."
        npm install
        
        # Rebuild Android
        echo -e "${YELLOW}🔨 Fazendo prebuild...${NC}"
        npx expo prebuild --platform android --clean
        
        echo -e "${GREEN}✅ Rebuild completo!${NC}"
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
    echo "   1. Aguarde o build terminar (pode demorar 10-20 min)"
    echo "   2. Acesse o link fornecido para baixar o APK"
    echo "   3. Instale no seu celular Android"
    echo "   4. Teste a funcionalidade de mapa!"
elif [ "$option" -eq 4 ]; then
    echo "   - O app deve abrir automaticamente no device/emulador"
    echo "   - Teste a funcionalidade de mapa!"
fi
echo ""
echo -e "${BLUE}📖 Consulte: MAPA_SEM_MAC_GUIDE.md para mais informações${NC}"
