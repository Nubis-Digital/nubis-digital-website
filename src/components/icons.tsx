/**
 * Icon map — replaces the prototype's lucide UMD + data-lucide attributes.
 * Usage: <Icon name="cpu" /> renders the matching lucide-react icon.
 */
import {
  Cpu,
  Sparkles,
  ShieldCheck,
  Layers,
  Server,
  Activity,
  Search,
  Users,
  Rocket,
  Mic,
  ArrowRight,
  ArrowUpRight,
  X,
  Check,
  Shield,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  sparkles: Sparkles,
  'shield-check': ShieldCheck,
  layers: Layers,
  server: Server,
  activity: Activity,
  search: Search,
  users: Users,
  rocket: Rocket,
  mic: Mic,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  x: X,
  check: Check,
  shield: Shield,
  'alert-triangle': AlertTriangle,
};

export interface IconProps {
  name: string;
  size?: number;
  className?: string;
  'aria-hidden'?: boolean;
}

export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp size={size} className={className} aria-hidden {...rest} />;
}
