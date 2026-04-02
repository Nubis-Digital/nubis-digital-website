/**
 * Targeted update script for the Umbraco service record.
 * Run with: npx payload run ./src/update-umbraco.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

async function updateUmbraco() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'services',
    where: { slug: { equals: 'umbraco' } },
    limit: 1,
  })

  if (!existing.docs.length) {
    console.error('Umbraco service not found — run npm run seed first.')
    process.exit(1)
  }

  const id = existing.docs[0].id

  // ── English ────────────────────────────────────────────────────────────────
  await payload.update({
    collection: 'services',
    id,
    locale: 'en',
    data: {
      label: 'Umbraco',
      icon: 'Layers',
      title: 'Upgrade & Performance Recovery',
      subtitle: 'From v7/v8/v10 to Umbraco 14 LTS — zero downtime, measurably faster.',
      description:
        'Running Umbraco 7, 8, or 10? All three are past end-of-life — no security patches, compounding vulnerabilities, and performance ceilings you can\'t break through. We run a full performance audit, map every custom package dependency, and execute a structured zero-downtime migration to Umbraco 14 LTS. Clients consistently see 2–4× improvement in page load times post-upgrade.',
      specs: [
        {
          label: 'Target Version',
          value: 'Umbraco 14 LTS',
          icon: 'Server',
          accentColor: 'plasma-teal',
        },
        {
          label: 'Avg. Performance Gain',
          value: '2–4× faster',
          icon: 'Activity',
          accentColor: 'plasma-teal',
        },
      ],
      agenticEdge:
        'Post-upgrade, we inject structured content schemas and agent.txt configuration so your newly fast Umbraco site surfaces immediately in AI-powered search and RAG pipelines — turning your migration investment into a compounding growth lever.',
      plugins: [
        { text: 'Zero-downtime migration (v7/v8/v10 → v14)' },
        { text: 'Package conflict resolution & modernization' },
        { text: 'Performance profiling & load time optimization' },
      ],
      order: 2,
    },
  })

  // ── Spanish ────────────────────────────────────────────────────────────────
  await payload.update({
    collection: 'services',
    id,
    locale: 'es',
    data: {
      label: 'Umbraco',
      title: 'Actualización y Recuperación de Rendimiento',
      subtitle: 'De v7/v8/v10 a Umbraco 14 LTS — sin tiempo de inactividad, mediblemente más rápido.',
      description:
        '¿Ejecutas Umbraco 7, 8 o 10? Los tres superaron su fin de vida útil: sin parches de seguridad, vulnerabilidades acumuladas y cuellos de botella de rendimiento que no puedes superar. Realizamos una auditoría completa de rendimiento, mapeamos cada dependencia de paquetes personalizada y ejecutamos una migración estructurada a Umbraco 14 LTS sin tiempo de inactividad. Los clientes consistentemente ven una mejora de 2–4× en los tiempos de carga post-actualización.',
      agenticEdge:
        'Tras la actualización, inyectamos esquemas de contenido estructurado y configuración agent.txt para que tu sitio Umbraco aparezca inmediatamente en búsquedas impulsadas por IA y pipelines RAG — convirtiendo tu inversión en migración en un motor de crecimiento compuesto.',
      specs: [
        { label: 'Versión Objetivo', value: 'Umbraco 14 LTS' },
        { label: 'Ganancia de Rendimiento', value: '2–4× más rápido' },
      ],
      plugins: [
        { text: 'Migración sin inactividad (v7/v8/v10 → v14)' },
        { text: 'Resolución de conflictos de paquetes y modernización' },
        { text: 'Perfilado de rendimiento y optimización de carga' },
      ],
    },
  })

  console.log('✓ Umbraco service updated in EN + ES')
  process.exit(0)
}

updateUmbraco().catch((err) => {
  console.error('Update failed:', err)
  process.exit(1)
})
