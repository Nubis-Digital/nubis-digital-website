'use client'

import { useStartProjectModal } from './StartProjectModalContext'

interface Props {
  text: string
  className?: string
}

export default function HeaderCtaButton({ text, className }: Props) {
  const { openModal } = useStartProjectModal()

  return (
    <button onClick={openModal} className={className}>
      {text}
    </button>
  )
}
