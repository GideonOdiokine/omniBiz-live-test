import { Landmark, RefreshCw } from 'lucide-react'

interface EmptyStateProps {
  onRetry?: () => void
}

export function EmptyState({ onRetry }: EmptyStateProps) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Landmark aria-hidden="true" className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-lg font-bold text-slate-950">
        No banks available
      </h2>
      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
        There are no banks available for transfer right now. Refresh to check
        again.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Refresh
        </button>
      )}
    </div>
  )
}
