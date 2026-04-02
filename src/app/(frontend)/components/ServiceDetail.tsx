import { ArrowLeft, Cpu, ShieldAlert, Zap, Brain, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from 'lexical'
import type { Service, Media } from '@/payload-types'
import type { Locale } from '@/i18n'
import { Icon } from './icons'
import ServiceCtaButton from './ServiceCtaButton'

const ACCENT_COLOR_MAP: Record<string, string> = {
  'deep-ink': 'text-[#101417]',
  'plasma-teal': 'text-[#00F5D4]',
  'holo-lilac': 'text-[#B9A7FF]',
}

// ─── Umbraco version EOL table ────────────────────────────────────────────────

const UMBRACO_VERSIONS = [
  { version: 'v7.x', status: 'eol',       label: 'End of Life',       note: 'No patches — critical exposure',      date: 'Sep 2023' },
  { version: 'v8.x', status: 'eol',       label: 'End of Life',       note: 'No patches — critical exposure',      date: 'Feb 2025' },
  { version: 'v10.x', status: 'urgent',   label: 'EOL Nov 2025',      note: 'Security only — upgrade now',          date: 'Nov 2025' },
  { version: 'v13.x', status: 'ok',       label: 'Supported LTS',     note: 'Maintained until Dec 2026',            date: 'Dec 2026' },
  { version: 'v14.x', status: 'current',  label: 'Current LTS',       note: 'Recommended target — active support',  date: 'Dec 2027' },
]

const STATUS_STYLES: Record<string, { row: string; badge: string; icon: React.ReactNode }> = {
  eol:     { row: 'bg-red-500/5 border-red-500/20',    badge: 'text-red-600 border-red-500/30 bg-red-500/5',    icon: <XCircle size={14} className="text-red-500" /> },
  urgent:  { row: 'bg-orange-500/5 border-orange-500/20', badge: 'text-orange-600 border-orange-500/30 bg-orange-500/5', icon: <AlertTriangle size={14} className="text-orange-500" /> },
  ok:      { row: 'bg-[#F0EEE9] border-[#101417]/10',  badge: 'text-[#101417]/60 border-[#101417]/20',          icon: <CheckCircle2 size={14} className="text-[#101417]/40" /> },
  current: { row: 'bg-[#00F5D4]/5 border-[#00F5D4]/20', badge: 'text-[#00F5D4] border-[#00F5D4]/30 bg-[#00F5D4]/5', icon: <CheckCircle2 size={14} className="text-[#00F5D4]" /> },
}

// ─── Umbraco migration process steps ─────────────────────────────────────────

function getMigrationSteps(locale: Locale) {
  if (locale === 'es') return [
    {
      week: 'Semana 1',
      title: 'Auditoría de Rendimiento',
      body: 'Medición de Core Web Vitals, TTFB y LCP como referencia. Escaneo de vulnerabilidades de seguridad e inventario completo de paquetes y dependencias.',
    },
    {
      week: 'Semana 1–2',
      title: 'Mapeo de Dependencias',
      body: 'Catálogo de cada paquete personalizado contra la compatibilidad de v14. Identificación de cambios importantes en tipos de documentos y mapeo de integraciones de terceros.',
    },
    {
      week: 'Semana 2',
      title: 'Entorno de Staging',
      body: 'Provisión de un entorno Azure aislado. Espejo de datos de producción (saneados) y establecimiento de puntos de control para reversión instantánea.',
    },
    {
      week: 'Semana 3–4',
      title: 'Ejecución de la Migración',
      body: 'Actualizaciones sistemáticas de paquetes y resolución de conflictos. Migración de tipos de documentos y auditoría de contenido. Modernización de código personalizado a patrones .NET actuales.',
    },
    {
      week: 'Semana 4–5',
      title: 'Perfilado de Rendimiento',
      body: 'Comparación contra métricas de referencia. Optimización de caché de salida, ajuste de CDN y entrega de medios. Objetivo: 2–4× de mejora en tiempos de carga.',
    },
    {
      week: 'Semana 5–6',
      title: 'Lanzamiento Sin Inactividad',
      body: 'Estrategia de despliegue azul/verde con capacidad de reversión instantánea. Cambio de DNS controlado. 30 días de monitoreo post-lanzamiento incluidos.',
    },
  ]

  return [
    {
      week: 'Week 1',
      title: 'Performance Audit',
      body: 'Baseline Core Web Vitals, TTFB, and LCP measurements. Security vulnerability scan and complete package and dependency inventory.',
    },
    {
      week: 'Week 1–2',
      title: 'Dependency Mapping',
      body: 'Every custom package catalogued against v14 compatibility. Breaking changes in document types identified. Third-party integration and API contracts mapped.',
    },
    {
      week: 'Week 2',
      title: 'Staging Environment',
      body: 'Isolated Azure environment provisioned. Production data mirrored (sanitised) with rollback checkpoints established at every phase.',
    },
    {
      week: 'Week 3–4',
      title: 'Migration Execution',
      body: 'Systematic package updates and conflict resolution. Document type migration and content audit. Custom code modernised to current .NET patterns.',
    },
    {
      week: 'Week 4–5',
      title: 'Performance Profiling',
      body: 'Benchmarked against your baseline measurements. Output caching optimised, CDN and media delivery tuned. Target: 2–4× load time improvement.',
    },
    {
      week: 'Week 5–6',
      title: 'Zero-Downtime Go-Live',
      body: 'Blue/green deployment with instant rollback capability. Controlled DNS cutover. 30 days of post-launch monitoring included.',
    },
  ]
}

// ─── Umbraco outcome cards ────────────────────────────────────────────────────

function getOutcomes(locale: Locale) {
  if (locale === 'es') return [
    {
      icon: <ShieldAlert size={22} className="text-[#00F5D4]" />,
      title: 'Seguridad Restaurada',
      body: 'Sin más exposición EOL. v14 incluye el stack de seguridad .NET más reciente, canales de parches automatizados y el programa de seguridad gestionado de Umbraco.',
    },
    {
      icon: <Zap size={22} className="text-[#00F5D4]" />,
      title: '2–4× Más Rápido',
      body: 'Mejora mediana en nuestras migraciones. Caché de salida, pipelines de medios optimizados y el runtime moderno de .NET reducen los tiempos de carga de forma medible.',
    },
    {
      icon: <Brain size={22} className="text-[#00F5D4]" />,
      title: 'Listo para Agentes',
      body: 'Esquemas de contenido estructurado, agent.txt y endpoints API limpios hacen que tu sitio sea indexable inmediatamente por búsquedas impulsadas por IA y pipelines RAG.',
    },
  ]

  return [
    {
      icon: <ShieldAlert size={22} className="text-[#00F5D4]" />,
      title: 'Security Restored',
      body: 'No more EOL exposure. v14 ships with the latest .NET security stack, automated patch channels, and Umbraco\'s managed security programme.',
    },
    {
      icon: <Zap size={22} className="text-[#00F5D4]" />,
      title: '2–4× Faster',
      body: 'Median improvement across our migrations. Output caching, optimised media pipelines, and the modern .NET runtime combine to cut load times measurably.',
    },
    {
      icon: <Brain size={22} className="text-[#00F5D4]" />,
      title: 'AI-Ready Architecture',
      body: 'Structured content schemas, agent.txt, and clean API endpoints make your site immediately indexable by AI-powered search and RAG pipelines.',
    },
  ]
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  service: Service
  locale: Locale
}

export default function ServiceDetail({ service, locale }: Props) {
  const featuredImage = service.featuredImage as Media | null
  const isUmbraco = service.slug === 'umbraco'

  const backLabel   = locale === 'es' ? 'Volver a Servicios' : 'Back to Services'
  const specsLabel  = locale === 'es' ? 'Especificaciones Técnicas' : 'Deployment Specs'
  const agenticLabel = locale === 'es' ? 'La Ventaja Agéntica' : 'The Agentic Edge'
  const pluginsLabel = locale === 'es' ? 'Plugins e Integraciones' : 'Bespoke Plugins & Integrations'

  return (
    <main className="pt-[73px]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#101417] text-[#F0EEE9] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,#00F5D4_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_30%,#B9A7FF_0%,transparent_50%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <a
            href={`/${locale}/#services`}
            className="inline-flex items-center gap-2 font-sans text-sm text-[#F0EEE9]/60 hover:text-[#00F5D4] transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            {backLabel}
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

      {/* ── Umbraco: Version EOL Status ──────────────────────────────────── */}
      {isUmbraco && (
        <section className="bg-[#101417] border-b border-[#F0EEE9]/10">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-[1px] w-8 bg-[#F0EEE9]/20" />
              <span className="font-sans text-xs uppercase tracking-widest text-[#F0EEE9]/30">
                {locale === 'es' ? 'Estado de Versiones' : 'Version Status'}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#F0EEE9] mb-3 leading-tight">
              {locale === 'es' ? '¿Está afectada tu versión?' : 'Is Your Version Affected?'}
            </h2>
            <p className="font-sans text-[#F0EEE9]/50 mb-12 max-w-xl">
              {locale === 'es'
                ? 'Las versiones sin soporte activo no reciben parches de seguridad. Cada día que pasa aumenta tu exposición.'
                : 'Versions without active support receive no security patches. Every day you stay on an EOL version your exposure compounds.'}
            </p>

            <div className="space-y-2 mb-12">
              {/* Header row */}
              <div className="hidden md:grid grid-cols-[120px_1fr_180px_200px] gap-4 px-5 pb-2">
                {(['Version', 'Status', 'EOL Date', 'Risk'].map(h => (
                  <span key={h} className="font-sans text-[10px] uppercase tracking-widest text-[#F0EEE9]/25">{h}</span>
                )))}
              </div>

              {UMBRACO_VERSIONS.map((v) => {
                const s = STATUS_STYLES[v.status]
                return (
                  <div
                    key={v.version}
                    className={`grid grid-cols-1 md:grid-cols-[120px_1fr_180px_200px] gap-4 items-center border px-5 py-4 ${s.row}`}
                  >
                    <span className="font-mono font-bold text-[#F0EEE9] text-sm">{v.version}</span>
                    <span className="font-sans text-[#F0EEE9]/60 text-sm">{v.note}</span>
                    <span className="font-mono text-[#F0EEE9]/40 text-xs">{v.date}</span>
                    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-sans text-xs font-semibold w-fit ${s.badge}`}>
                      {s.icon}
                      {v.label}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="border border-[#00F5D4]/20 bg-[#00F5D4]/5 px-6 py-5 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-2 h-2 rounded-full bg-[#00F5D4] shrink-0 mt-1 md:mt-0" />
              <p className="font-sans text-sm text-[#F0EEE9]/70 leading-relaxed">
                {locale === 'es'
                  ? 'Si estás en v7, v8 o v10 — hoy es el momento de actuar. Te ayudamos a migrar a v14 LTS sin tiempo de inactividad y con una mejora de rendimiento garantizada.'
                  : 'If you\'re on v7, v8, or v10 — the time to act is now. We migrate you to v14 LTS with zero downtime and a guaranteed performance improvement.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Specs + Agentic Edge ─────────────────────────────────────────── */}
      <section className="bg-[#F0EEE9] border-b border-[#101417]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-[#101417] p-8 bg-white/50 backdrop-blur-sm">
              <h2 className="font-sans text-xs uppercase tracking-widest text-[#101417]/50 mb-6 border-b border-[#101417]/20 pb-3">
                {specsLabel}
              </h2>
              <div className="space-y-6">
                {service.specs?.map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between font-sans">
                    <span className="text-[#101417]/70 text-sm">{spec.label}</span>
                    <span className={`flex items-center gap-2 font-mono font-medium text-sm ${ACCENT_COLOR_MAP[spec.accentColor] || 'text-[#101417]'}`}>
                      <Icon name={spec.icon} size={16} />
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#101417] p-8 bg-[#101417] text-[#F0EEE9]">
              <h2 className="font-sans text-xs uppercase tracking-widest text-[#00F5D4] mb-6 border-b border-[#F0EEE9]/20 pb-3 flex items-center gap-2">
                <Cpu size={16} /> {agenticLabel}
              </h2>
              <p className="font-sans text-sm leading-relaxed text-[#F0EEE9]/80">
                {service.agenticEdge}
              </p>
            </div>
          </div>

          <div className="mt-12 border-t border-[#101417] pt-10">
            <h2 className="font-sans text-sm uppercase tracking-widest text-[#101417] mb-6 font-semibold">
              {pluginsLabel}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {service.plugins?.map((plugin, idx) => (
                <li key={idx} className="font-sans text-sm text-[#101417] flex items-start gap-3 border border-[#101417]/20 p-4">
                  <div className="w-2 h-2 rounded-full bg-[#B9A7FF] mt-1.5 shrink-0" />
                  {plugin.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Umbraco: Migration Process ───────────────────────────────────── */}
      {isUmbraco && (
        <section className="bg-[#F0EEE9] border-b border-[#101417]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-[1px] w-8 bg-[#101417]" />
              <span className="font-sans text-xs uppercase tracking-widest text-[#101417]/50">
                {locale === 'es' ? 'Proceso' : 'Process'}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#101417] mb-3 leading-tight">
              {locale === 'es' ? 'Cómo Ejecutamos la Migración' : 'How We Run the Migration'}
            </h2>
            <p className="font-sans text-[#101417]/60 mb-16 max-w-xl">
              {locale === 'es'
                ? 'Un proceso estructurado de 6 semanas. Sin sorpresas, sin tiempo de inactividad, sin riesgo para el negocio.'
                : 'A structured 6-week process. No surprises, no downtime, no business risk.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {getMigrationSteps(locale).map((step, idx) => (
                <div
                  key={idx}
                  className="border border-[#101417] p-8 group hover:bg-[#101417] hover:text-[#F0EEE9] transition-all duration-500 relative"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#101417]/30 group-hover:text-[#F0EEE9]/30 transition-colors duration-500 mb-4 block">
                    {step.week}
                  </span>
                  <div className="absolute top-6 right-6 font-mono text-5xl font-bold text-[#101417]/5 group-hover:text-[#F0EEE9]/5 transition-colors duration-500 leading-none select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-sans text-sm uppercase tracking-widest font-semibold text-[#101417] group-hover:text-[#F0EEE9] transition-colors duration-500 mb-3">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-[#101417]/60 group-hover:text-[#F0EEE9]/60 transition-colors duration-500 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Umbraco: Outcomes ────────────────────────────────────────────── */}
      {isUmbraco && (
        <section className="bg-[#101417] border-b border-[#F0EEE9]/10">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-[1px] w-8 bg-[#F0EEE9]/20" />
              <span className="font-sans text-xs uppercase tracking-widest text-[#F0EEE9]/30">
                {locale === 'es' ? 'Resultados' : 'Outcomes'}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#F0EEE9] mb-16 leading-tight">
              {locale === 'es' ? 'Qué Obtienes Después de la Migración' : 'What You Get After the Migration'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {getOutcomes(locale).map((outcome, idx) => (
                <div key={idx} className="border border-[#F0EEE9]/10 p-10 hover:border-[#00F5D4]/30 hover:bg-[#F0EEE9]/[0.02] transition-all duration-500">
                  <div className="w-12 h-12 border border-[#00F5D4]/30 flex items-center justify-center mb-6">
                    {outcome.icon}
                  </div>
                  <h3 className="font-sans text-sm uppercase tracking-widest font-semibold text-[#F0EEE9] mb-4">
                    {outcome.title}
                  </h3>
                  <p className="font-sans text-sm text-[#F0EEE9]/50 leading-relaxed">
                    {outcome.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Umbraco: Upgrade CTA ─────────────────────────────────────────── */}
      {isUmbraco && (
        <section className="bg-[#F0EEE9] border-b border-[#101417]">
          <div className="max-w-6xl mx-auto px-6 py-24 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 bg-[#101417]" />
              <span className="font-sans text-xs uppercase tracking-widest text-[#101417]/50">
                {locale === 'es' ? 'Iniciar' : 'Get Started'}
              </span>
              <div className="h-[1px] w-8 bg-[#101417]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#101417] mb-4 leading-tight max-w-2xl mx-auto">
              {locale === 'es'
                ? 'Listo para Migrar a Umbraco 14?'
                : 'Ready to Migrate to Umbraco 14?'}
            </h2>
            <p className="font-sans text-[#101417]/60 mb-10 max-w-xl mx-auto">
              {locale === 'es'
                ? 'Cuéntanos en qué versión estás y qué tiene tu sitio — responderemos con un plan de acción en 24 horas.'
                : "Tell us what version you're on and what your site has — we'll come back with an action plan within 24 hours."}
            </p>
            <ServiceCtaButton
              label={locale === 'es' ? 'Iniciar Migración' : 'Start the Migration'}
            />
          </div>
        </section>
      )}

      {/* ── Rich Text Detail Content ─────────────────────────────────────── */}
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
