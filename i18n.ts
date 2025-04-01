import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';

// Define the structure of our translation resources
// This ensures type safety when accessing translations
interface Resources {
  en: {
    translation: typeof en;
  };
  vi: {
    translation: typeof vi;
  };
}

// Augment i18next types to include our custom translations
// This enables TypeScript to properly type-check translation keys
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: Resources;
  }
}

// Initialize i18next with our configuration
i18n.use(initReactI18next).init({
  // Configure available languages and their translation files
  resources: {
    en: {translation: en},
    vi: {translation: vi},
  },
  // Set Vietnamese as the default language
  lng: 'vi',
  // Fallback to Vietnamese if translation is missing
  fallbackLng: 'vi',
  interpolation: {
    // Don't escape special characters in translations
    escapeValue: false,
  },
});

export default i18n;
