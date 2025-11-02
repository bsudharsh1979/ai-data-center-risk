export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low'
export type RiskCategory = 'gpu-hardware' | 'network-dpu' | 'nvlink' | 'software' | 'power-cooling' | 'storage-io' | 'security' | 'compliance'

export interface Risk {
  id: string
  name: string
  category: RiskCategory
  severity: RiskSeverity
  description: string
  impact: string
  likelihood: number
  impactScore: number
  affectedSystems: string[]
  dependencies: string[]
  mitigation: string[]
  monitoringTools: string[]
  recentIncidents: number
  trend: 'increasing' | 'stable' | 'decreasing'
}

export interface MonitoringTool {
  id: string
  name: string
  status: 'healthy' | 'warning' | 'critical' | 'offline'
  description: string
  metrics: MetricData[]
  alertCount: number
  lastCheck: string
}

export interface MetricData {
  label: string
  value: string | number
  unit?: string
  status?: 'healthy' | 'warning' | 'critical'
  trend?: number
}

export interface BestPractice {
  id: string
  title: string
  category: RiskCategory
  description: string
  steps: string[]
  relatedRisks: string[]
  implemented: boolean
}
