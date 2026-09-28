import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ReactNode } from 'react';

/**
 * The laptop drawing is inlined at build time rather than loaded as <img>:
 * inline SVG is never a Largest Contentful Paint candidate, so the lid that
 * swings open after hydration can't push LCP past the hero copy. Server-only.
 */
const drawing = (name: string, prefix: string) =>
  readFileSync(join(process.cwd(), 'public/assets', name), 'utf8')
    .replace(/<\?xml[^>]*>\s*/, '')
    .replace(/<!--[\s\S]*?-->\s*/g, '')
    // Both drawings share ids (e.g. "objects"); scope them so the page has no duplicates.
    .replace(/\bid="([^"]+)"/g, `id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${prefix}-$1"`);
const LAPTOP_BASE_SVG = drawing('laptop-base.svg', 'laptop-base');
const LAPTOP_LID_SVG = drawing('laptop-lid.svg', 'laptop-lid');

interface DeviceShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Drafting apparatus drawn over the laptop: registration marks at the hardware's
 * corners, construction guides on the screen edges, and a dimension line with a
 * live scale readout. Decorative and enhancement-only; geometry is in percent
 * of the 600×600 asset so it tracks the shell at any size.
 */
function LaptopBlueprint() {
  return (
    <div className="story-blueprint" aria-hidden="true">
      <span className="story-blueprint__guide story-blueprint__guide--h" data-story-guide style={{ top: '21.25%' }} />
      <span className="story-blueprint__guide story-blueprint__guide--h" data-story-guide style={{ top: '63.38%' }} />
      <span className="story-blueprint__guide story-blueprint__guide--v" data-story-guide style={{ left: '15.93%' }} />
      <span className="story-blueprint__guide story-blueprint__guide--v" data-story-guide style={{ left: '83.54%' }} />
      <span className="story-blueprint__mark story-blueprint__mark--tl" data-story-mark />
      <span className="story-blueprint__mark story-blueprint__mark--tr" data-story-mark />
      <span className="story-blueprint__mark story-blueprint__mark--bl" data-story-mark />
      <span className="story-blueprint__mark story-blueprint__mark--br" data-story-mark />
      <div className="story-blueprint__dim" data-story-dimension>
        <span className="story-blueprint__dim-label">
          Elevation <span data-story-scale-readout>Scale 1.00</span>
        </span>
      </div>
    </div>
  );
}

export function LaptopShell({ children, className = '' }: DeviceShellProps) {
  return (
    <div
      className={`story-device story-laptop ${className}`.trim()}
      data-device="laptop"
    >
      {/* Two layers of one 600×600 drawing, so the lid can hinge over the base.
          The lid carries the screen; its transform origin is the hinge line. */}
      <span className="story-laptop__art story-laptop__base" aria-hidden="true" dangerouslySetInnerHTML={{ __html: LAPTOP_BASE_SVG }} />
      <div className="story-laptop__lid" data-story-lid>
        <span className="story-laptop__art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: LAPTOP_LID_SVG }} />
        <div className="story-device__viewport story-laptop__viewport">
          {children}
          {/* Screen instruments: the render scan line and the story's progress rule. */}
          <span className="story-scan" data-story-scan aria-hidden="true" />
          <span className="story-screen-progress" data-story-screen-progress aria-hidden="true" />
        </div>
      </div>
      <LaptopBlueprint />
    </div>
  );
}
