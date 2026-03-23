'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { TransparencyPanel as TransparencyPanelType } from '@/payload-types'

export default function TransparencyPanel({
  data,
}: {
  data: TransparencyPanelType
}) {
  const [text, setText] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const [doneTyping, setDoneTyping] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < data.message.length) {
        setText(data.message.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setDoneTyping(true)
      }
    }, 20)
    return () => clearInterval(interval)
  }, [data.message])

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
          <a
            href={data.linkUrl}
            className="ml-2 text-[#00F5D4] hover:text-[#00F5D4]/80 transition-colors"
          >
            {data.linkText}
          </a>
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
