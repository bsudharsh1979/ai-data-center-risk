import { Risk, MonitoringTool, BestPractice } from './types'

export const risks: Risk[] = [
  {
    id: 'gpu-1',
    name: 'GPU Hardware Failures',
    category: 'gpu-hardware',
    type: 'technical',
    severity: 'high',
    description: 'NVIDIA GPUs can suffer memory errors, overheating, or driver faults causing training jobs to crash or slow down across distributed nodes.',
    impact: 'Training job interruptions, reduced cluster performance, potential data loss in multi-node distributed workloads.',
    likelihood: 7,
    impactScore: 8,
    affectedSystems: ['DGX Systems', 'GPU Compute Nodes', 'Training Clusters'],
    dependencies: ['power-1', 'nvlink-1', 'software-1'],
    interconnections: ['business-1', 'business-3', 'power-1'],
    mitigation: [
      'Enable ECC memory on all GPUs',
      'Implement DCGM proactive health checks before job execution',
      'Maintain hot-standby spare GPU nodes',
      'Schedule preventive maintenance on early warning signs',
      'Monitor temperature and memory error rates continuously'
    ],
    monitoringTools: ['DCGM', 'Base Command Manager'],
    recentIncidents: 3,
    trend: 'stable'
  },
  {
    id: 'network-1',
    name: 'DPU and Network Failures',
    category: 'network-dpu',
    type: 'technical',
    severity: 'critical',
    description: 'BlueField DPU malfunctions or InfiniBand fabric issues can disconnect nodes, causing packet loss and GPU communication stalls.',
    impact: 'Cluster-wide communication failures, thousands of GPUs idle, complete training run interruption.',
    likelihood: 5,
    impactScore: 9,
    affectedSystems: ['InfiniBand Fabric', 'BlueField DPUs', 'Network Switches', 'Storage Network'],
    dependencies: ['storage-1', 'software-1'],
    interconnections: ['business-1', 'business-2', 'gpu-1', 'security-1'],
    mitigation: [
      'Configure dual-rail InfiniBand with redundant paths',
      'Enable adaptive routing for automatic failover',
      'Deploy UFM Cyber-AI for real-time fabric monitoring',
      'Implement link failure prediction alerts',
      'Keep network firmware updated regularly'
    ],
    monitoringTools: ['UFM', 'BlueField DPU Telemetry'],
    recentIncidents: 2,
    trend: 'decreasing'
  },
  {
    id: 'nvlink-1',
    name: 'NVLink/NVSwitch Interconnect Issues',
    category: 'nvlink',
    type: 'technical',
    severity: 'high',
    description: 'NVLink failures or NVSwitch errors reduce intra-node GPU communication, forcing slower PCIe fallback paths.',
    impact: 'Reduced training throughput, GPU partition isolation, effective GPU count reduction for large models.',
    likelihood: 4,
    impactScore: 7,
    affectedSystems: ['DGX Servers', 'HGX Platforms', 'Multi-GPU Nodes'],
    dependencies: ['gpu-1', 'power-1'],
    interconnections: ['gpu-1', 'business-3'],
    mitigation: [
      'Monitor NVLink error counters and retry rates',
      'Ensure adequate cooling for NVSwitch chips',
      'Apply NVSwitch/NVLink firmware updates',
      'Run DCGM interconnect bandwidth diagnostics',
      'Take nodes offline on fabric health warnings'
    ],
    monitoringTools: ['DCGM', 'Base Command Manager'],
    recentIncidents: 1,
    trend: 'stable'
  },
  {
    id: 'software-1',
    name: 'Software & Orchestration Failures',
    category: 'software',
    type: 'technical',
    severity: 'medium',
    description: 'Cluster management misconfigurations, scheduler errors, or container orchestration issues lead to resource allocation failures.',
    impact: 'Jobs stuck in queue, GPU oversubscription, service startup failures, driver version mismatches.',
    likelihood: 6,
    impactScore: 6,
    affectedSystems: ['Kubernetes Clusters', 'Slurm Scheduler', 'Container Runtime', 'Driver Stack'],
    dependencies: ['gpu-1', 'network-1'],
    interconnections: ['business-2', 'business-3', 'compliance-1'],
    mitigation: [
      'Use Base Command Manager for standardized provisioning',
      'Implement configuration-as-code for repeatability',
      'Enable health checks for all cluster services',
      'Validate changes in staging environment first',
      'Leverage rolling updates to avoid cluster-wide outages'
    ],
    monitoringTools: ['Base Command Manager', 'Kubernetes Metrics'],
    recentIncidents: 5,
    trend: 'increasing'
  },
  {
    id: 'power-1',
    name: 'Power and Cooling Concerns',
    category: 'power-cooling',
    type: 'technical',
    severity: 'critical',
    description: 'Power infrastructure failures and cooling system issues cause GPU throttling, shutdowns, and accelerated hardware degradation.',
    impact: 'Multi-node power loss, thermal throttling reducing performance, hardware damage from overheating.',
    likelihood: 6,
    impactScore: 9,
    affectedSystems: ['Power Distribution', 'UPS Systems', 'CRAC Units', 'GPU Thermal Management'],
    dependencies: ['gpu-1', 'nvlink-1'],
    interconnections: ['gpu-1', 'business-4', 'business-1'],
    mitigation: [
      'Deploy redundant PDUs on separate circuits',
      'Implement hot aisle/cold aisle containment',
      'Monitor temperature at multiple rack heights',
      'Set DCGM thermal throttle alerts',
      'Maintain regular cooling system maintenance'
    ],
    monitoringTools: ['DCGM', 'Facility Management Systems'],
    recentIncidents: 1,
    trend: 'stable'
  },
  {
    id: 'storage-1',
    name: 'Storage and I/O Performance Degradation',
    category: 'storage-io',
    type: 'technical',
    severity: 'medium',
    description: 'Slow data feeds from storage systems cause GPU starvation, with expensive compute resources sitting idle.',
    impact: 'GPU underutilization, extended training times, potential I/O errors or timeouts.',
    likelihood: 7,
    impactScore: 5,
    affectedSystems: ['Parallel File Systems', 'NVMe Storage', 'Network Storage', 'GPUDirect Storage'],
    dependencies: ['network-1'],
    interconnections: ['network-1', 'business-3', 'business-2'],
    mitigation: [
      'Use high-performance parallel file systems',
      'Enable RDMA for low-latency storage access',
      'Monitor GPU I/O wait times continuously',
      'Implement data prefetching with NVIDIA DALI',
      'Deploy redundant storage servers for failover'
    ],
    monitoringTools: ['DCGM', 'Storage Analytics'],
    recentIncidents: 4,
    trend: 'stable'
  },
  {
    id: 'security-1',
    name: 'Security Vulnerabilities',
    category: 'security',
    type: 'technical',
    severity: 'high',
    description: 'Data leakage, unauthorized access, and GPU hijacking attacks threaten valuable models and sensitive training data.',
    impact: 'Intellectual property theft, compliance violations, unauthorized GPU usage for crypto-mining.',
    likelihood: 5,
    impactScore: 8,
    affectedSystems: ['User Access Systems', 'Network Security', 'Container Isolation', 'Data Storage'],
    dependencies: ['network-1', 'software-1'],
    interconnections: ['business-5', 'compliance-1', 'business-2'],
    mitigation: [
      'Implement RBAC and multi-factor authentication',
      'Deploy BlueField DPU micro-segmentation',
      'Enable network traffic encryption',
      'Regular vulnerability scanning and patching',
      'Audit all cluster job submissions'
    ],
    monitoringTools: ['BlueField DPU Telemetry', 'Base Command Manager', 'SIEM Integration'],
    recentIncidents: 2,
    trend: 'increasing'
  },
  {
    id: 'compliance-1',
    name: 'Compliance and Auditing Challenges',
    category: 'compliance',
    type: 'business',
    severity: 'medium',
    description: 'Regulatory requirements for data sovereignty, audit logging, and standards compliance across AI infrastructure.',
    impact: 'Legal penalties, failed audits, inability to process regulated data, reputational damage.',
    likelihood: 4,
    impactScore: 7,
    affectedSystems: ['Audit Logging', 'Access Control', 'Data Management', 'Configuration Management'],
    dependencies: ['security-1', 'software-1'],
    interconnections: ['security-1', 'business-5', 'business-2'],
    mitigation: [
      'Centralized audit trail via Base Command Manager',
      'Enforce role-based privileges for data access',
      'Integrate logs with SIEM systems',
      'Regular configuration compliance audits',
      'Document all changes in version control'
    ],
    monitoringTools: ['Base Command Manager', 'SIEM Integration'],
    recentIncidents: 1,
    trend: 'stable'
  },
  {
    id: 'business-1',
    name: 'Service Level Agreement (SLA) Violations',
    category: 'compliance',
    type: 'business',
    severity: 'critical',
    description: 'Infrastructure failures leading to extended downtime breach SLA commitments with customers and internal stakeholders.',
    impact: 'Financial penalties, customer churn, revenue loss, reputational damage, contract renegotiations.',
    likelihood: 6,
    impactScore: 9,
    affectedSystems: ['Customer Contracts', 'Service Delivery', 'Financial Systems'],
    dependencies: ['gpu-1', 'network-1', 'power-1'],
    interconnections: ['gpu-1', 'network-1', 'power-1', 'business-2'],
    mitigation: [
      'Implement comprehensive uptime monitoring',
      'Establish incident response procedures',
      'Maintain redundancy for critical systems',
      'Regular SLA performance reviews',
      'Transparent communication with stakeholders'
    ],
    monitoringTools: ['Base Command Manager', 'Service Monitoring'],
    recentIncidents: 1,
    trend: 'stable'
  },
  {
    id: 'business-2',
    name: 'Resource Utilization Inefficiency',
    category: 'software',
    type: 'business',
    severity: 'high',
    description: 'Poor resource allocation and inefficient job scheduling result in underutilized GPU infrastructure and wasted capital investment.',
    impact: 'Reduced ROI, higher operational costs per workload, competitive disadvantage, budget overruns.',
    likelihood: 7,
    impactScore: 7,
    affectedSystems: ['Job Scheduler', 'Resource Manager', 'Financial Planning'],
    dependencies: ['software-1', 'storage-1'],
    interconnections: ['software-1', 'storage-1', 'business-3', 'business-4'],
    mitigation: [
      'Implement GPU utilization analytics',
      'Optimize job scheduling algorithms',
      'Enable dynamic resource allocation',
      'Regular capacity planning reviews',
      'Establish utilization KPI targets'
    ],
    monitoringTools: ['Base Command Manager', 'Analytics Dashboard'],
    recentIncidents: 3,
    trend: 'increasing'
  },
  {
    id: 'business-3',
    name: 'Time-to-Market Delays',
    category: 'software',
    type: 'business',
    severity: 'high',
    description: 'Infrastructure bottlenecks and technical issues slow down AI model development and deployment cycles.',
    impact: 'Missed market opportunities, competitive disadvantage, delayed product launches, reduced innovation velocity.',
    likelihood: 6,
    impactScore: 8,
    affectedSystems: ['Development Pipeline', 'Product Roadmap', 'Market Position'],
    dependencies: ['gpu-1', 'software-1', 'storage-1'],
    interconnections: ['gpu-1', 'software-1', 'nvlink-1', 'business-2'],
    mitigation: [
      'Streamline CI/CD pipelines for AI models',
      'Reduce queue times through better scheduling',
      'Implement fast-track priority queues',
      'Regular infrastructure performance optimization',
      'Automated testing and validation processes'
    ],
    monitoringTools: ['Base Command Manager', 'Pipeline Analytics'],
    recentIncidents: 4,
    trend: 'increasing'
  },
  {
    id: 'business-4',
    name: 'Energy Cost Overruns',
    category: 'power-cooling',
    type: 'business',
    severity: 'medium',
    description: 'Inefficient power management and cooling strategies result in excessive energy consumption and operational costs.',
    impact: 'Budget overruns, reduced profitability, environmental impact, sustainability goal failures.',
    likelihood: 8,
    impactScore: 6,
    affectedSystems: ['Power Infrastructure', 'Cooling Systems', 'Financial Operations'],
    dependencies: ['power-1'],
    interconnections: ['power-1', 'business-2', 'business-5'],
    mitigation: [
      'Implement power usage effectiveness (PUE) monitoring',
      'Optimize cooling efficiency through AI',
      'Schedule non-critical workloads during off-peak hours',
      'Evaluate liquid cooling solutions',
      'Regular energy audit and optimization'
    ],
    monitoringTools: ['Facility Management Systems', 'Energy Analytics'],
    recentIncidents: 2,
    trend: 'stable'
  },
  {
    id: 'business-5',
    name: 'IP and Data Loss Risk',
    category: 'security',
    type: 'business',
    severity: 'critical',
    description: 'Security breaches or data mishandling could expose proprietary AI models, training data, and competitive advantages.',
    impact: 'Loss of competitive advantage, legal liabilities, customer trust erosion, stock price impact.',
    likelihood: 4,
    impactScore: 10,
    affectedSystems: ['Model Repository', 'Training Data', 'Business Intelligence'],
    dependencies: ['security-1', 'compliance-1'],
    interconnections: ['security-1', 'compliance-1', 'network-1'],
    mitigation: [
      'Implement data classification and access controls',
      'Encrypt all sensitive data at rest and in transit',
      'Regular security audits and penetration testing',
      'Employee security awareness training',
      'Incident response and data breach procedures'
    ],
    monitoringTools: ['SIEM Integration', 'DLP Systems', 'Base Command Manager'],
    recentIncidents: 0,
    trend: 'stable'
  }
]

export const monitoringTools: MonitoringTool[] = [
  {
    id: 'dcgm',
    name: 'NVIDIA DCGM',
    status: 'healthy',
    description: 'Data Center GPU Manager - Lightweight monitoring and management for GPU health and performance',
    metrics: [
      { label: 'GPU Health', value: 'Healthy', status: 'healthy' },
      { label: 'Avg Temperature', value: 68, unit: '°C', status: 'healthy', trend: -2 },
      { label: 'ECC Errors', value: 0, status: 'healthy' },
      { label: 'Active Policies', value: 12 },
      { label: 'Monitored GPUs', value: 256 }
    ],
    alertCount: 0,
    lastCheck: '2 minutes ago'
  },
  {
    id: 'ufm',
    name: 'NVIDIA UFM',
    status: 'warning',
    description: 'Unified Fabric Manager - InfiniBand network monitoring with AI-driven analytics',
    metrics: [
      { label: 'Fabric Health', value: 'Warning', status: 'warning' },
      { label: 'Active Links', value: '512/520', status: 'warning' },
      { label: 'Packet Loss', value: 0.02, unit: '%', status: 'healthy' },
      { label: 'Avg Latency', value: 1.3, unit: 'μs', status: 'healthy' },
      { label: 'Congestion Events', value: 3, status: 'warning' }
    ],
    alertCount: 2,
    lastCheck: '1 minute ago'
  },
  {
    id: 'base-command',
    name: 'Base Command Manager',
    status: 'healthy',
    description: 'Cluster management and health monitoring with automated remediation',
    metrics: [
      { label: 'Cluster Health', value: 'Healthy', status: 'healthy' },
      { label: 'Active Nodes', value: '64/64', status: 'healthy' },
      { label: 'Queued Jobs', value: 8 },
      { label: 'Health Triggers', value: 45 },
      { label: 'Auto-Remediation', value: 'Enabled' }
    ],
    alertCount: 0,
    lastCheck: '30 seconds ago'
  },
  {
    id: 'bluefield',
    name: 'BlueField DPU',
    status: 'healthy',
    description: 'Data Processing Unit telemetry with security monitoring and network offload',
    metrics: [
      { label: 'DPU Status', value: 'Operational', status: 'healthy' },
      { label: 'Throughput', value: 234, unit: 'Gbps', status: 'healthy', trend: 5 },
      { label: 'Security Events', value: 0, status: 'healthy' },
      { label: 'Active DPUs', value: '64/64', status: 'healthy' },
      { label: 'Offload Efficiency', value: 94, unit: '%', status: 'healthy' }
    ],
    alertCount: 0,
    lastCheck: '1 minute ago'
  }
]

export const bestPractices: BestPractice[] = [
  {
    id: 'bp-1',
    title: 'Comprehensive GPU Health Monitoring',
    category: 'gpu-hardware',
    description: 'Implement proactive GPU monitoring using DCGM to detect and prevent hardware failures before they impact production workloads.',
    steps: [
      'Deploy DCGM agents on all GPU nodes',
      'Configure health checks for temperature, ECC errors, and NVLink status',
      'Set up automated alerts for degrading components',
      'Integrate DCGM health API with job scheduler',
      'Schedule regular diagnostic runs during maintenance windows'
    ],
    relatedRisks: ['gpu-1', 'nvlink-1', 'power-1'],
    implemented: true
  },
  {
    id: 'bp-2',
    title: 'Network Redundancy and Adaptive Routing',
    category: 'network-dpu',
    description: 'Design resilient network architecture with multiple paths and automatic failover capabilities.',
    steps: [
      'Configure dual-rail InfiniBand topology',
      'Enable adaptive routing on all switches',
      'Deploy UFM for continuous fabric monitoring',
      'Set up link failure prediction alerts',
      'Document network topology and failover procedures'
    ],
    relatedRisks: ['network-1', 'storage-1'],
    implemented: true
  },
  {
    id: 'bp-3',
    title: 'Thermal Management Best Practices',
    category: 'power-cooling',
    description: 'Maintain optimal operating temperatures through proper cooling design and continuous monitoring.',
    steps: [
      'Implement hot aisle/cold aisle containment',
      'Deploy temperature sensors at multiple rack heights',
      'Set DCGM thermal throttle thresholds',
      'Schedule regular CRAC maintenance',
      'Maintain inlet temperatures below 75°F'
    ],
    relatedRisks: ['power-1', 'gpu-1'],
    implemented: false
  },
  {
    id: 'bp-4',
    title: 'Security Hardening with BlueField DPUs',
    category: 'security',
    description: 'Leverage DPU capabilities for zero-trust network security and traffic isolation.',
    steps: [
      'Enable micro-segmentation between nodes',
      'Configure DPU-based firewall policies',
      'Implement DOCA telemetry for security monitoring',
      'Enable encryption for data-in-transit',
      'Integrate DPU logs with SIEM systems'
    ],
    relatedRisks: ['security-1', 'compliance-1'],
    implemented: false
  },
  {
    id: 'bp-5',
    title: 'Configuration Management and Automation',
    category: 'software',
    description: 'Use Base Command Manager to standardize cluster configuration and prevent orchestration errors.',
    steps: [
      'Implement configuration-as-code for all cluster settings',
      'Enable automatic health checks for services',
      'Use staging environment for testing changes',
      'Configure rolling updates for zero-downtime deployments',
      'Maintain version control for all configurations'
    ],
    relatedRisks: ['software-1', 'compliance-1'],
    implemented: true
  }
]

export const getCategoryInfo = (category: string) => {
  const categoryMap: Record<string, { icon: string; label: string; color: string }> = {
    'gpu-hardware': { icon: 'Cpu', label: 'GPU Hardware', color: 'text-accent' },
    'network-dpu': { icon: 'Network', label: 'Network & DPU', color: 'text-primary' },
    'nvlink': { icon: 'LinkSimple', label: 'NVLink/NVSwitch', color: 'text-accent' },
    'software': { icon: 'Code', label: 'Software & Orchestration', color: 'text-primary' },
    'power-cooling': { icon: 'Lightning', label: 'Power & Cooling', color: 'text-destructive' },
    'storage-io': { icon: 'Database', label: 'Storage & I/O', color: 'text-primary' },
    'security': { icon: 'ShieldCheck', label: 'Security', color: 'text-warning' },
    'compliance': { icon: 'CheckCircle', label: 'Compliance', color: 'text-muted-foreground' }
  }
  return categoryMap[category] || { icon: 'Cube', label: category, color: 'text-foreground' }
}

export const getSeverityColor = (severity: string) => {
  const severityMap: Record<string, string> = {
    critical: 'bg-destructive text-destructive-foreground',
    high: 'bg-warning text-warning-foreground',
    medium: 'bg-accent text-accent-foreground',
    low: 'bg-muted text-muted-foreground'
  }
  return severityMap[severity] || 'bg-muted text-muted-foreground'
}
