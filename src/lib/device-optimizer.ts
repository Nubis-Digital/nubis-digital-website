export interface DeviceSignals {
  viewport: { width: number; height: number }
  dpr: number
  connection: { type: string; downlink: number; rtt: number; saveData: boolean } | null
  memory: number | null
  cores: number
  battery: { level: number; charging: boolean } | null
  motion: 'reduce' | 'no-preference'
  contrast: 'more' | 'no-preference'
  touch: boolean
}

export interface Optimization {
  id: string
  label: string
  description: string
  applied: boolean
}

export interface OptimizationResult {
  signals: DeviceSignals
  optimizations: Optimization[]
  duration: number
}

// ─── Signal readers ───────────────────────────────────────────────────────────

function readConnection(): DeviceSignals['connection'] {
  const nav = navigator as Navigator & {
    connection?: { effectiveType: string; downlink: number; rtt: number; saveData: boolean }
  }
  if (!nav.connection) return null
  return {
    type: nav.connection.effectiveType ?? 'unknown',
    downlink: nav.connection.downlink ?? 0,
    rtt: nav.connection.rtt ?? 0,
    saveData: nav.connection.saveData ?? false,
  }
}

async function readBattery(): Promise<DeviceSignals['battery']> {
  const nav = navigator as Navigator & { getBattery?: () => Promise<{ level: number; charging: boolean }> }
  if (!nav.getBattery) return null
  try {
    const b = await nav.getBattery()
    return { level: b.level, charging: b.charging }
  } catch {
    return null
  }
}

function readMotion(): DeviceSignals['motion'] {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'reduce'
    : 'no-preference'
}

function readContrast(): DeviceSignals['contrast'] {
  return window.matchMedia('(prefers-contrast: more)').matches ? 'more' : 'no-preference'
}

// ─── Rules ────────────────────────────────────────────────────────────────────

function evaluateRules(s: DeviceSignals): Optimization[] {
  const isLowBandwidth =
    s.connection?.type === '2g' ||
    s.connection?.type === 'slow-2g' ||
    s.connection?.saveData === true

  const isLowBattery = s.battery !== null && s.battery.level < 0.2 && !s.battery.charging
  const isLowMemory = s.memory !== null && s.memory <= 1

  return [
    {
      id: 'precision-rendering',
      label: 'Precision Rendering',
      applied: s.dpr >= 2,
      description:
        s.dpr >= 2
          ? `${s.dpr}× display detected — sub-pixel border precision applied`
          : 'Standard display — default 1px borders active',
    },
    {
      id: 'reduced-motion',
      label: 'Motion Accessibility',
      applied: s.motion === 'reduce',
      description:
        s.motion === 'reduce'
          ? 'User preference detected — all transitions suspended'
          : 'No motion constraint — full transitions active',
    },
    {
      id: 'bandwidth-saver',
      label: 'Bandwidth Conservation',
      applied: isLowBandwidth ?? false,
      description: isLowBandwidth
        ? `${s.connection?.type ?? 'slow'} connection — 3D rendering suspended`
        : `${s.connection ? `${s.connection.type} · ${s.connection.downlink} Mbps` : 'connection unknown'} — full assets loaded`,
    },
    {
      id: 'memory-conservation',
      label: 'Memory Conservation',
      applied: isLowMemory,
      description: isLowMemory
        ? `${s.memory} GB RAM detected — render budget reduced`
        : `${s.memory !== null ? `${s.memory} GB RAM` : 'memory unknown'} — full render budget active`,
    },
    {
      id: 'battery-saver',
      label: 'Battery Conservation',
      applied: isLowBattery,
      description: isLowBattery
        ? `${Math.round((s.battery?.level ?? 0) * 100)}% battery, not charging — animation frequency reduced`
        : s.battery !== null
          ? `${Math.round(s.battery.level * 100)}% battery${s.battery.charging ? ', charging' : ''} — full animation budget`
          : 'Battery status unavailable — full animation budget',
    },
    {
      id: 'touch-interaction',
      label: 'Touch Interaction',
      applied: s.touch,
      description: s.touch
        ? 'Touch device detected — tap targets expanded to 44px'
        : 'Pointer device — desktop interaction model active',
    },
    {
      id: 'high-contrast',
      label: 'High Contrast',
      applied: s.contrast === 'more',
      description:
        s.contrast === 'more'
          ? 'High contrast preference — opacity layers removed'
          : 'Standard contrast levels active',
    },
  ]
}

// ─── CSS application ──────────────────────────────────────────────────────────

const CLASS_MAP: Record<string, string> = {
  'precision-rendering': 'nubis-high-dpr',
  'reduced-motion': 'nubis-reduced-motion',
  'bandwidth-saver': 'nubis-low-bandwidth',
  'battery-saver': 'nubis-battery-saver',
  'touch-interaction': 'nubis-touch',
  'high-contrast': 'nubis-high-contrast',
}

function applyClasses(optimizations: Optimization[]) {
  const html = document.documentElement
  for (const opt of optimizations) {
    const cls = CLASS_MAP[opt.id]
    if (!cls) continue
    if (opt.applied) {
      html.classList.add(cls)
    } else {
      html.classList.remove(cls)
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function runDeviceAudit(): Promise<OptimizationResult> {
  const start = performance.now()

  const [battery] = await Promise.all([readBattery()])

  const signals: DeviceSignals = {
    viewport: { width: window.innerWidth, height: window.innerHeight },
    dpr: window.devicePixelRatio ?? 1,
    connection: readConnection(),
    memory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null,
    cores: navigator.hardwareConcurrency ?? 1,
    battery,
    motion: readMotion(),
    contrast: readContrast(),
    touch: navigator.maxTouchPoints > 0,
  }

  const optimizations = evaluateRules(signals)
  applyClasses(optimizations)

  const duration = Math.round(performance.now() - start)

  return { signals, optimizations, duration }
}
