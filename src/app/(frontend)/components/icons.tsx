import {
  Database,
  Layers,
  Code,
  Server,
  Activity,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Search,
  Sparkles,
  Users,
  Rocket,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'

const iconMap: Record<string, React.FC<LucideProps>> = {
  Database,
  Layers,
  Code,
  Server,
  Activity,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Search,
  Sparkles,
  Users,
  Rocket,
}

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = iconMap[name]
  if (!Component) return null
  return <Component {...props} />
}
