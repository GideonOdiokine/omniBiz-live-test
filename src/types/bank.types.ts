export interface Bank {
  id: string
  name: string
  initials: string
  healthPercentage: number
  brandColor: string
}

export type HealthStatus = 'healthy' | 'degraded' | 'critical'

export type ViewState = 'loaded' | 'skeleton' | 'empty' | 'error'
