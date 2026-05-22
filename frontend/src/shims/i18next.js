import esCommon from '../i18n/locales/es/common.json'
import enCommon from '../i18n/locales/en/common.json'

const listeners = new Map()

const resources = {
  es: { common: esCommon },
  en: { common: enCommon },
}

let activeLanguage = 'es'

const resolveKey = (source, key) => (
  String(key || '')
    .split('.')
    .reduce((current, segment) => {
      if (current && typeof current === 'object' && segment in current) {
        return current[segment]
      }

      return undefined
    }, source)
)

const interpolate = (value, options = {}) => (
  String(value).replace(/{{(\w+)}}/g, (_, token) => String(options[token] ?? ''))
)

const emit = (event) => {
  const handlers = listeners.get(event) || []
  handlers.forEach((handler) => handler(activeLanguage))
}

const i18n = {
  language: activeLanguage,
  resolvedLanguage: activeLanguage,
  use() {
    return this
  },
  init(options = {}) {
    activeLanguage = options.lng || options.fallbackLng || activeLanguage
    this.language = activeLanguage
    this.resolvedLanguage = activeLanguage
    emit('loaded')
    return Promise.resolve(this)
  },
  t(key, options = {}) {
    const namespace = options.ns || 'common'
    const dictionary = resources[activeLanguage]?.[namespace] || resources.es.common
    const resolved = resolveKey(dictionary, key)

    return typeof resolved === 'string' ? interpolate(resolved, options) : key
  },
  changeLanguage(nextLanguage = 'es') {
    activeLanguage = resources[nextLanguage] ? nextLanguage : 'es'
    this.language = activeLanguage
    this.resolvedLanguage = activeLanguage
    emit('languageChanged')
    return Promise.resolve(this)
  },
  on(event, handler) {
    const handlers = listeners.get(event) || []
    listeners.set(event, [...handlers, handler])
  },
  off(event, handler) {
    const handlers = listeners.get(event) || []
    listeners.set(event, handlers.filter((current) => current !== handler))
  },
}

export default i18n
