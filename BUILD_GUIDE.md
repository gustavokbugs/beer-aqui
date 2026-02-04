# 📱 Guia de Build - BeerAqui

## Por que preciso de um build customizado?

O **react-native-maps** requer código nativo e não funciona no Expo Go. Para ter todas as funcionalidades (incluindo o mapa), você precisa criar um build de desenvolvimento.

## Opções de Build

### 1. Build Local (Requer Android SDK/Xcode)

#### Pré-requisitos
- **Android**: Android Studio com SDK configurado
- **iOS**: macOS com Xcode instalado

#### Comandos

```bash
cd frontend

# Gerar pastas nativas
npx expo prebuild --clean

# Android
npx expo run:android

# iOS (apenas macOS)
npx expo run:ios
```

---

### 2. Build Online com EAS (Recomendado)

Mais simples, não requer SDKs locais.

#### Passo 1: Criar conta Expo

Crie uma conta em: https://expo.dev

#### Passo 2: Login

```bash
cd frontend
npx eas login
```

#### Passo 3: Configurar projeto

```bash
npx eas build:configure
```

#### Passo 4: Criar build de desenvolvimento

**Android (APK para instalar no celular):**
```bash
npx eas build --profile development --platform android
```

**iOS (Simulator ou dispositivo físico):**
```bash
npx eas build --profile development --platform ios
```

#### Passo 5: Baixar e instalar

Após o build terminar (15-20 min), você receberá um link para baixar o APK/IPA.

- **Android**: Baixe o APK e instale diretamente no celular
- **iOS**: Precisa adicionar seu device no Apple Developer Account

---

### 3. Testar Sem Build (Atual)

No Expo Go, o mapa mostra:
- ✅ Sua localização atual (lat/long)
- ✅ Botão para atualizar localização
- ⚠️ Mapa interativo não disponível (requer build)

---

## Iniciar App com Build de Desenvolvimento

### Após criar o build e instalar no celular:

```bash
cd frontend
npm start
```

- Escaneie o QR code com a **app BeerAqui** (não mais Expo Go)
- O app abrirá com todas as funcionalidades nativas

---

## Builds de Produção

### Android (Google Play)

```bash
npx eas build --profile production --platform android
```

Gera um **AAB** (Android App Bundle) para upload na Play Store.

### iOS (App Store)

```bash
npx eas build --profile production --platform ios
```

Gera um **IPA** para upload na App Store Connect.

---

## Configurações já Feitas

✅ `app.json` - Configurado com `expo-dev-client`  
✅ `eas.json` - Perfis de build (development, preview, production)  
✅ `.gitignore` - Pastas /android e /ios ignoradas  
✅ `MapScreen.tsx` - Fallback para Expo Go  

---

## Troubleshooting

### "adb not found" ou "Android SDK not found"

Use o build online com EAS ao invés de local.

### "Command PhaseScriptExecution failed" (iOS)

```bash
cd ios
pod install
cd ..
npx expo run:ios
```

### O app não conecta no backend

Verifique o IP em `frontend/.env`:
```
EXPO_PUBLIC_API_URL=http://192.168.0.13:3000/api/v1
```

Use o IP da sua máquina na rede local.

---

## Recursos

- [Expo Dev Client](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)

---

**Última atualização**: 04/02/2026
