import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import esCommon from './locales/es/common.json'
import enCommon from './locales/en/common.json'

const resources = {
  es: { common: esCommon },
  en: { common: enCommon },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'squarestruct-lang',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  })

i18n.on('languageChanged', (language) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('squarestruct-lang', language)
  }

  if (typeof document !== 'undefined') {
    document.documentElement.lang = language
  }
})

export default i18n