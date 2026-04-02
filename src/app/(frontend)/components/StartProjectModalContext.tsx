'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import StartProjectModal from './StartProjectModal'
import type { Locale } from '@/i18n'

interface ModalContextValue {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const StartProjectModalContext = createContext<ModalContextValue | null>(null)

interface Props {
  children: ReactNode
  locale: Locale
}

export function StartProjectModalProvider({ children, locale }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <StartProjectModalContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
      <StartProjectModal locale={locale} />
    </StartProjectModalContext.Provider>
  )
}

export function useStartProjectModal() {
  const ctx = useContext(StartProjectModalContext)
  if (!ctx) throw new Error('useStartProjectModal must be used within StartProjectModalProvider')
  return ctx
}
