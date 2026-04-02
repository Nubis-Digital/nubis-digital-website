'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Check, Minus } from 'lucide-react'
import { useDeviceOptimizer } from './DeviceOptimizerContext'
import type { Locale } from '@/i18n'

interface Props {
  locale: Locale
}

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-[#F0EEE9]/5 last:border-0">
      <span className="font-sans text-xs uppercase tracking-widest text-[#F0EEE9]/30 shrink-0">
        {label}
      </span>
      <span className="font-mono text-xs text-[#F0EEE9]/70 text-right">{value}</span>
    </div>
  )
}

export default function OptimizationLogPanel({ locale }: Props) {
  const { result, isLogOpen, closeLog } = useDeviceOptimizer()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLogOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isLogOpen])

  if (!mounted) return null

  const s = result?.signals
  const applied = result?.optimizations.filter((o) => o.applied) ?? []
  const skipped = result?.optimizations.filter((o) => !o.applied) ?? []

  const connectionLabel = s?.connection
    ? `${s.connection.type.toUpperCase()} · ${s.connection.downlink} Mbps · ${s.connection.rtt}ms RTT`
    : locale === 'es'
      ? 'No disponible'
      : 'Unavailable'

  const memoryLabel = s?.memory != null ? `${s.memory} GB RAM · ${s?.cores} cores` : locale === 'es' ? 'No disponible' : 'Unavailable'

  const batteryLabel =
    s?.battery != null
      ? `${Math.round(s.battery.level * 100)}% ${s.battery.charging ? (locale === 'es' ? '· Cargando' : '· Charging') : ''}`
      : locale === 'es'
        ? 'No disponible'
        : 'Unavailable'

  const panelTitle = locale === 'es' ? 'Registro de Optimización' : 'Optimization Log'
  const deviceProfileTitle = locale === 'es' ? 'Perfil de Dispositivo' : 'Device Profile'
  const appliedTitle = locale === 'es' ? `Optimizaciones Aplicadas (${applied.length})` : `Optimizations Applied (${applied.length})`
  const skippedTitle = locale === 'es' ? `No Aplicadas (${skipped.length})` : `Skipped (${skipped.length})`
  const durationLabel = locale === 'es' ? `Auditoría completada en ${result?.duration ?? 0}ms` : `Audit complete in ${result?.duration ?? 0}ms`

  const panel = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[900] bg-[#101417]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isLogOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeLog}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#101417] z-[901] overflow-y-auto transition-transform duration-300 ease-out ${
          isLogOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#101417] border-b border-[#F0EEE9]/10 px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />
              <span className="font-sans text-xs uppercase tracking-widest text-[#00F5D4]">
                Nubis System
              </span>
            </div>
            <h2 className="font-serif text-xl text-[#F0EEE9]">{panelTitle}</h2>
          </div>
          <button
            onClick={closeLog}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center border border-[#F0EEE9]/20 hover:border-[#F0EEE9]/50 text-[#F0EEE9]/50 hover:text-[#F0EEE9] transition-all duration-200"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Duration badge */}
          <div className="inline-flex items-center gap-2 border border-[#00F5D4]/30 px-3 py-1.5">
            <div className="w-1 h-1 rounded-full bg-[#00F5D4]" />
            <span className="font-mono text-xs text-[#00F5D4]">{durationLabel}</span>
          </div>

          {/* Device profile */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-[#F0EEE9]/30 mb-3">
              {deviceProfileTitle}
            </p>
            <div>
              <SignalRow
                label={locale === 'es' ? 'Pantalla' : 'Display'}
                value={s ? `${s.dpr}× DPR · ${s.viewport.width}×${s.viewport.height}px` : '—'}
              />
              <SignalRow
                label={locale === 'es' ? 'Conexión' : 'Connection'}
                value={connectionLabel}
              />
              <SignalRow
                label={locale === 'es' ? 'Hardware' : 'Hardware'}
                value={memoryLabel}
              />
              <SignalRow
                label={locale === 'es' ? 'Batería' : 'Battery'}
                value={batteryLabel}
              />
              <SignalRow
                label={locale === 'es' ? 'Movimiento' : 'Motion'}
                value={
                  s?.motion === 'reduce'
                    ? locale === 'es'
                      ? 'Reducido'
                      : 'Reduced'
                    : locale === 'es'
                      ? 'Estándar'
                      : 'Standard'
                }
              />
              <SignalRow
                label={locale === 'es' ? 'Contraste' : 'Contrast'}
                value={
                  s?.contrast === 'more'
                    ? locale === 'es'
                      ? 'Alto'
                      : 'High'
                    : locale === 'es'
                      ? 'Estándar'
                      : 'Standard'
                }
              />
              <SignalRow
                label={locale === 'es' ? 'Puntero' : 'Pointer'}
                value={
                  s?.touch
                    ? locale === 'es'
                      ? 'Táctil'
                      : 'Touch'
                    : locale === 'es'
                      ? 'Cursor'
                      : 'Cursor'
                }
              />
            </div>
          </div>

          {/* Applied optimizations */}
          {applied.length > 0 && (
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-[#00F5D4]/60 mb-3">
                {appliedTitle}
              </p>
              <div className="space-y-3">
                {applied.map((opt) => (
                  <div key={opt.id} className="flex gap-3">
                    <div className="w-5 h-5 border border-[#00F5D4]/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} className="text-[#00F5D4]" />
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold text-[#F0EEE9] tracking-wide uppercase mb-0.5">
                        {opt.label}
                      </p>
                      <p className="font-sans text-xs text-[#F0EEE9]/40 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skipped */}
          {skipped.length > 0 && (
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-[#F0EEE9]/20 mb-3">
                {skippedTitle}
              </p>
              <div className="space-y-3">
                {skipped.map((opt) => (
                  <div key={opt.id} className="flex gap-3 opacity-50">
                    <div className="w-5 h-5 border border-[#F0EEE9]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Minus size={10} className="text-[#F0EEE9]/40" />
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold text-[#F0EEE9]/60 tracking-wide uppercase mb-0.5">
                        {opt.label}
                      </p>
                      <p className="font-sans text-xs text-[#F0EEE9]/30 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return createPortal(panel, document.body)
}
