import { getHealthStatus } from '../../utils/getHealthStatus'

interface HealthBadgeProps {
  percentage: number
}

const statusStyles = {
  healthy: {
    label: 'Healthy',
    badge: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  degraded: {
    label: 'Degraded',
    badge: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-400',
  },
  critical: {
    label: 'Critical',
    badge: 'bg-red-50 text-red-700',
    dot: 'bg-red-500',
  },
} as const

export function HealthBadge({ percentage }: HealthBadgeProps) {
  const status = getHealthStatus(percentage)
  const styles = statusStyles[status]

  return (
    <div
      className="flex shrink-0 items-center gap-2.5"
      aria-label={`${percentage}% service health, ${styles.label}`}
    >
      <span
        className={`min-w-14 rounded px-2.5 py-1 text-center text-sm font-bold tabular-nums sm:text-base ${styles.badge}`}
      >
        {percentage}%
      </span>
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`}
      />
    </div>
  )
}
