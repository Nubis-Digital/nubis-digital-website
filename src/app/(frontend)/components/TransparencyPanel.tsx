'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { TransparencyPanel as TransparencyPanelType } from '@/payload-types'
import { useDeviceOptimizer } from './DeviceOptimizerContext'
import type { Locale } from '@/i18n'

interface Props {
  data: TransparencyPanelType
  locale: Locale
}

export default function TransparencyPanel({ data, locale }: Props) {
  const { result, openLog } = useDeviceOptimizer()
  const [text, setText] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const [doneTyping, setDoneTyping] = useState(false)

  // Once the audit result arrives, generate the dynamic message
  const dynamicMessage = result
    ? locale === 'es'
      ? `Sistema Nubis: Auditoría de dispositivo completada en ${result.duration}ms — ${result.optimizations.filter((o) => o.applied).length} optimizaciones aplicadas.`
      : `Nubis System: Device audit complete in ${result.duration}ms — ${result.optimizations.filter((o) => o.applied).length} optimizations applied.`
    : null

  const dynamicLinkText = locale === 'es' ? '[Ver Registro]' : '[View Log]'

  // Source message: dynamic when ready, CMS otherwise
  const sourceMessage = dynamicMessage ?? data.message

  // Restart the typewriter whenever the source message changes
  useEffect(() => {
    setText('')
    setDoneTyping(false)

    let i = 0
    const delay = dynamicMessage ? 10 : 20 // faster for the shorter dynamic message
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
      className={`w-full border-b border-[#101417]/10 bg-[#F0EEE9] py-2.5 px-6 flex items-center gap-4 mt-[73px] transition-opacity duration-500 ${
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
