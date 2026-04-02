'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { runDeviceAudit, type OptimizationResult } from '@/lib/device-optimizer'
import type { Locale } from '@/i18n'

interface OptimizerContextValue {
  result: OptimizationResult | null
  isLogOpen: boolean
  openLog: () => void
  closeLog: () => void
}

const DeviceOptimizerContext = createContext<OptimizerContextValue | null>(null)

interface Props {
  children: ReactNode
  locale: Locale
}

export function DeviceOptimizerProvider({ children, locale: _locale }: Props) {
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [isLogOpen, setIsLogOpen] = useState(false)

  useEffect(() => {
    runDeviceAudit().then(setResult)
  }, [])

  const openLog = useCallback(() => setIsLogOpen(true), [])
  const closeLog = useCallback(() => setIsLogOpen(false), [])

  return (
    <DeviceOptimizerContext.Provider value={{ result, isLogOpen, openLog, closeLog }}>
      {children}
    </DeviceOptimizerContext.Provider>
  )
}

export function useDeviceOptimizer() {
  const ctx = useContext(DeviceOptimizerContext)
  if (!ctx) throw new Error('useDeviceOptimizer must be used within DeviceOptimizerProvider')
  return ctx
}
