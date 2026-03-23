'use client'

import { useOversight } from './OversightContext'
import { uiStrings, type Locale } from '@/i18n'

interface Props {
  label: string
  activeText: string
  disabledText: string
  tooltip: string
  locale: Locale
}

export default function OversightToggle({
  label,
  activeText,
  disabledText,
  tooltip,
  locale,
}: Props) {
  const { active, toggle } = useOversight()
  const t = uiStrings[locale]

  const action = active ? t['oversight.hide'] : t['oversight.show']
  const hint = t['oversight.hint'].replace('{action}', action)

  return (
    <div
      className="group relative flex items-center gap-2 p-3 cursor-pointer select-none"
      onClick={toggle}
    >
      <div className="relative">
        <div
          className={`w-3 h-3 rounded-full transition-colors duration-500 ${
            active ? 'bg-[#00F5D4]' : 'bg-red-500'
          }`}
        />
        {active && (
          <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#00F5D4] animate-ping opacity-30" />
        )}
      </div>
      <span className="font-sans text-xs text-[#101417] hidden sm:block tracking-wide uppercase">
        {label}: {active ? activeText : disabledText}
      </span>
      <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-[#101417] text-[#F0EEE9] text-xs font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-2xl border border-[#B9A7FF]/20 z-[60]">
        <p>{tooltip}</p>
        <p className="mt-2 text-[#00F5D4]/70 text-[10px]">{hint}</p>
      </div>
    </div>
  )
}
