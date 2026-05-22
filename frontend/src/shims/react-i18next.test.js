import { createElement } from 'react'
import esCommon from '../i18n/locales/es/common.json'

const resolveKey = (source, key) => {
  if (!key) return key

  return key.split('.').reduce((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return current[segment]
    }

    return undefined
  }, source)
}

export const initReactI18next = { type: '3rdParty', init: () => {} }

export function I18nextProvider({ children }) {
  return children
}

export function useTranslation() {
  return {
    i18n: { resolvedLanguage: 'es' },
    ready: true,
    t: (key, options = {}) => {
      const resolved = resolveKey(esCommon, key)

      if (typeof resolved !== 'string') {
        return key
      }

      return resolved.replace(/{{(\w+)}}/g, (_, token) => String(options[token] ?? ''))
    },
  }
}

export function Trans({ children }) {
  return createElement(createElement.Fragment, null, children)
}
