import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Risk } from '@/lib/types'
import { getSeverityColor } from '@/lib/data'
import { cn } from '@/lib/utils'

interface RiskMatrixProps {
  risks: Risk[]
  onRiskClick: (risk: Risk) => void
}

export function RiskMatrix({ risks, onRiskClick }: RiskMatrixProps) {
  const quadrants = [
    { name: 'Low Priority', likelihoodRange: [0, 5], impactRange: [0, 5], color: 'bg-muted/30' },
    { name: 'Monitor', likelihoodRange: [6, 10], impactRange: [0, 5], color: 'bg-accent/20' },
    { name: 'Attention Required', likelihoodRange: [0, 5], impactRange: [6, 10], color: 'bg-warning/20' },
    { name: 'Critical Action', likelihoodRange: [6, 10], impactRange: [6, 10], color: 'bg-destructive/20' }
  ]

  const getRiskQuadrant = (risk: Risk) => {
    for (const quadrant of quadrants) {
      if (
        risk.likelihood >= quadrant.likelihoodRange[0] &&
        risk.likelihood <= quadrant.likelihoodRange[1] &&
        risk.impactScore >= quadrant.impactRange[0] &&
        risk.impactScore <= quadrant.impactRange[1]
      ) {
        return quadrant
      }
    }
    return quadrants[0]
  }

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden">
        {quadrants.slice().reverse().map((quadrant, index) => {
          const quadrantRisks = risks.filter((risk) => {
            const riskQuadrant = getRiskQuadrant(risk)
            return riskQuadrant.name === quadrant.name
          })

          return (
            <div
              key={index}
              className={cn('p-6 min-h-[300px]', quadrant.color)}
            >
              <h3 className="font-semibold mb-2">{quadrant.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Likelihood: {quadrant.likelihoodRange[0]}-{quadrant.likelihoodRange[1]} | Impact: {quadrant.impactRange[0]}-{quadrant.impactRange[1]}
              </p>
              <div className="space-y-2">
                {quadrantRisks.length > 0 ? (
                  quadrantRisks.map((risk) => (
                    <div
                      key={risk.id}
                      onClick={() => onRiskClick(risk)}
                      className="flex items-center gap-2 p-2 rounded bg-card/80 hover:bg-card cursor-pointer transition-colors border border-border/50"
                    >
                      <Badge className={cn('text-xs flex-shrink-0', getSeverityColor(risk.severity))}>
                        {risk.severity.slice(0, 1).toUpperCase()}
                      </Badge>
                      <span className="text-sm truncate">{risk.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                        {risk.likelihood}×{risk.impactScore}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No risks in this quadrant</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Y-Axis:</span>
          <span>Impact Score</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">X-Axis:</span>
          <span>Likelihood</span>
        </div>
      </div>
    </Card>
  )
}
