'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import { uiStrings, type Locale } from '@/i18n'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  locale: Locale
}

export default function ContactSection({ locale }: Props) {
  const t = uiStrings[locale]
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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
        throw new Error(
          data?.errors?.[0]?.message || t['contact.error'],
        )
      }

      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err instanceof Error ? err.message : t['contact.error'],
      )
    }
  }

  return (
    <section className="bg-[#F0EEE9] border-b border-[#101417] py-20 md:py-28 px-8 md:px-16">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[1px] w-12 bg-[#101417]" />
            <span className="font-sans text-xs uppercase tracking-widest text-[#101417]/50">
              {t['contact.sectionLabel']}
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl text-[#101417] mb-3 leading-tight">
            {t['contact.headline']}
          </h2>
          <p className="font-serif text-xl italic text-[#101417]/50 mb-12">
            {t['contact.subheadline']}
          </p>
        </ScrollReveal>

        {status === 'success' ? (
          <ScrollReveal>
            <div className="border border-[#00F5D4] bg-[#00F5D4]/5 p-8 text-center">
              <div className="w-3 h-3 rounded-full bg-[#00F5D4] mx-auto mb-4" />
              <h3 className="font-sans text-lg font-semibold text-[#101417] mb-2">
                {t['contact.successTitle']}
              </h3>
              <p className="font-sans text-sm text-[#101417]/60">
                {t['contact.successBody']}
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={100}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-sans text-xs uppercase tracking-widest text-[#101417]/50 mb-2"
                  >
                    {t['contact.name']}
                  </label>
                  <input
                    id="name"
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
                    htmlFor="email"
                    className="block font-sans text-xs uppercase tracking-widest text-[#101417]/50 mb-2"
                  >
                    {t['contact.email']}
                  </label>
                  <input
                    id="email"
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
                  htmlFor="message"
                  className="block font-sans text-xs uppercase tracking-widest text-[#101417]/50 mb-2"
                >
                  {t['contact.message']}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  maxLength={2000}
                  rows={5}
                  className="w-full bg-transparent border border-[#101417] px-4 py-3 font-sans text-sm text-[#101417] placeholder:text-[#101417]/30 focus:outline-none focus:border-[#00F5D4] transition-colors resize-none"
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
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
