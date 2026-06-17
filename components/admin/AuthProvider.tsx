'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/auth/refresh', { method: 'POST' })
      setIsAuthenticated(res.ok)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login')
    }
    if (isAuthenticated && pathname === '/admin/login') {
      router.replace('/admin')
    }
  }, [isLoading, isAuthenticated, pathname, router])

  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(async () => {
      const res = await fetch('/api/cms/auth/refresh', { method: 'POST' })
      if (!res.ok) {
        setIsAuthenticated(false)
        router.replace('/admin/login')
      }
    }, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, router])

  const login = async (password: string) => {
    try {
      const res = await fetch('/api/cms/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const logout = async () => {
    await fetch('/api/cms/auth/logout', { method: 'POST' })
    setIsAuthenticated(false)
    router.replace('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
