# BeerAqui 🍺

> Encontre cerveja gelada perto de você

[English](README.en.md) | [Español](README.es.md)

## 📱 Sobre

BeerAqui é um aplicativo mobile que conecta consumidores a estabelecimentos que vendem cerveja próximos à sua localização. Busca geolocalizada, comparação de preços e anúncios destacados.

## 🚀 Tecnologias

### Frontend
- React Native + TypeScript
- React Navigation
- i18next (pt-BR, en, es)
- Zustand/Redux Toolkit
- React Native Maps

### Backend
- Node.js + TypeScript
- PostgreSQL + PostGIS
- Clean Architecture
- JWT Authentication
- Docker

## 📦 Estrutura

```
beer-aqui/
├── backend/          # API REST
├── frontend/         # App React Native
└── context/          # Documentação e roadmap
```

## 🛠️ Instalação

### Backend
```bash
cd backend
npm install
docker-compose up -d
npm run migrate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npx react-native run-android
# ou
npx react-native run-ios
```

## 👥 Usuários

- **Cliente**: Busca cerveja por localização, compara preços
- **Vendedor**: Cadastra estabelecimento e produtos

## 🔒 Requisitos

- Usuário deve confirmar +18 anos
- Permissão de localização obrigatória
- CNPJ válido para vendedores

## 📄 Licença

MIT
