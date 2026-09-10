import type { ViewState } from '../../types/bank.types'

interface StatusTabsProps {
  value: ViewState
  onChange: (state: ViewState) => void
}

const states: Array<{ label: string; value: ViewState }> = [
  { label: 'Loaded', value: 'loaded' },
  { label: 'Skeleton', value: 'skeleton' },
  { label: 'Empty', value: 'empty' },
  { label: 'Error', value: 'error' },
]

export function StatusTabs({ value, onChange }: StatusTabsProps) {
  return (
    <div
      role="group"
      aria-label="Preview state"
      className="flex items-center justify-between gap-2 sm:justify-start sm:gap-3"
    >
      {states.map((state) => {
        const isActive = state.value === value

        return (
          <button
            key={state.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(state.value)}
            className={`min-h-11 rounded-full border px-4 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f5f8] sm:min-h-12 sm:px-6 sm:text-base ${
              isActive
                ? 'border-blue-600 bg-blue-600 text-white shadow-[0_5px_12px_rgba(37,99,235,0.25)] hover:bg-blue-700'
                : 'border-slate-200 bg-white text-slate-500 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {state.label}
          </button>
        )
      })}
    </div>
  )
}
