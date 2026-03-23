import { getPayload } from 'payload'
import config from '@payload-config'

async function seedSpanish() {
  const payload = await getPayload({ config })

  console.log('Seeding Spanish: Transparency Panel...')
  await payload.updateGlobal({
    slug: 'transparency-panel',
    locale: 'es',
    data: {
      message:
        'Perspectiva Agéntica: Nuestra IA interna optimizó este diseño en 12ms para priorizar la legibilidad según las métricas de tu dispositivo.',
      linkText: '[Ver Registro de Optimización]',
    },
  })

  console.log('Seeding Spanish: Hero...')
  await payload.updateGlobal({
    slug: 'hero',
    locale: 'es',
    data: {
      headlinePart1: 'Resiliencia Arquitectónica para la',
      headlineEmphasis: 'Web Agéntica.',
      bodyText:
        'Diseñamos Hubs de Contenido Digital donde la intención humana y la ejecución de IA convergen sin fricciones. Más allá de páginas estáticas hacia ecosistemas dinámicos, preparados para RAG.',
      ctaButtonText: 'Descubre Cómo Trabajamos',
    },
  })

  console.log('Seeding Spanish: Services Section...')
  await payload.updateGlobal({
    slug: 'services-section',
    locale: 'es',
    data: {
      sectionHeadlinePart1: 'No solo construimos sitios web.',
      sectionHeadlineEmphasis: 'Entrenamos Hubs Digitales.',
      sectionIntroText:
        'Selecciona un paradigma de infraestructura para ver nuestro enfoque arquitectónico y capacidades de plugins personalizados.',
    },
  })

  console.log('Seeding Spanish: Process Section...')
  // Fetch existing process section to get step IDs
  const existingProcess = await payload.findGlobal({ slug: 'process-section', locale: 'en' })
  const processSteps = existingProcess.steps?.map((step, idx) => {
    const esSteps = [
      { title: 'Descubrimiento', description: 'Auditamos tu infraestructura digital existente, mapeamos flujos de contenido e identificamos cuellos de botella arquitectónicos antes de escribir una sola línea de código.' },
      { title: 'Diseño Asistido por IA', description: 'Nuestras herramientas de IA generan prototipos estructurales y esquemas de contenido, acelerando la fase de diseño mientras nuestros arquitectos validan cada decisión.' },
      { title: 'Desarrollo Liderado por Humanos', description: 'Ingenieros senior construyen tu hub digital con cobertura completa de pruebas, cumplimiento de accesibilidad y presupuestos de rendimiento integrados en cada sprint.' },
      { title: 'Lanzamiento y Evolución', description: 'Desplegamos en redes edge con rollouts sin tiempo de inactividad, luego optimizamos continuamente mediante analíticas impulsadas por IA y revisiones arquitectónicas trimestrales.' },
    ]
    return { ...step, ...esSteps[idx] }
  })

  await payload.updateGlobal({
    slug: 'process-section',
    locale: 'es',
    data: {
      headline: 'Cómo Trabajamos',
      headlineEmphasis: 'La intención humana se encuentra con la ejecución de IA.',
      steps: processSteps,
    },
  })

  console.log('Seeding Spanish: Header...')
  // Fetch existing header to get nav link IDs
  const existingHeader = await payload.findGlobal({ slug: 'header', locale: 'en' })
  const navLinks = existingHeader.navLinks?.map((link, idx) => {
    const esLabels = ['Servicios', 'Acerca de']
    return { ...link, label: esLabels[idx] || link.label }
  })

  await payload.updateGlobal({
    slug: 'header',
    locale: 'es',
    data: {
      navLinks,
      oversightLabel: 'Supervisión Humana',
      oversightActiveText: 'Activa',
      oversightDisabledText: 'Desactivada',
      oversightTooltip:
        'Todos los flujos de IA de Nubis son monitoreados y gobernables por nuestros arquitectos humanos senior.',
      ctaButtonText: 'Iniciar Proyecto',
    },
  })

  console.log('Seeding Spanish: Footer...')
  const existingFooter = await payload.findGlobal({ slug: 'footer', locale: 'en' })
  const footerLinks = existingFooter.footerLinks?.map((link, idx) => {
    const esLabels = ['Privacidad y Gobernanza de Datos', 'Declaración de Ética de IA', 'Portal de Clientes']
    return { ...link, label: esLabels[idx] || link.label }
  })

  await payload.updateGlobal({
    slug: 'footer',
    locale: 'es',
    data: {
      tagline: 'Resiliencia Arquitectónica \u2022 2026',
      footerLinks,
    },
  })

  // --- Seed Spanish for Services ---
  console.log('Seeding Spanish: Services...')

  const services = await payload.find({
    collection: 'services',
    sort: 'order',
    limit: 20,
    locale: 'en',
  })

  const spanishData: Record<string, {
    label: string; title: string; subtitle: string; description: string; agenticEdge: string
    specs: Array<{ label: string; value: string }>
    plugins: Array<{ text: string }>
  }> = {
    payload: {
      label: 'Payload CMS',
      title: 'Arquitectura Lista para RAG',
      subtitle: 'Velocidad headless diseñada para el futuro IA-first.',
      description: 'Desplegamos Payload CMS de forma nativa en redes Edge, creando APIs JSON limpias estructuralmente optimizadas para LLMs y RAG. No solo construimos tu CMS; construimos el sistema nervioso de tus datos.',
      agenticEdge: 'Nuestros plugins de IA personalizados automatizan la taxonomía SEO en tiempo real, traducción multilingüe en el edge, y auto-generan esquemas estructurados para ingestión instantánea de crawlers.',
      specs: [
        { label: 'Despliegue', value: 'Red Edge de Vercel' },
        { label: 'Estructura de Datos', value: 'JSON Semántico Estricto' },
      ],
      plugins: [
        { text: 'Endpoints para Crawlers LLM (Agent.txt listo)' },
        { text: 'Middleware de Personalización en Cache Edge' },
        { text: 'Motor de Taxonomía de Contenido Automatizado' },
      ],
    },
    umbraco: {
      label: 'Umbraco',
      title: 'Sinergia Empresarial y Migración',
      subtitle: 'Seguridad robusta e integración fluida con sistemas internos.',
      description: 'Transformamos arquitecturas monolíticas abultadas en entornos Umbraco optimizados alojados en Azure. Nuestros plugins de LoB conectan tu sitio de marketing con ERPs internos complejos, asegurando integridad absoluta de datos.',
      agenticEdge: 'Agentes de migración IA propietarios mapean bases de datos SQL legadas a nodos Umbraco automáticamente, reduciendo los tiempos de migración estructural hasta en un 60%.',
      specs: [
        { label: 'Despliegue', value: 'Microsoft Azure Core' },
        { label: 'Seguridad', value: 'Grado Empresarial / SSO' },
      ],
      plugins: [
        { text: 'Sincronización Bidireccional ERP / CRM' },
        { text: 'Integración Azure Active Directory (SSO)' },
        { text: 'Mapeadores Automáticos de Datos Legados' },
      ],
    },
    wordpress: {
      label: 'WordPress',
      title: 'Escalamiento de Hiper-Velocidad',
      subtitle: 'Agilidad de marketing sin deuda técnica.',
      description: 'Reducimos WordPress a su núcleo esencial, desacoplando el frontend para ejecutarse como una aplicación React ultrarrápida. Proporciona a los equipos de marketing la interfaz de Gutenberg mientras entrega rendimiento empresarial al usuario final.',
      agenticEdge: 'La optimización de IA en tiempo real analiza patrones de tráfico para pre-renderizar las rutas de conversión más visitadas antes de que el usuario haga clic.',
      specs: [
        { label: 'Arquitectura', value: 'Desacoplada / Headless' },
        { label: 'Entrega', value: 'Generación de Sitio Estático' },
      ],
      plugins: [
        { text: 'Puente API GraphQL Headless' },
        { text: 'Serialización Dinámica de Bloques' },
        { text: 'Webhooks de Automatización de Marketing' },
      ],
    },
  }

  for (const service of services.docs) {
    const es = spanishData[service.slug]
    if (!es) continue

    // Merge with existing array item IDs
    const specs = service.specs?.map((spec, idx) => ({
      ...spec,
      label: es.specs[idx]?.label || spec.label,
      value: es.specs[idx]?.value || spec.value,
    }))

    const plugins = service.plugins?.map((plugin, idx) => ({
      ...plugin,
      text: es.plugins[idx]?.text || plugin.text,
    }))

    await payload.update({
      collection: 'services',
      id: service.id,
      locale: 'es',
      data: {
        label: es.label,
        title: es.title,
        subtitle: es.subtitle,
        description: es.description,
        agenticEdge: es.agenticEdge,
        specs,
        plugins,
      },
    })
    console.log(`  Updated ${service.slug} with Spanish content`)
  }

  console.log('Spanish seed complete!')
  process.exit(0)
}

seedSpanish().catch((err) => {
  console.error('Spanish seed failed:', err)
  process.exit(1)
})
