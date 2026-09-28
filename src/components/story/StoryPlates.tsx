import { content } from '@/data/content'

/**
 * Drafted figure plates that annotate the four laptop chapters from the stage's
 * right-hand lane — the same lane the machine-read ledger occupies at the
 * finale. Pure line-art in the brand's drafting vocabulary (hairlines, cobalt
 * signal, peri for oversight, mono labels); every moving part carries a data
 * hook the timeline scrubs (`plateMotion.ts`).
 *
 * Decorative: the chapters voice the argument, so the whole lane is
 * `aria-hidden` and enhancement-only.
 */

function PlateFrame({ id, caption, children }: { id: string; caption: string; children: React.ReactNode }) {
  return (
    <figure className="story-plate" data-story-plate={id}>
      <figcaption className="story-plate__caption">{caption}</figcaption>
      <svg className="story-plate__art" viewBox="0 0 320 340" focusable="false">
        {children}
      </svg>
    </figure>
  )
}

/** Fig. 1 — the site as an assistant finds it today: drawn, scanned, not parsed. */
function InvisiblePlate() {
  const blocks: Array<{ key: string; shape: React.ReactNode; cross: [number, number] }> = [
    { key: 'nav', shape: <rect x="26" y="48" width="268" height="10" />, cross: [294, 48] },
    { key: 'hero', shape: <rect x="26" y="70" width="160" height="64" />, cross: [186, 70] },
    { key: 'media', shape: <rect x="198" y="70" width="96" height="64" />, cross: [294, 70] },
    { key: 'copy', shape: <path d="M26 152 H294 M26 166 H270 M26 180 H240" />, cross: [294, 152] },
    { key: 'cards', shape: <path d="M26 196 h84 v32 h-84 Z M118 196 h84 v32 h-84 Z M210 196 h84 v32 h-84 Z" />, cross: [294, 196] },
    { key: 'footer', shape: <path d="M26 246 H180" />, cross: [180, 246] },
  ]

  return (
    <PlateFrame id="tension" caption="Fig. 1 · What an assistant sees today">
      <g className="plate-ink">
        <rect data-plate-draw x="10" y="10" width="300" height="250" rx="6" />
        <path data-plate-draw d="M10 34 H310" />
        <circle data-plate-draw cx="26" cy="22" r="3" />
        <circle data-plate-draw cx="38" cy="22" r="3" />
        <circle data-plate-draw cx="50" cy="22" r="3" />
      </g>
      {blocks.map(({ key, shape, cross: [x, y] }) => (
        <g key={key}>
          <g className="plate-ink" data-plate-block>{shape}</g>
          <path className="plate-mute" data-plate-cross d={`M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}`} />
        </g>
      ))}
      <g className="plate-signal" data-plate-beam>
        <path d="M10 10 V260" />
        <path d="M6 10 H14 M6 260 H14" />
      </g>
      <text className="plate-mono" data-plate-label x="10" y="292">Parsed 0 / 6 blocks</text>
      <text className="plate-mono plate-mono--signal" data-plate-label x="10" y="318">Not cited</text>
      <path className="plate-signal" data-plate-underline d="M10 326 H86" />
    </PlateFrame>
  )
}

/** Fig. 2 — scattered content pulled into one structure an assistant can read, then cite. */
export const RESTRUCTURE_SCATTER = [
  { x: -46, y: 70, rotation: -24 },
  { x: 60, y: 150, rotation: 18 },
  { x: -10, y: 30, rotation: 32 },
  { x: 40, y: -60, rotation: -14 },
  { x: -70, y: -120, rotation: 20 },
  { x: 20, y: -90, rotation: -30 },
] as const

export const SCRIBBLE_PATH = 'M16 262 C 52 228, 86 296, 122 258 S 190 296, 222 254 S 286 290, 304 262'
export const BASELINE_PATH = 'M16 262 C 112 262, 208 262, 304 262'

/** The assistants that come asking once the site is readable. Generic, never branded. */
const ASKERS = [
  { x: 10, label: 'Chat' },
  { x: 118, label: 'Voice' },
  { x: 226, label: 'Search' },
] as const

function RestructurePlate() {
  const nodes = [
    { x: 110, y: 74, w: 100, h: 30 },
    { x: 30, y: 144, w: 100, h: 30 },
    { x: 190, y: 144, w: 100, h: 30 },
    { x: 10, y: 214, w: 76, h: 28 },
    { x: 122, y: 214, w: 76, h: 28 },
    { x: 234, y: 214, w: 76, h: 28 },
  ]

  return (
    <PlateFrame id="readiness" caption="Fig. 2 · Now AI can read you">
      {ASKERS.map((asker) => (
        <g key={asker.label} className="plate-signal" data-plate-asker>
          <rect className="plate-fill" x={asker.x} y="4" width="84" height="26" rx="13" />
          <text className="plate-mono plate-mono--signal" x={asker.x + 42} y="22" textAnchor="middle">{asker.label}</text>
        </g>
      ))}
      <path className="plate-signal" data-plate-query d="M52 30 C 52 54, 160 50, 160 74 M160 30 V74 M268 30 C 268 54, 160 50, 160 74" />
      <path
        className="plate-signal"
        data-plate-draw
        d="M160 104 V124 H80 V144 M160 124 H240 V144 M80 174 V194 H48 V214 M80 194 H160 V214 M240 174 V194 H272 V214"
      />
      {nodes.map((node, index) => (
        <rect key={index} className="plate-ink plate-fill" data-plate-node x={node.x} y={node.y} width={node.w} height={node.h} />
      ))}
      <path className="plate-ink" data-plate-morph d={SCRIBBLE_PATH} />
      <text className="plate-mono" data-plate-label x="16" y="292">Found</text>
      <text className="plate-mono" data-plate-label x="112" y="292">Understood</text>
      <text className="plate-mono plate-mono--signal" data-plate-label x="16" y="318">✓ Cited · Recommended</text>
    </PlateFrame>
  )
}

/** Visitors an assistant sends over, each on its own path into the site. */
export const VISIT_PATHS = [
  'M52 30 C 52 70, 120 80, 140 112',
  'M160 30 V112',
  'M268 30 C 268 70, 200 80, 180 112',
] as const

export const VISITS_FLAT = 'M20 262 C 90 262, 150 262, 300 262'
export const VISITS_RISE = 'M20 262 C 90 258, 150 236, 300 170'

/** Fig. 3 — AI answers turn into visits, and visits turn into leads. */
function LeadsPlate() {
  return (
    <PlateFrame id="proposals" caption="Fig. 3 · Answers become visits and leads">
      {ASKERS.map((asker) => (
        <g key={asker.label} className="plate-ink" data-plate-asker>
          <rect className="plate-fill" x={asker.x} y="4" width="84" height="26" rx="13" />
          <text className="plate-mono" x={asker.x + 42} y="22" textAnchor="middle">Answer</text>
        </g>
      ))}
      {VISIT_PATHS.map((d) => <path key={d} className="plate-mute" data-plate-draw d={d} />)}
      {VISIT_PATHS.flatMap((_, pathIndex) => [0, 1, 2].map((dot) => (
        <circle key={`${pathIndex}-${dot}`} className="plate-signal plate-fill--signal" data-plate-visitor data-path={pathIndex} r="4" cx="0" cy="0" />
      )))}
      <g className="plate-ink">
        <rect data-plate-draw x="100" y="112" width="120" height="44" rx="4" />
        <path data-plate-draw d="M100 124 H220" />
      </g>
      <text className="plate-mono" data-plate-label x="112" y="146">Your site</text>
      {[0, 1, 2].map((index) => (
        <g key={index} className="plate-peri" data-plate-lead>
          <rect className="plate-fill" x={228} y={104 + index * 22} width="88" height="18" />
          <text className="plate-mono plate-mono--peri plate-mono--tiny" x={234} y={117 + index * 22}>+ New lead</text>
        </g>
      ))}
      <path className="plate-mute" data-plate-draw d="M20 180 V262 H300" />
      <path className="plate-signal" data-plate-morph d={VISITS_FLAT} />
      <text className="plate-mono plate-mono--signal" data-plate-label x="20" y="292">Visits ↑</text>
      <text className="plate-mono plate-mono--peri" data-plate-label x="120" y="292">Leads ↑</text>
      <text className="plate-mono" data-plate-label x="20" y="318">Illustrative</text>
    </PlateFrame>
  )
}

/** What each case study will measure — the outcomes, not vanity metrics. */
export const PROOF_METRICS = ['AI citations', 'Visits', 'Leads', 'Hours saved'] as const

/** Fig. 4 — the case study measuring the outcomes, honestly stamped in progress. */
function ProofPlate() {
  return (
    <PlateFrame id="proof" caption={`Fig. 4 · ${content.projects.empty.title}`}>
      <path className="plate-ink" data-plate-draw d="M30 10 H270 L298 38 V300 H30 Z M270 10 V38 H298" />
      <path className="plate-ink" data-plate-draw d="M52 46 H200" />
      {PROOF_METRICS.map((metric, index) => {
        const y = 78 + index * 52
        return (
          <g key={metric}>
            <text className="plate-mono" x="52" y={y}>{metric}</text>
            <path className="plate-mute" data-plate-draw d={`M52 ${y + 14} H276`} />
            <rect className="plate-signal plate-fill--signal" data-plate-bar x="52" y={y + 8} width={120 + index * 30} height="12" />
          </g>
        )
      })}
      <g data-plate-stamp className="plate-peri">
        <rect x="92" y="130" width="148" height="40" />
        <text className="plate-mono plate-mono--peri plate-mono--stamp" x="166" y="155" textAnchor="middle">In progress</text>
      </g>
      <text className="plate-mono" data-plate-label x="30" y="326">Measured, then published</text>
    </PlateFrame>
  )
}

export function StoryPlates() {
  return (
    <div className="story-plates" data-story-plates aria-hidden="true">
      <InvisiblePlate />
      <RestructurePlate />
      <LeadsPlate />
      <ProofPlate />
    </div>
  )
}
