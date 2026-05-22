import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'
import i18next from 'i18next'

const I18nContext = createContext({ i18n: i18next })

export const initReactI18next = {
  type: '3rdParty',
  init: () => {},
}

export function I18nextProvider({ children, i18n: providedI18n = i18next }) {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const rerender = () => setVersion((current) => current + 1)

    providedI18n.on('languageChanged', rerender)
    providedI18n.on('loaded', rerender)

    return () => {
      providedI18n.off('languageChanged', rerender)
      providedI18n.off('loaded', rerender)
    }
  }, [providedI18n])

  const contextValue = useMemo(() => ({ i18n: providedI18n, version }), [providedI18n, version])

  return createElement(I18nContext.Provider, { value: contextValue }, children)
}

export function useTranslation(namespace = 'common') {
  const context = useContext(I18nContext)
  const activeI18n = context?.i18n || i18next
  const [, setVersion] = useState(0)

  useEffect(() => {
    const rerender = () => setVersion((current) => current + 1)

    activeI18n.on('languageChanged', rerender)
    activeI18n.on('loaded', rerender)

    return () => {
      activeI18n.off('languageChanged', rerender)
      activeI18n.off('loaded', rerender)
    }
  }, [activeI18n])

  const language = activeI18n.resolvedLanguage || activeI18n.language
  const t = useMemo(
    () => (key, options) => activeI18n.t(key, { ns: namespace, ...options, lng: language }),
    [activeI18n, language, namespace],
  )

  return {
    t,
    i18n: activeI18n,
    ready: true,
  }
}

export function Trans({ children }) {
  return children
}
