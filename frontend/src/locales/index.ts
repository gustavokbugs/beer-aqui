import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Portuguese (Brazil)
import commonPtBR from './pt-BR/common.json';
import authPtBR from './pt-BR/auth.json';
import searchPtBR from './pt-BR/search.json';
import mapPtBR from './pt-BR/map.json';
import profilePtBR from './pt-BR/profile.json';
import favoritesPtBR from './pt-BR/favorites.json';

// English
import commonEn from './en/common.json';
import authEn from './en/auth.json';
import searchEn from './en/search.json';
import mapEn from './en/map.json';
import profileEn from './en/profile.json';
import favoritesEn from './en/favorites.json';

// Spanish
import commonEs from './es/common.json';
import authEs from './es/auth.json';
import searchEs from './es/search.json';
import mapEs from './es/map.json';
import profileEs from './es/profile.json';
import favoritesEs from './es/favorites.json';

const resources = {
  'pt-BR': {
    common: commonPtBR,
    auth: authPtBR,
    search: searchPtBR,
    map: mapPtBR,
    profile: profilePtBR,
    favorites: favoritesPtBR,
  },
  en: {
    common: commonEn,
    auth: authEn,
    search: searchEn,
    map: mapEn,
    profile: profileEn,
    favorites: favoritesEn,
  },
  es: {
    common: commonEs,
    auth: authEs,
    search: searchEs,
    map: mapEs,
    profile: profileEs,
    favorites: favoritesEs,
  },
};

const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'pt';
const supportedLanguages = ['pt', 'en', 'es'];
const fallbackLanguage = supportedLanguages.includes(deviceLanguage) 
  ? deviceLanguage === 'pt' ? 'pt-BR' : deviceLanguage
  : 'pt-BR';

i18n.use(initReactI18next).init({
  resources,
  lng: fallbackLanguage,
  fallbackLng: 'pt-BR',
  defaultNS: 'common',
  ns: ['common', 'auth', 'search', 'map', 'profile', 'favorites'],
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});

export default i18n;
