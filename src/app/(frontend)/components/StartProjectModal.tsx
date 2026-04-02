'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, X } from 'lucide-react'
import { useStartProjectModal } from './StartProjectModalContext'
import { useAutoGrowTextarea } from '@/hooks/useAutoGrowTextarea'
import { uiStrings, type Locale } from '@/i18n'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  locale: Locale
}

export default function StartProjectModal({ locale }: Props) {
  const { isOpen, closeModal } = useStartProjectModal()
  const t = uiStrings[locale]
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [messageValue, setMessageValue] = useState('')
  const { ref: textareaRef, height: textareaHeight } = useAutoGrowTextarea(messageValue)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Reset form state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle')
      setErrorMsg('')
    }
  }, [isOpen])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const formData = new FormData(form)

    const body = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.errors?.[0]?.message || t['contact.error'])
      }

      setStatus('success')
      setMessageValue('')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : t['contact.error'])
    }
  }

  if (!mounted) return null

  const modal = (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center px-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#101417]/80 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative bg-[#F0EEE9] w-full max-w-2xl border border-[#101417] transition-all duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-4'
        }`}
      >
        {/* Close */}
        <button
          onClick={closeModal}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center border border-[#101417]/20 hover:border-[#101417] hover:bg-[#101417] hover:text-[#F0EEE9] text-[#101417] transition-all duration-300"
        >
          <X size={16} />
        </button>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[1px] w-8 bg-[#101417]" />
            <span className="font-sans text-xs uppercase tracking-widest text-[#101417]/50">
              {t['startProject.sectionLabel']}
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-[#101417] mb-2 leading-tight">
            {t['startProject.headline']}
          </h2>
          <p className="font-serif text-lg italic text-[#101417]/50 mb-8">
            {t['startProject.subheadline']}
          </p>

          {/* Form */}
          {status === 'success' ? (
            <div className="border border-[#00F5D4] bg-[#00F5D4]/5 p-8 text-center">
              <div className="w-3 h-3 rounded-full bg-[#00F5D4] mx-auto mb-4" />
              <h3 className="font-sans text-lg font-semibold text-[#101417] mb-2">
                {t['contact.successTitle']}
              </h3>
              <p className="font-sans text-sm text-[#101417]/60">
                {t['contact.successBody']}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="modal-name"
                    className="block font-sans text-xs uppercase tracking-widest text-[#101417]/50 mb-2"
                  >
                    {t['contact.name']}
                  </label>
                  <input
                    id="modal-name"
                    name="name"
                    type="text"
                    required
                    maxLength={200}
                    className="w-full bg-transparent border border-[#101417] px-4 py-3 font-sans text-sm text-[#101417] placeholder:text-[#101417]/30 focus:outline-none focus:border-[#00F5D4] transition-colors"
                    placeholder={t['contact.namePlaceholder']}
                  />
                </div>
                <div>
                  <label
                    htmlFor="modal-email"
                    className="block font-sans text-xs uppercase tracking-widest text-[#101417]/50 mb-2"
                  >
                    {t['contact.email']}
                  </label>
                  <input
                    id="modal-email"
                    name="email"
                    type="email"
                    required
                    className="w-full bg-transparent border border-[#101417] px-4 py-3 font-sans text-sm text-[#101417] placeholder:text-[#101417]/30 focus:outline-none focus:border-[#00F5D4] transition-colors"
                    placeholder={t['contact.emailPlaceholder']}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="modal-message"
                  className="block font-sans text-xs uppercase tracking-widest text-[#101417]/50 mb-2"
                >
                  {t['contact.message']}
                </label>
                <textarea
                  ref={textareaRef}
                  id="modal-message"
                  name="message"
                  required
                  maxLength={2000}
                  rows={4}
                  value={messageValue}
                  onChange={(e) => setMessageValue(e.target.value)}
                  style={textareaHeight ? { height: textareaHeight } : undefined}
                  className="w-full bg-transparent border border-[#101417] px-4 py-3 font-sans text-sm text-[#101417] placeholder:text-[#101417]/30 focus:outline-none focus:border-[#00F5D4] transition-[height,border-color] duration-150 resize-none overflow-hidden"
                  placeholder={t['contact.messagePlaceholder']}
                />
              </div>

              {status === 'error' && (
                <p className="font-sans text-sm text-red-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-[#101417] text-[#00F5D4] hover:bg-[#00F5D4] hover:text-[#101417] transition-all duration-500 font-sans text-sm px-8 py-4 tracking-wider uppercase font-semibold inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? t['contact.submitting'] : t['contact.submit']}
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
