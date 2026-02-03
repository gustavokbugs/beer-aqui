# BeerAqui 🍺

> Find cold beer near you

[Português](README.md) | [Español](README.es.md)

## 📱 About

BeerAqui is a mobile app that connects consumers to beer-selling establishments near their location. Geo-based search, price comparison, and featured ads.

## 🚀 Technologies

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

## 📦 Structure

```
beer-aqui/
├── backend/          # REST API
├── frontend/         # React Native App
└── context/          # Documentation and roadmap
```

## 🛠️ Installation

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
# or
npx react-native run-ios
```

## 👥 Users

- **Client**: Search beer by location, compare prices
- **Vendor**: Register business and products

## 🔒 Requirements

- User must confirm 18+ years old
- Location permission required
- Valid business ID for vendors

## 📄 License

MIT
