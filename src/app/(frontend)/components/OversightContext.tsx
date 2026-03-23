'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface OversightState {
  active: boolean
  toggle: () => void
}

const OversightContext = createContext<OversightState>({
  active: true,
  toggle: () => {},
})

export function OversightProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(true)
  const toggle = () => setActive((prev) => !prev)

  return (
    <OversightContext.Provider value={{ active, toggle }}>
      {children}
    </OversightContext.Provider>
  )
}

export function useOversight() {
  return useContext(OversightContext)
}
