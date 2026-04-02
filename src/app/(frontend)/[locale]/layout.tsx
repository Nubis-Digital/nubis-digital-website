import type { ReactNode } from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import { getPayload } from 'payload'
import config from '@payload-config'
import { type Locale } from '@/i18n'
import GlobalHeader from '../components/GlobalHeader'
import Footer from '../components/Footer'
import { OversightProvider } from '../components/OversightContext'
import { StartProjectModalProvider } from '../components/StartProjectModalContext'
import { DeviceOptimizerProvider } from '../components/DeviceOptimizerContext'
import OptimizationLogPanel from '../components/OptimizationLogPanel'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata = {
  title: 'Nubis Digital',
  description: 'Architectural Resilience for the Agentic Web',
}

interface Props {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}

export default async function FrontendLayout({ children, params }: Props) {
  const { locale } = await params
  const payload = await getPayload({ config })

  const [header, footer] = await Promise.all([
    payload.findGlobal({ slug: 'header', locale }),
    payload.findGlobal({ slug: 'footer', locale }),
  ])

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${playfair.variable} min-h-screen bg-[#F0EEE9] text-[#101417] selection:bg-[#00F5D4] selection:text-[#101417] antialiased`}
      >
        <DeviceOptimizerProvider locale={locale}>
          <StartProjectModalProvider locale={locale}>
            <OversightProvider>
              <GlobalHeader data={header} locale={locale} />
              {children}
              <Footer data={footer} />
            </OversightProvider>
          </StartProjectModalProvider>
          <OptimizationLogPanel locale={locale} />
        </DeviceOptimizerProvider>
      </body>
    </html>
  )
}
