'use client'
import { createContext, useContext, useEffect, useState } from 'react'
type Theme='dark'|'light'
const Ctx = createContext<{ theme: Theme, toggle: () => void }>({ theme:'dark', toggle: () => {} })

export default function ThemeProvider({ children }:{ children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    const next = saved ?? (prefersDark ? 'dark' : 'light')
    setTheme(next); document.documentElement.setAttribute('data-theme', next)
  }, [])
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme) }, [theme])
  return <Ctx.Provider value={{ theme, toggle: () => setTheme(t => t==='dark' ? 'light' : 'dark') }}>{children}</Ctx.Provider>
}
export const useTheme = () => useContext(Ctx)
