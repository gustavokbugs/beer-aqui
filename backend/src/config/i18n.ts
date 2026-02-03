import i18next from 'i18next';
import { readFileSync } from 'fs';
import { join } from 'path';

// Carregar arquivos de tradução
const loadTranslations = (locale: string) => {
  const filePath = join(__dirname, '..', 'locales', locale, 'common.json');
  return JSON.parse(readFileSync(filePath, 'utf-8'));
};

// Inicializar i18next
i18next.init({
  lng: 'pt-BR', // Idioma padrão
  fallbackLng: 'pt-BR',
  supportedLngs: ['pt-BR', 'en', 'es'],
  resources: {
    'pt-BR': {
      translation: loadTranslations('pt-BR'),
    },
    en: {
      translation: loadTranslations('en'),
    },
    es: {
      translation: loadTranslations('es'),
    },
  },
  interpolation: {
    escapeValue: false, // React já faz escape
  },
});

export const i18n = i18next;

// Helper para obter tradução com contexto de idioma
export const t = (key: string, options?: Record<string, unknown>, lng?: string): string => {
  if (lng) {
    return i18next.t(key, { ...options, lng });
  }
  return i18next.t(key, options);
};

// Helper para trocar idioma dinamicamente
export const changeLanguage = async (lng: string): Promise<void> => {
  await i18next.changeLanguage(lng);
};

// Detectar idioma do header Accept-Language
export const detectLanguage = (acceptLanguageHeader?: string): string => {
  if (!acceptLanguageHeader) {
    return 'pt-BR';
  }

  // Parse Accept-Language header (ex: "en-US,en;q=0.9,pt-BR;q=0.8")
  const languages = acceptLanguageHeader
    .split(',')
    .map((lang) => {
      const parts = lang.trim().split(';q=');
      const locale = parts[0];
      const qValue = parts[1];
      return {
        locale: locale?.trim() || '',
        q: qValue ? parseFloat(qValue) : 1.0,
      };
    })
    .sort((a, b) => b.q - a.q);

  // Encontrar primeiro idioma suportado
  for (const { locale } of languages) {
    // Normalizar locale (en-US -> en, pt-BR -> pt-BR)
    const normalizedLocale = locale.toLowerCase();
    
    if (normalizedLocale.startsWith('pt')) {
      return 'pt-BR';
    }
    if (normalizedLocale.startsWith('en')) {
      return 'en';
    }
    if (normalizedLocale.startsWith('es')) {
      return 'es';
    }
  }

  return 'pt-BR'; // Fallback
};
