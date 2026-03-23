'use client'

import { useOversight } from './OversightContext'

interface Props {
  note: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const positionClasses: Record<string, string> = {
  'top-right': 'top-2 right-2',
  'top-left': 'top-2 left-2',
  'bottom-right': 'bottom-2 right-2',
  'bottom-left': 'bottom-2 left-2',
}

export default function OversightBadge({
  note,
  position = 'top-right',
}: Props) {
  const { active } = useOversight()

  return (
    <div
      className={`absolute ${positionClasses[position]} z-20 flex items-center gap-2 bg-[#101417]/90 backdrop-blur-sm border border-[#B9A7FF]/30 px-3 py-1.5 rounded-full transition-all duration-500 ${
        active
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-[#B9A7FF] animate-pulse" />
      <span className="font-sans text-[10px] text-[#F0EEE9]/80 tracking-wide whitespace-nowrap">
        {note}
      </span>
    </div>
  )
}
