import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MonitoringTool } from '@/lib/types'
import { Activity, TrendUp, TrendDown, CheckCircle, Warning, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface MonitoringToolCardProps {
  tool: MonitoringTool
}

const statusConfig = {
  healthy: {
    icon: CheckCircle,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    badge: 'bg-primary text-primary-foreground'
  },
  warning: {
    icon: Warning,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    badge: 'bg-warning text-warning-foreground'
  },
  critical: {
    icon: X,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    badge: 'bg-destructive text-destructive-foreground'
  },
  offline: {
    icon: X,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    badge: 'bg-muted text-muted-foreground'
  }
}

export function MonitoringToolCard({ tool }: MonitoringToolCardProps) {
  const config = statusConfig[tool.status]
  const StatusIcon = config.icon

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border-border/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-3 rounded-lg', config.bgColor)}>
            <Activity size={24} weight="duotone" className={config.color} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{tool.name}</h3>
            <p className="text-xs text-muted-foreground">{tool.lastCheck}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tool.alertCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {tool.alertCount} Alert{tool.alertCount !== 1 && 's'}
            </Badge>
          )}
          <Badge className={cn('text-xs font-medium', config.badge)}>
            <StatusIcon size={12} className="mr-1" />
            {tool.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tool.metrics.map((metric, index) => (
          <div key={index} className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              {metric.trend !== undefined && (
                <span className={cn('text-xs flex items-center gap-0.5', metric.trend > 0 ? 'text-primary' : 'text-destructive')}>
                  {metric.trend > 0 ? <TrendUp size={12} /> : <TrendDown size={12} />}
                  {Math.abs(metric.trend)}
                </span>
              )}
            </div>
            <p className={cn('text-sm font-semibold font-mono', metric.status && statusConfig[metric.status]?.color)}>
              {metric.value}{metric.unit && ` ${metric.unit}`}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
