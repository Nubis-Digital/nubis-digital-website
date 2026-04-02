'use client'

import { ArrowRight } from 'lucide-react'
import { useStartProjectModal } from './StartProjectModalContext'

interface Props {
  label: string
}

export default function ServiceCtaButton({ label }: Props) {
  const { openModal } = useStartProjectModal()
  return (
    <button
      onClick={openModal}
      className="bg-[#00F5D4] text-[#101417] hover:bg-[#101417] hover:text-[#00F5D4] transition-all duration-500 font-sans text-sm px-10 py-5 tracking-wider uppercase font-semibold inline-flex items-center gap-3"
    >
      {label}
      <ArrowRight size={16} />
    </button>
  )
}
