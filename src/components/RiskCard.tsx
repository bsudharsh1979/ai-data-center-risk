import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Risk } from '@/lib/types'
import { getCategoryInfo, getSeverityColor } from '@/lib/data'
import {
  Cpu,
  Network,
  LinkSimple,
  Code,
  Lightning,
  Database,
  ShieldCheck,
  CheckCircle,
  Cube,
  TrendUp,
  TrendDown,
  Minus,
  Warning
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface RiskCardProps {
  risk: Risk
  onClick: () => void
}

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Network,
  LinkSimple,
  Code,
  Lightning,
  Database,
  ShieldCheck,
  CheckCircle,
  Cube
}

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'increasing') return <TrendUp className="text-destructive" />
  if (trend === 'decreasing') return <TrendDown className="text-primary" />
  return <Minus className="text-muted-foreground" />
}

export function RiskCard({ risk, onClick }: RiskCardProps) {
  const categoryInfo = getCategoryInfo(risk.category)
  const IconComponent = iconMap[categoryInfo.icon] || Cube

  const isPulsing = risk.severity === 'critical'

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-border/50 backdrop-blur-sm',
        isPulsing && 'animate-pulse-glow border-destructive/50'
      )}
      style={isPulsing ? { animation: 'pulse-glow 2s ease-in-out infinite' } : undefined}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg bg-card/50', categoryInfo.color)}>
            <IconComponent size={24} weight="duotone" />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">{risk.name}</h3>
            <p className="text-xs text-muted-foreground">{categoryInfo.label}</p>
          </div>
        </div>
        <Badge className={cn('text-xs font-medium', getSeverityColor(risk.severity))}>
          {risk.severity.toUpperCase()}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{risk.description}</p>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-8 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all',
                  risk.severity === 'critical' && 'bg-destructive',
                  risk.severity === 'high' && 'bg-warning',
                  risk.severity === 'medium' && 'bg-accent',
                  risk.severity === 'low' && 'bg-primary'
                )}
                style={{ width: `${(risk.likelihood / 10) * 100}%` }}
              />
            </div>
            <span className="text-muted-foreground">L:{risk.likelihood}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all',
                  risk.severity === 'critical' && 'bg-destructive',
                  risk.severity === 'high' && 'bg-warning',
                  risk.severity === 'medium' && 'bg-accent',
                  risk.severity === 'low' && 'bg-primary'
                )}
                style={{ width: `${(risk.impactScore / 10) * 100}%` }}
              />
            </div>
            <span className="text-muted-foreground">I:{risk.impactScore}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TrendIcon trend={risk.trend} />
          {risk.recentIncidents > 0 && (
            <div className="flex items-center gap-1 text-warning">
              <Warning size={14} />
              <span>{risk.recentIncidents}</span>
            </div>
          )}
        </div>
      </div>

      {risk.dependencies.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Affects {risk.dependencies.length} other risk{risk.dependencies.length !== 1 && 's'}
          </p>
        </div>
      )}
    </Card>
  )
}
