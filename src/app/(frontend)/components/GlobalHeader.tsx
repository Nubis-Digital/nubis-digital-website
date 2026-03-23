import type { Header, Page } from '@/payload-types'
import type { Locale } from '@/i18n'
import OversightToggle from './OversightToggle'
import MobileMenu from './MobileMenu'
import LanguageSwitcher from './LanguageSwitcher'

function getNavHref(link: NonNullable<Header['navLinks']>[number], locale: Locale): string {
  if (link.linkType === 'page' && link.page) {
    const page = link.page as Page
    return `/${locale}/${page.slug}`
  }
  const href = link.href || '#'
  if (href.startsWith('/') || href.startsWith('#')) {
    return href.startsWith('#') ? href : `/${locale}${href}`
  }
  return href
}

interface Props {
  data: Header
  locale: Locale
}

export default function GlobalHeader({ data, locale }: Props) {
  return (
    <header className="fixed top-0 w-full border-b border-[#101417] bg-[#F0EEE9]/90 backdrop-blur-md z-50 flex items-center justify-between px-6 py-4">
      <a href={`/${locale}`} className="font-serif text-2xl text-[#101417] tracking-tight font-bold">
        {data.logoText}
        <span className="text-[#00F5D4]">{data.logoAccent}</span>
      </a>

      <nav className="hidden md:flex gap-12 font-sans text-sm text-[#101417] font-medium tracking-wide">
        {data.navLinks?.map((link, i) => (
          <a
            key={i}
            href={getNavHref(link, locale)}
            className="hover:text-[#00F5D4] transition-colors duration-300 relative group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00F5D4] transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <LanguageSwitcher locale={locale} />
        <div className="hidden sm:block">
          <OversightToggle
            label={data.oversightLabel}
            activeText={data.oversightActiveText}
            disabledText={data.oversightDisabledText}
            tooltip={data.oversightTooltip}
            locale={locale}
          />
        </div>
        <button className="hidden md:block bg-[#101417] text-[#F0EEE9] hover:bg-[#00F5D4] hover:text-[#101417] transition-all duration-500 font-sans text-sm px-6 py-3 tracking-wide">
          {data.ctaButtonText}
        </button>
        <MobileMenu
          navLinks={data.navLinks}
          ctaButtonText={data.ctaButtonText}
          locale={locale}
        />
      </div>
    </header>
  )
}
