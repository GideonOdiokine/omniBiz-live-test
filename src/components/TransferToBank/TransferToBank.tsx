import { useEffect, useState } from 'react'
import { ArrowLeft, Check, RefreshCw } from 'lucide-react'
import { useBanks } from '../../hooks/useBanks'
import type { Bank, ViewState } from '../../types/bank.types'
import { BankList } from './BankList'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { HealthLegend } from './HealthLegend'
import { SkeletonState } from './SkeletonState'
import { StatusTabs } from './StatusTabs'

function formatLastUpdated(lastUpdated: Date | null) {
  if (!lastUpdated) return 'Waiting for data'

  const elapsedSeconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000)

  if (elapsedSeconds < 60) return 'Just now'

  const elapsedMinutes = Math.floor(elapsedSeconds / 60)
  return `${elapsedMinutes} min ago`
}

function isViewState(value: unknown): value is ViewState {
  return ['loaded', 'skeleton', 'empty', 'error'].includes(String(value))
}

function getHistoryState() {
  return typeof window.history.state === 'object' && window.history.state !== null
    ? window.history.state
    : {}
}

function getInitialViewState(): ViewState {
  const savedState = getHistoryState().previewState
  return isViewState(savedState) ? savedState : 'loaded'
}

export function TransferToBank() {
  const {
    banks,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refetch,
  } = useBanks()
  const [previewState, setPreviewState] =
    useState<ViewState>(getInitialViewState)
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)

  useEffect(() => {
    window.history.replaceState(
      { ...getHistoryState(), previewState: getInitialViewState() },
      '',
      window.location.href,
    )

    function handleHistoryChange(event: PopStateEvent) {
      const nextState = event.state?.previewState
      setPreviewState(isViewState(nextState) ? nextState : 'loaded')
      setSelectedBank(null)
    }

    window.addEventListener('popstate', handleHistoryChange)
    return () => window.removeEventListener('popstate', handleHistoryChange)
  }, [])

  function handleBankSelect(bank: Bank) {
    setSelectedBank(bank)
  }

  function handleBack() {
    if (window.history.length > 1) window.history.back()
  }

  function handlePreviewStateChange(nextState: ViewState) {
    if (nextState === previewState) return

    window.history.pushState(
      { ...getHistoryState(), previewState: nextState },
      '',
      window.location.href,
    )
    setPreviewState(nextState)
    setSelectedBank(null)
  }

  function handleRetry() {
    window.history.replaceState(
      { ...getHistoryState(), previewState: 'loaded' },
      '',
      window.location.href,
    )
    setPreviewState('loaded')
    void refetch()
  }

  function renderContent() {
    if (previewState === 'skeleton') return <SkeletonState />
    if (previewState === 'empty') return <EmptyState  />
    if (previewState === 'error') return <ErrorState onRetry={handleRetry} />
    if (isLoading) return <SkeletonState />
    if (error) return <ErrorState message={error} onRetry={handleRetry} />
    if (banks.length === 0) return <EmptyState onRetry={handleRetry} />

    return <BankList banks={banks} onBankSelect={handleBankSelect} />
  }

  return (
    <main className="min-h-svh bg-[#f3f5f8] px-4 py-5 text-slate-950 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-xl">
        <nav className="mb-8 flex items-center justify-between" aria-label="Page actions">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            title="Go back"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f5f8]"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isRefreshing}
            aria-label="Refresh bank service health"
            title="Refresh bank service health"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f5f8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              aria-hidden="true"
              className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </nav>

        <header>
          <p className="mb-2 text-xs font-bold uppercase text-blue-700">
            Bank transfer
          </p>
          <h1 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Transfer to Bank
          </h1>
          <p className="mt-3 max-w-md text-base font-medium leading-7 text-slate-500">
            Select a bank based on current service health.
          </p>
        </header>

        <div className="mt-7">
          <StatusTabs value={previewState} onChange={handlePreviewStateChange} />
        </div>

        <section
          aria-label="Bank service health"
          className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
        >
          <div className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  error ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              />
              <p className="truncate text-xs font-semibold text-slate-500 sm:text-sm">
                Last updated:{' '}
                <time dateTime={lastUpdated?.toISOString()}>
                  {formatLastUpdated(lastUpdated)}
                </time>
              </p>
            </div>
            <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700">
              LIVE
            </span>
          </div>

          {renderContent()}
        </section>

        <HealthLegend />

        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-5 min-h-12"
        >
          {selectedBank && (
            <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                {selectedBank.name} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedBank(null)}
                className="rounded px-2 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
