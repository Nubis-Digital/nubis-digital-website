import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from 'lexical'
import type { Page } from '@/payload-types'

type ContentBlockData = Extract<NonNullable<Page['layout']>[number], { blockType: 'content-block' }>

export default function ContentBlockComponent({ block }: { block: ContentBlockData }) {
  return (
    <section className="py-20 px-6 bg-[#F0EEE9]">
      <div className="max-w-3xl mx-auto prose prose-lg prose-headings:font-serif prose-headings:text-[#101417] prose-p:text-[#101417]/80 prose-p:font-sans prose-p:leading-relaxed prose-a:text-[#00F5D4] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#101417]">
        <RichText data={block.content as unknown as SerializedEditorState} />
      </div>
    </section>
  )
}
