import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Risk } from '@/lib/types'
import { getSeverityColor, getCategoryInfo, risks } from '@/lib/data'
import { CheckCircle, Warning, GitFork, Activity } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface RiskDetailDialogProps {
  risk: Risk | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RiskDetailDialog({ risk, open, onOpenChange }: RiskDetailDialogProps) {
  if (!risk) return null

  const categoryInfo = getCategoryInfo(risk.category)
  const dependentRisks = risks.filter((r) => risk.dependencies.includes(r.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-3">
              {risk.name}
              <Badge className={cn('text-xs', getSeverityColor(risk.severity))}>
                {risk.severity.toUpperCase()}
              </Badge>
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">{categoryInfo.label}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Warning size={18} />
                Description
              </h3>
              <p className="text-sm text-muted-foreground">{risk.description}</p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Impact</h3>
              <p className="text-sm text-muted-foreground">{risk.impact}</p>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-sm">Risk Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Likelihood</span>
                      <span className="text-xs font-semibold">{risk.likelihood}/10</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-warning transition-all"
                        style={{ width: `${(risk.likelihood / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Impact Score</span>
                      <span className="text-xs font-semibold">{risk.impactScore}/10</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-destructive transition-all"
                        style={{ width: `${(risk.impactScore / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-sm">Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Recent Incidents</span>
                    <Badge variant="outline" className="text-xs">
                      {risk.recentIncidents}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Trend</span>
                    <Badge variant="outline" className="text-xs">
                      {risk.trend}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Dependencies</span>
                    <Badge variant="outline" className="text-xs">
                      {risk.dependencies.length}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Affected Systems</h3>
              <div className="flex flex-wrap gap-2">
                {risk.affectedSystems.map((system, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {system}
                  </Badge>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="mitigation" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle size={18} />
                Mitigation Strategies
              </h3>
              <div className="space-y-2">
                {risk.mitigation.map((strategy, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground pt-0.5">{strategy}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Activity size={18} />
                Monitoring Tools
              </h3>
              <div className="space-y-3">
                {risk.monitoringTools.map((tool, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <Activity size={20} className="text-accent" weight="duotone" />
                      <div>
                        <p className="font-semibold text-sm">{tool}</p>
                        <p className="text-xs text-muted-foreground">Active monitoring and alerting</p>
                      </div>
                    </div>
                    {index < risk.monitoringTools.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="dependencies" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <GitFork size={18} />
                Interdependent Risks
              </h3>
              {dependentRisks.length > 0 ? (
                <div className="space-y-2">
                  {dependentRisks.map((depRisk) => (
                    <div key={depRisk.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <Badge className={cn('text-xs', getSeverityColor(depRisk.severity))}>
                        {depRisk.severity.toUpperCase()}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{depRisk.name}</p>
                        <p className="text-xs text-muted-foreground">{getCategoryInfo(depRisk.category).label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No interdependent risks identified.</p>
              )}
            </Card>

            {dependentRisks.length > 0 && (
              <Card className="p-4 bg-accent/5 border-accent/20">
                <h3 className="font-semibold mb-2 text-sm">Cascading Impact</h3>
                <p className="text-sm text-muted-foreground">
                  This risk can trigger or amplify {dependentRisks.length} other risk{dependentRisks.length !== 1 && 's'} in your infrastructure.
                  Addressing this risk will help mitigate multiple failure scenarios.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
