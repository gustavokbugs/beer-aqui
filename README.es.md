# BeerAqui 🍺

> Encuentra cerveza fría cerca de ti

[Português](README.md) | [English](README.en.md)

## 📱 Acerca de

BeerAqui es una aplicación móvil que conecta consumidores con establecimientos que venden cerveza cerca de su ubicación. Búsqueda geolocalizada, comparación de precios y anuncios destacados.

## 🚀 Tecnologías

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

## 📦 Estructura

```
beer-aqui/
├── backend/          # API REST
├── frontend/         # App React Native
└── context/          # Documentación y roadmap
```

## 🛠️ Instalación

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
# o
npx react-native run-ios
```

## 👥 Usuarios

- **Cliente**: Busca cerveza por ubicación, compara precios
- **Vendedor**: Registra establecimiento y productos

## 🔒 Requisitos

- Usuario debe confirmar +18 años
- Permiso de ubicación obligatorio
- Identificación fiscal válida para vendedores

## 📄 Licencia

MIT
