import type { Page } from '@/payload-types'

type CTABlockData = Extract<NonNullable<Page['layout']>[number], { blockType: 'cta-block' }>

export default function CTABlockComponent({ block }: { block: CTABlockData }) {
  const isDark = block.style === 'dark'

  return (
    <section
      className={`py-20 px-6 ${
        isDark
          ? 'bg-[#101417] text-[#F0EEE9]'
          : 'bg-[#00F5D4] text-[#101417]'
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-6">
          {block.heading}
        </h2>
        {block.body && (
          <p className={`font-sans text-lg mb-10 max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-[#F0EEE9]/70' : 'text-[#101417]/80'
          }`}>
            {block.body}
          </p>
        )}
        <a
          href={block.buttonLink}
          className={`inline-block font-sans text-sm px-8 py-4 tracking-wide transition-all duration-500 ${
            isDark
              ? 'bg-[#00F5D4] text-[#101417] hover:bg-[#B9A7FF]'
              : 'bg-[#101417] text-[#F0EEE9] hover:bg-[#B9A7FF] hover:text-[#101417]'
          }`}
        >
          {block.buttonText}
        </a>
      </div>
    </section>
  )
}
