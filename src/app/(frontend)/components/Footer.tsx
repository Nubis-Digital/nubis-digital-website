import type { Footer as FooterType } from '@/payload-types'

export default function Footer({ data }: { data: FooterType }) {
  return (
    <footer className="bg-[#101417] text-[#F0EEE9] p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center border-t-4 border-[#00F5D4]">
      <div className="mb-6 md:mb-0">
        <div className="font-serif text-3xl tracking-tight mb-2">
          {data.logoText}
          <span className="text-[#00F5D4]">{data.logoAccent}</span>
        </div>
        <p className="font-sans text-xs text-[#F0EEE9]/50 uppercase tracking-widest">
          {data.tagline}
        </p>
      </div>
      <div className="font-sans text-sm text-[#F0EEE9]/70 flex flex-col md:flex-row gap-6">
        {data.footerLinks?.map((link, i) => (
          <a
            key={i}
            href={link.href}
            className="hover:text-[#00F5D4] transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
