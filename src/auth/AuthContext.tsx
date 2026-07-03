import { createContext, useContext, useState, type ReactNode } from 'react'

interface DecodedToken {
  sub: string
  role: string
  universityId?: number
  firstName?: string
  surname?: string
  iat: number
  exp: number
}

interface AuthContextValue {
  token: string | null
  role: string | null
  email: string | null
  universityId: number | null
  firstName: string | null
  surname: string | null
  displayName: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

function buildDisplayName(decoded: DecodedToken): string {
  if (decoded.firstName && decoded.surname) return `${decoded.firstName} ${decoded.surname}`
  return decoded.sub
}

function decodeToken(token: string): DecodedToken | null {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

function isExpired(decoded: DecodedToken): boolean {
  return decoded.exp * 1000 < Date.now()
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('token')
    if (!stored) return null
    const decoded = decodeToken(stored)
    if (!decoded || isExpired(decoded)) {
      localStorage.removeItem('token')
      return null
    }
    return stored
  })

  const decoded = token ? decodeToken(token) : null

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{
      token,
      role: decoded?.role ?? null,
      email: decoded?.sub ?? null,
      universityId: decoded?.universityId ?? null,
      firstName: decoded?.firstName ?? null,
      surname: decoded?.surname ?? null,
      displayName: decoded ? buildDisplayName(decoded) : null,
      isAuthenticated: !!token,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
