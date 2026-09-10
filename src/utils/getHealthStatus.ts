import type { HealthStatus } from '../types/bank.types'

export function getHealthStatus(percentage: number): HealthStatus {
  if (percentage < 50) return 'critical'
  if (percentage < 65) return 'degraded'
  return 'healthy'
}
