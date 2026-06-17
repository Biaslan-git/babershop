'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  accentHue: number
  setTheme: (theme: Theme) => void
  setAccentHue: (hue: number) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [accentHue, setAccentHueState] = useState(210)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('cms-theme') as Theme | null
    const savedHue = localStorage.getItem('cms-accent-hue')

    if (savedTheme) setThemeState(savedTheme)
    if (savedHue) setAccentHueState(parseInt(savedHue, 10))
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('cms-theme', theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.style.setProperty('--accent-hue', String(accentHue))
    localStorage.setItem('cms-accent-hue', String(accentHue))
  }, [accentHue, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const setAccentHue = async (hue: number) => {
    setAccentHueState(hue)
    try {
      await fetch('/api/cms/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accentHue: hue }),
      })
    } catch {
      // Ignore
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, accentHue, setTheme, setAccentHue }}>
      {children}
    </ThemeContext.Provider>
  )
}
