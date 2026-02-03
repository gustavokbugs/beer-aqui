import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import commonPtBR from './pt-BR/common.json';
import authPtBR from './pt-BR/auth.json';
import searchPtBR from './pt-BR/search.json';

const resources = {
  'pt-BR': {
    common: commonPtBR,
    auth: authPtBR,
    search: searchPtBR,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0]?.languageCode || 'pt',
  fallbackLng: 'pt-BR',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});

export default i18n;
