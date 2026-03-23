import { ArrowLeft, Cpu } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from 'lexical'
import type { Service, Media } from '@/payload-types'
import { Icon } from './icons'

const ACCENT_COLOR_MAP: Record<string, string> = {
  'deep-ink': 'text-[#101417]',
  'plasma-teal': 'text-[#00F5D4]',
  'holo-lilac': 'text-[#B9A7FF]',
}

export default function ServiceDetail({ service }: { service: Service }) {
  const featuredImage = service.featuredImage as Media | null

  return (
    <main className="pt-[73px]">
      {/* Hero Section */}
      <section className="relative bg-[#101417] text-[#F0EEE9] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,#00F5D4_0%,transparent_50%)]"
        />
        <div
          className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_30%,#B9A7FF_0%,transparent_50%)]"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <a
            href="/#services"
            className="inline-flex items-center gap-2 font-sans text-sm text-[#F0EEE9]/60 hover:text-[#00F5D4] transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to Services
          </a>

          <div className="flex items-center gap-3 mb-4">
            <div className="text-[#00F5D4]">
              <Icon name={service.icon} size={28} />
            </div>
            <span className="font-sans text-xs uppercase tracking-widest text-[#F0EEE9]/50">
              {service.label}
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-4">
            {service.title}
          </h1>
          <p className="font-sans text-lg text-[#00F5D4] bg-[#F0EEE9]/10 self-start inline-block px-4 py-2 mb-8">
            {service.subtitle}
          </p>
          <p className="font-sans text-xl text-[#F0EEE9]/70 leading-relaxed max-w-3xl">
            {service.description}
          </p>
        </div>

        {featuredImage?.url && (
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 hidden lg:block">
            <img
              src={featuredImage.url}
              alt={featuredImage.alt || service.label}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </section>

      {/* Specs + Agentic Edge */}
      <section className="bg-[#F0EEE9] border-b border-[#101417]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Deployment Specs */}
            <div className="border border-[#101417] p-8 bg-white/50 backdrop-blur-sm">
              <h2 className="font-sans text-xs uppercase tracking-widest text-[#101417]/50 mb-6 border-b border-[#101417]/20 pb-3">
                Deployment Specs
              </h2>
              <div className="space-y-6">
                {service.specs?.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between font-sans"
                  >
                    <span className="text-[#101417]/70 text-sm">{spec.label}</span>
                    <span
                      className={`flex items-center gap-2 font-mono font-medium text-sm ${ACCENT_COLOR_MAP[spec.accentColor] || 'text-[#101417]'}`}
                    >
                      <Icon name={spec.icon} size={16} />
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Agentic Edge */}
            <div className="border border-[#101417] p-8 bg-[#101417] text-[#F0EEE9]">
              <h2 className="font-sans text-xs uppercase tracking-widest text-[#00F5D4] mb-6 border-b border-[#F0EEE9]/20 pb-3 flex items-center gap-2">
                <Cpu size={16} /> The Agentic Edge
              </h2>
              <p className="font-sans text-sm leading-relaxed text-[#F0EEE9]/80">
                {service.agenticEdge}
              </p>
            </div>
          </div>

          {/* Plugins */}
          <div className="mt-12 border-t border-[#101417] pt-10">
            <h2 className="font-sans text-sm uppercase tracking-widest text-[#101417] mb-6 font-semibold">
              Bespoke Plugins & Integrations
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {service.plugins?.map((plugin, idx) => (
                <li
                  key={idx}
                  className="font-sans text-sm text-[#101417] flex items-start gap-3 border border-[#101417]/20 p-4"
                >
                  <div className="w-2 h-2 rounded-full bg-[#B9A7FF] mt-1.5 shrink-0" />
                  {plugin.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Detail Content (Rich Text) */}
      {service.detailContent && (
        <section className="py-20 px-6 bg-[#F0EEE9]">
          <div className="max-w-3xl mx-auto prose prose-lg prose-headings:font-serif prose-headings:text-[#101417] prose-p:text-[#101417]/80 prose-p:font-sans prose-p:leading-relaxed prose-a:text-[#00F5D4] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#101417]">
            <RichText data={service.detailContent as unknown as SerializedEditorState} />
          </div>
        </section>
      )}
    </main>
  )
}
