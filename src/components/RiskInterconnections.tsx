import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Risk } from '@/lib/types'
import { getCategoryInfo, getSeverityColor, risks } from '@/lib/data'
import { GitBranch } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface RiskInterconnectionsProps {
  onRiskClick: (risk: Risk) => void
}

export function RiskInterconnections({ onRiskClick }: RiskInterconnectionsProps) {
  const technicalRisks = risks.filter(r => r.type === 'technical')
  const businessRisks = risks.filter(r => r.type === 'business')

  const getConnectedRisks = (riskId: string) => {
    const risk = risks.find(r => r.id === riskId)
    if (!risk) return []
    return risks.filter(r => risk.interconnections.includes(r.id))
  }

  const RiskNode = ({ risk }: { risk: Risk }) => {
    const categoryInfo = getCategoryInfo(risk.category)
    const connections = getConnectedRisks(risk.id)
    
    return (
      <div className="relative">
        <Card
          onClick={() => onRiskClick(risk)}
          className={cn(
            'p-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-border/50 backdrop-blur-sm',
            risk.severity === 'critical' && 'border-destructive/50'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn('text-xs', getSeverityColor(risk.severity))}>
              {risk.severity.charAt(0).toUpperCase()}
            </Badge>
            <h4 className="text-xs font-semibold line-clamp-1">{risk.name}</h4>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{categoryInfo.label}</p>
          {connections.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-accent">
              <GitBranch size={12} />
              <span>{connections.length}</span>
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-accent/5 border-accent/20">
        <div className="flex items-center gap-3 mb-3">
          <GitBranch size={24} className="text-accent" weight="duotone" />
          <div>
            <h3 className="text-lg font-semibold">Risk Interconnection Map</h3>
            <p className="text-sm text-muted-foreground">
              Visualization of how risks interconnect across technical and business domains
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Technical Risks</h3>
            <Badge variant="secondary">{technicalRisks.length} risks</Badge>
          </div>
          <div className="space-y-3">
            {technicalRisks.map((risk) => (
              <RiskNode key={risk.id} risk={risk} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Business Risks</h3>
            <Badge variant="secondary">{businessRisks.length} risks</Badge>
          </div>
          <div className="space-y-3">
            {businessRisks.map((risk) => (
              <RiskNode key={risk.id} risk={risk} />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Key Interconnections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {risks
            .filter(r => r.interconnections.length >= 3)
            .sort((a, b) => b.interconnections.length - a.interconnections.length)
            .slice(0, 6)
            .map((risk) => {
              const categoryInfo = getCategoryInfo(risk.category)
              const connectedRisks = getConnectedRisks(risk.id)
              
              return (
                <Card
                  key={risk.id}
                  className="p-4 cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => onRiskClick(risk)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={cn('text-xs', getSeverityColor(risk.severity))}>
                          {risk.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {risk.type}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{risk.name}</h4>
                      <p className="text-xs text-muted-foreground">{categoryInfo.label}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <GitBranch size={14} className="text-accent" />
                      <span>Connected to {connectedRisks.length} risks:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {connectedRisks.slice(0, 3).map((connected) => (
                        <Badge key={connected.id} variant="outline" className="text-xs">
                          {connected.name.split(' ')[0]}...
                        </Badge>
                      ))}
                      {connectedRisks.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{connectedRisks.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
        </div>
      </Card>
    </div>
  )
}
