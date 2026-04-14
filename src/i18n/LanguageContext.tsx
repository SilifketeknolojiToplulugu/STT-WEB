/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type SupportedLanguage = 'tr' | 'en'

interface LanguageContextValue {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
  toggleLanguage: () => void
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const LANGUAGE_STORAGE_KEY = 'silifke-tech-language'

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>('tr')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const url = new URL(window.location.href)
    const queryLanguage = url.searchParams.get('lang') as SupportedLanguage | null

    if (queryLanguage === 'tr' || queryLanguage === 'en') {
      setLanguageState(queryLanguage)
      return
    }

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null
    if (storedLanguage === 'tr' || storedLanguage === 'en') {
      setLanguageState(storedLanguage)
      return
    }

    const browserLanguage = window.navigator?.language?.toLowerCase() ?? 'tr'
    if (browserLanguage.startsWith('en')) {
      setLanguageState('en')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [language])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((nextLanguage: SupportedLanguage) => {
    setLanguageState(nextLanguage)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('lang', nextLanguage)
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const nextLanguage = prev === 'tr' ? 'en' : 'tr'
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.set('lang', nextLanguage)
        window.history.replaceState({}, '', url.toString())
      }
      return nextLanguage
    })
  }, [])

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, toggleLanguage }),
    [language, setLanguage, toggleLanguage]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}
