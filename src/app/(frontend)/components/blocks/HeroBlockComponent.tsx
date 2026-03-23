import type { Page } from '@/payload-types'

type HeroBlockData = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero-block' }>

export default function HeroBlockComponent({ block }: { block: HeroBlockData }) {
  return (
    <section className="relative min-h-[60vh] flex items-center bg-[#F0EEE9] border-b border-[#101417] overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_70%_30%,#B9A7FF_0%,transparent_50%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="max-w-3xl">
          <h1 className="font-serif text-5xl md:text-7xl text-[#101417] leading-tight mb-8">
            {block.heading}
          </h1>
          <p className="font-sans text-lg md:text-xl text-[#101417]/70 leading-relaxed mb-10 max-w-2xl">
            {block.body}
          </p>
          {block.ctaText && (
            <a
              href={block.ctaLink || '#'}
              className="inline-block bg-[#101417] text-[#F0EEE9] hover:bg-[#00F5D4] hover:text-[#101417] transition-all duration-500 font-sans text-sm px-8 py-4 tracking-wide"
            >
              {block.ctaText}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
