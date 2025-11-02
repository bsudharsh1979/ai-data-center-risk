import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RiskCard } from '@/components/RiskCard'
import { MonitoringToolCard } from '@/components/MonitoringToolCard'
import { RiskDetailDialog } from '@/components/RiskDetailDialog'
import { RiskMatrix } from '@/components/RiskMatrix'
import { BestPracticesPanel } from '@/components/BestPracticesPanel'
import { risks, monitoringTools } from '@/lib/data'
import { Risk } from '@/lib/types'
import { Activity, ChartBar, BookOpen, ShieldCheck, CheckCircle } from '@phosphor-icons/react'

function App() {
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleRiskClick = (risk: Risk) => {
    setSelectedRisk(risk)
    setDialogOpen(true)
  }

  const criticalRisks = risks.filter((r) => r.severity === 'critical')
  const highRisks = risks.filter((r) => r.severity === 'high')
  const totalAlerts = monitoringTools.reduce((sum, tool) => sum + tool.alertCount, 0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Data Center Risk Management</h1>
              <p className="text-sm text-muted-foreground mt-1">NVIDIA Infrastructure & Operations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <ShieldCheck size={20} className="text-primary" weight="duotone" />
                <div>
                  <p className="text-xs text-muted-foreground">System Status</p>
                  <p className="text-sm font-semibold text-primary">Operational</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {criticalRisks.length > 0 && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertDescription className="flex items-center gap-2">
              <CheckCircle size={18} className="text-destructive" />
              <span>
                <strong>{criticalRisks.length} Critical Risk{criticalRisks.length !== 1 && 's'}</strong> require immediate attention
              </span>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-card border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Total Risks</p>
            <p className="text-3xl font-bold">{risks.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-muted-foreground mb-1">Critical</p>
            <p className="text-3xl font-bold text-destructive">{criticalRisks.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-sm text-muted-foreground mb-1">High Priority</p>
            <p className="text-3xl font-bold text-warning">{highRisks.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
            <p className="text-3xl font-bold text-accent">{totalAlerts}</p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="gap-2">
              <Activity size={16} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="gap-2">
              <Activity size={16} />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="matrix" className="gap-2">
              <ChartBar size={16} />
              Matrix
            </TabsTrigger>
            <TabsTrigger value="practices" className="gap-2">
              <BookOpen size={16} />
              Best Practices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Infrastructure Risks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {risks.map((risk) => (
                  <RiskCard key={risk.id} risk={risk} onClick={() => handleRiskClick(risk)} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Monitoring Tools</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {monitoringTools.map((tool) => (
                  <MonitoringToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="matrix" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Risk Assessment Matrix</h2>
              <RiskMatrix risks={risks} onRiskClick={handleRiskClick} />
            </div>
          </TabsContent>

          <TabsContent value="practices" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Best Practices Library</h2>
              <BestPracticesPanel />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <RiskDetailDialog risk={selectedRisk} open={dialogOpen} onOpenChange={setDialogOpen} />
      <Toaster />
    </div>
  )
}

export default App