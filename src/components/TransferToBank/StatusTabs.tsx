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
      className="grid grid-cols-4 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
    >
      {states.map((state) => {
        const isActive = state.value === value

        return (
          <button
            key={state.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(state.value)}
            className={`min-h-9 rounded-md px-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:text-sm ${
              isActive
                ? 'bg-slate-950 text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {state.label}
          </button>
        )
      })}
    </div>
  )
}
