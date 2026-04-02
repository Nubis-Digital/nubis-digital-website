'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { TransparencyPanel as TransparencyPanelType } from '@/payload-types'
import { useDeviceOptimizer } from './DeviceOptimizerContext'
import { useTextMeasure } from '@/hooks/useTextMeasure'
import type { Locale } from '@/i18n'

// font-sans text-xs tracking-wide — matches the <p> below
const FONT = '12px Inter, ui-sans-serif, system-ui, sans-serif'
// py-2.5 × 2 = 10px × 2 — vertical padding of the <aside>
const ASIDE_PADDING_Y = 20

interface Props {
  data: TransparencyPanelType
  locale: Locale
}

export default function TransparencyPanel({ data, locale }: Props) {
  const { result, openLog } = useDeviceOptimizer()
  const asideRef = useRef<HTMLElement>(null)
  const [text, setText] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const [doneTyping, setDoneTyping] = useState(false)
  const [textWidth, setTextWidth] = useState(0)

  // Dynamic message once device audit completes
  const dynamicMessage = result
    ? locale === 'es'
      ? `Sistema Nubis: Auditoría de dispositivo completada en ${result.duration}ms — ${result.optimizations.filter((o) => o.applied).length} optimizaciones aplicadas.`
      : `Nubis System: Device audit complete in ${result.duration}ms — ${result.optimizations.filter((o) => o.applied).length} optimizations applied.`
    : null

  const dynamicLinkText = locale === 'es' ? '[Ver Registro]' : '[View Log]'
  const sourceMessage = dynamicMessage ?? data.message

  // Measure available text width after first paint so pretext has a real number.
  // dot(4) + gap(16) + gap(16) + dismissButton(24) + gap(16) + px-6(48) = ~124px overhead
  useEffect(() => {
    if (!asideRef.current) return
    setTextWidth(Math.max(asideRef.current.offsetWidth - 124, 100))
  }, [])

  // Pre-measure the full message — reserves the correct min-height before
  // the typewriter starts, preventing a height jump if the text wraps.
  const { height: measuredHeight } = useTextMeasure(sourceMessage, FONT, textWidth, 20)
  const minHeight = measuredHeight > 0 ? measuredHeight + ASIDE_PADDING_Y : undefined

  // Restart the typewriter whenever the source message changes
  useEffect(() => {
    setText('')
    setDoneTyping(false)

    let i = 0
    const delay = dynamicMessage ? 10 : 20
    const interval = setInterval(() => {
      if (i < sourceMessage.length) {
        setText(sourceMessage.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setDoneTyping(true)
      }
    }, delay)

    return () => clearInterval(interval)
  }, [sourceMessage]) // eslint-disable-line react-hooks/exhaustive-deps

  if (dismissed) return null

  return (
    <aside
      ref={asideRef}
      style={{ minHeight }}
      className={`w-full border-b border-[#101417]/10 bg-[#F0EEE9] py-2.5 px-6 flex items-center gap-4 mt-[73px] transition-[opacity,min-height] duration-500 ${
        doneTyping ? 'opacity-70 hover:opacity-100' : 'opacity-100'
      }`}
    >
      <div className="w-1 h-3 bg-[#00F5D4] rounded-full shrink-0" />
      <p className="font-sans text-xs text-[#101417]/60 flex-1 tracking-wide">
        {text}
        {doneTyping && (
          dynamicMessage ? (
            <button
              onClick={openLog}
              className="ml-2 text-[#00F5D4] hover:text-[#00F5D4]/80 transition-colors"
            >
              {dynamicLinkText}
            </button>
          ) : (
            <a
              href={data.linkUrl}
              className="ml-2 text-[#00F5D4] hover:text-[#00F5D4]/80 transition-colors"
            >
              {data.linkText}
            </a>
          )
        )}
      </p>
      {doneTyping && (
        <button
          onClick={() => setDismissed(true)}
          className="text-[#101417]/30 hover:text-[#101417]/60 transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </aside>
  )
}
