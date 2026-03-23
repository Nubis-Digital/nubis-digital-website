import { ArrowRight } from 'lucide-react'
import type { Page } from '@/payload-types'
import { Icon } from '../icons'

type CardGridBlockData = Extract<NonNullable<Page['layout']>[number], { blockType: 'card-grid-block' }>

export default function CardGridBlockComponent({ block }: { block: CardGridBlockData }) {
  return (
    <section className="py-20 px-6 bg-[#F0EEE9]">
      <div className="max-w-6xl mx-auto">
        {block.heading && (
          <h2 className="font-serif text-3xl md:text-4xl text-[#101417] mb-12 text-center">
            {block.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.cards?.map((card, idx) => (
            <div
              key={idx}
              className="border border-[#101417] p-8 bg-white/50 backdrop-blur-sm hover:bg-[#101417] hover:text-[#F0EEE9] transition-all duration-500 group"
            >
              {card.icon && (
                <div className="mb-4 text-[#00F5D4]">
                  <Icon name={card.icon} size={24} />
                </div>
              )}
              <h3 className="font-serif text-xl mb-3">{card.title}</h3>
              <p className="font-sans text-sm leading-relaxed opacity-70 mb-4">
                {card.description}
              </p>
              {card.link && (
                <a
                  href={card.link}
                  className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-[#00F5D4] group-hover:text-[#00F5D4]"
                >
                  Learn More
                  <ArrowRight size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
