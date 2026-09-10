const legendItems = [
  { label: 'Healthy \u226565%', dot: 'bg-emerald-500' },
  { label: 'Degraded 50\u201364%', dot: 'bg-amber-400' },
  { label: 'Critical <50%', dot: 'bg-red-500' },
]

export function HealthLegend() {
  return (
    <div
      aria-label="Bank health legend"
      className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-1 sm:justify-start"
    >
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${item.dot}`}
          />
          <span className="text-xs font-semibold text-slate-500">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
