'use client'

import { useTheme } from '@/providers/Theme'
import { useEffect, useState } from 'react'

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div 
      className="theme-switch" 
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleTheme()
        }
      }}
    >
      <div className="theme-switch-handle" />
    </div>
  )
}