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
        'Se\u00f1al Ag\u00e9ntica en Vivo: Este sitio utiliza agent.txt y APIs listas para RAG \u2014 la misma arquitectura que construimos para nuestros clientes.',
      linkText: '[Explora Nuestro Stack]',
    },
  })

  console.log('Seeding Spanish: Hero...')
  await payload.updateGlobal({
    slug: 'hero',
    locale: 'es',
    data: {
      headlinePart1: 'Hacemos que tu Sitio Web Trabaje para',
      headlineEmphasis: 'Agentes de IA.',
      bodyText:
        'Los agentes de IA est\u00e1n redefiniendo c\u00f3mo los clientes encuentran, eval\u00faan y eligen negocios. Construimos sitios web que la IA puede leer, recomendar y actuar \u2014 convirtiendo tu presencia digital en una ventaja competitiva en la era ag\u00e9ntica.',
      ctaButtonText: 'Descubre Qu\u00e9 Significa Ag\u00e9ntico',
    },
  })

  console.log('Seeding Spanish: Why Agentic Section...')
  const existingWhyAgentic = await payload.findGlobal({ slug: 'why-agentic-section', locale: 'en' })
  const benefits = existingWhyAgentic.benefits?.map((benefit, idx) => {
    const esBenefits = [
      {
        title: 'Descubrimiento por Agentes',
        description:
          'Agentes de IA como ChatGPT, Perplexity y Claude buscan activamente respuestas en la web. Los sitios con agent.txt y endpoints estructurados son recuperados primero.',
      },
      {
        title: 'Estructurado para LLMs',
        description:
          'Cuando una IA resume tus servicios, los datos sem\u00e1nticos limpios ganan. Construimos esquemas de contenido que los LLMs analizan con precisi\u00f3n \u2014 sin alucinaciones, sin tergiversaci\u00f3n.',
      },
      {
        title: 'Supervisi\u00f3n Humana Integrada',
        description:
          'Cada flujo de IA que desplegamos est\u00e1 gobernado por arquitectos humanos. Tu voz de marca, tus datos, tus reglas \u2014 siempre bajo tu control.',
      },
    ]
    return { ...benefit, ...esBenefits[idx] }
  })

  await payload.updateGlobal({
    slug: 'why-agentic-section',
    locale: 'es',
    data: {
      headline: 'Por Qu\u00e9 Importa lo Ag\u00e9ntico',
      headlineEmphasis: 'Los agentes de IA se est\u00e1n convirtiendo en tus visitantes m\u00e1s importantes.',
      introText:
        'Los motores de b\u00fasqueda, asistentes de voz y copilotos de IA utilizan cada vez m\u00e1s agentes aut\u00f3nomos para rastrear, interpretar y recomendar sitios web. Si tu sitio no est\u00e1 optimizado para agentes, eres invisible para el canal de mayor crecimiento en la web.',
      benefits,
    },
  })

  console.log('Seeding Spanish: Services Section...')
  await payload.updateGlobal({
    slug: 'services-section',
    locale: 'es',
    data: {
      sectionHeadlinePart1: 'Tres Plataformas.',
      sectionHeadlineEmphasis: 'Todas Listas para Agentes.',
      sectionIntroText:
        'Cada plataforma que desplegamos est\u00e1 optimizada para descubrimiento por IA, estructurada para consumo de LLMs, y conectada con endpoints agent.txt. Elige tu base.',
    },
  })

  console.log('Seeding Spanish: Process Section...')
  const existingProcess = await payload.findGlobal({ slug: 'process-section', locale: 'en' })
  const processSteps = existingProcess.steps?.map((step, idx) => {
    const esSteps = [
      { title: 'Auditor\u00eda Ag\u00e9ntica', description: 'Analizamos c\u00f3mo los agentes de IA ven actualmente tu sitio \u2014 rastreabilidad, datos estructurados, cumplimiento de agent.txt \u2014 y mapeamos las brechas entre tu contenido y la descubribilidad por IA.' },
      { title: 'Arquitectura y Esquema', description: 'Dise\u00f1amos tu esquema de contenido para dos audiencias: humanos que navegan y agentes de IA que recuperan. Cada campo, endpoint y taxonom\u00eda est\u00e1 optimizado para ambos.' },
      { title: 'Construir e Integrar', description: 'Ingenieros senior construyen tu hub con endpoints agent.txt, APIs listas para RAG y cobertura completa de pruebas. Cada integraci\u00f3n de IA es validada por arquitectos humanos antes del lanzamiento.' },
      { title: 'Lanzar y Monitorear', description: 'Desplegamos en redes edge, activamos monitoreo de IA y rastreamos c\u00f3mo los agentes interact\u00faan con tu contenido \u2014 optimizando trimestralmente con datos reales de tr\u00e1fico ag\u00e9ntico.' },
    ]
    return { ...step, ...esSteps[idx] }
  })

  await payload.updateGlobal({
    slug: 'process-section',
    locale: 'es',
    data: {
      headline: 'De Auditor\u00eda a Ag\u00e9ntico',
      headlineEmphasis: 'Cuatro pasos hacia un sitio web listo para IA.',
      steps: processSteps,
    },
  })

  console.log('Seeding Spanish: Agentic Advantage Section...')
  const existingAdvantage = await payload.findGlobal({ slug: 'agentic-advantage-section', locale: 'en' })
  const metrics = existingAdvantage.metrics?.map((metric, idx) => {
    const esMetrics = [
      { label: 'Tasa de Recuperaci\u00f3n por Agentes', description: 'Los sitios con agent.txt y APIs JSON estructuradas son recuperados 3x m\u00e1s frecuentemente por agentes de IA en comparaci\u00f3n con p\u00e1ginas web est\u00e1ndar.' },
      { label: 'Entrega de Contenido M\u00e1s R\u00e1pida', description: 'Las arquitecturas desplegadas en edge con cach\u00e9 sem\u00e1ntico entregan contenido a humanos y crawlers de IA hasta un 60% m\u00e1s r\u00e1pido.' },
      { label: 'Tiempo de Respuesta API', description: 'Nuestros endpoints listos para RAG responden en menos de 200ms, cumpliendo los requisitos de latencia de flujos de trabajo de agentes de IA en tiempo real.' },
    ]
    return { ...metric, ...esMetrics[idx] }
  })

  await payload.updateGlobal({
    slug: 'agentic-advantage-section',
    locale: 'es',
    data: {
      headline: 'La Ventaja Ag\u00e9ntica',
      headlineEmphasis: 'Lo que la arquitectura lista para agentes entrega.',
      metrics,
      governanceHeadline: '100% Gobernado por Humanos. Cero Concesiones.',
      governanceBody:
        'Creemos que la IA debe amplificar a tu equipo, no reemplazar su criterio. Nuestra arquitectura asegura que t\u00fa tengas la \u00faltima palabra, siempre.',
      ctaText: 'Inicia Tu Proyecto Ag\u00e9ntico',
    },
  })

  console.log('Seeding Spanish: Header...')
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
      oversightLabel: 'Supervisi\u00f3n Humana',
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
    const esLabels = ['Privacidad y Gobernanza de Datos', 'Declaraci\u00f3n de \u00c9tica de IA', 'Portal de Clientes']
    return { ...link, label: esLabels[idx] || link.label }
  })

  await payload.updateGlobal({
    slug: 'footer',
    locale: 'es',
    data: {
      tagline: 'Haciendo la Web Ag\u00e9ntica \u2022 2026',
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
      subtitle: 'Velocidad headless dise\u00f1ada para el futuro IA-first.',
      description: 'Desplegamos Payload CMS de forma nativa en redes Edge, creando APIs JSON limpias estructuralmente optimizadas para LLMs y RAG. No solo construimos tu CMS; construimos el sistema nervioso de tus datos.',
      agenticEdge: 'Tu sitio Payload viene con agent.txt, endpoints JSON compatibles con LLMs, y marcado sem\u00e1ntico automatizado \u2014 haci\u00e9ndolo descubrible por agentes de IA desde el d\u00eda uno.',
      specs: [
        { label: 'Despliegue', value: 'Red Edge de Vercel' },
        { label: 'Estructura de Datos', value: 'JSON Sem\u00e1ntico Estricto' },
      ],
      plugins: [
        { text: 'Endpoints para Crawlers LLM (Agent.txt listo)' },
        { text: 'Middleware de Personalizaci\u00f3n en Cache Edge' },
        { text: 'Motor de Taxonom\u00eda de Contenido Automatizado' },
      ],
    },
    umbraco: {
      label: 'Umbraco',
      title: 'Sinergia Empresarial y Migraci\u00f3n',
      subtitle: 'Seguridad robusta e integraci\u00f3n fluida con sistemas internos.',
      description: 'Transformamos arquitecturas monol\u00edticas abultadas en entornos Umbraco optimizados alojados en Azure. Nuestros plugins de LoB conectan tu sitio de marketing con ERPs internos complejos, asegurando integridad absoluta de datos.',
      agenticEdge: 'Nuestros agentes de migraci\u00f3n automatizan transiciones legacy-a-Umbraco inyectando estructura legible por agentes, para que tu hub empresarial sea descubrible por IA desde el lanzamiento.',
      specs: [
        { label: 'Despliegue', value: 'Microsoft Azure Core' },
        { label: 'Seguridad', value: 'Grado Empresarial / SSO' },
      ],
      plugins: [
        { text: 'Sincronizaci\u00f3n Bidireccional ERP / CRM' },
        { text: 'Integraci\u00f3n Azure Active Directory (SSO)' },
        { text: 'Mapeadores Autom\u00e1ticos de Datos Legados' },
      ],
    },
    wordpress: {
      label: 'WordPress',
      title: 'Escalamiento de Hiper-Velocidad',
      subtitle: 'Agilidad de marketing sin deuda t\u00e9cnica.',
      description: 'Reducimos WordPress a su n\u00facleo esencial, desacoplando el frontend para ejecutarse como una aplicaci\u00f3n React ultrarr\u00e1pida. Proporciona a los equipos de marketing la interfaz de Gutenberg mientras entrega rendimiento empresarial al usuario final.',
      agenticEdge: 'Pre-renderizado impulsado por IA e integraci\u00f3n agent.txt aseguran que tanto visitantes humanos como agentes de IA lleguen a tus p\u00e1ginas de mayor valor instant\u00e1neamente.',
      specs: [
        { label: 'Arquitectura', value: 'Desacoplada / Headless' },
        { label: 'Entrega', value: 'Generaci\u00f3n de Sitio Est\u00e1tico' },
      ],
      plugins: [
        { text: 'Puente API GraphQL Headless' },
        { text: 'Serializaci\u00f3n Din\u00e1mica de Bloques' },
        { text: 'Webhooks de Automatizaci\u00f3n de Marketing' },
      ],
    },
  }

  for (const service of services.docs) {
    const es = spanishData[service.slug]
    if (!es) continue

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
