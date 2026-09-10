export function SkeletonState() {
  return (
    <div
      role="status"
      aria-label="Loading banks"
      className="divide-y divide-slate-100"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex min-h-24 animate-pulse items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6"
        >
          <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200 sm:h-14 sm:w-14" />
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="h-4 w-32 max-w-full rounded bg-slate-200" />
            <div className="h-3 w-24 max-w-full rounded bg-slate-100" />
          </div>
          <div className="h-7 w-14 rounded bg-slate-100" />
          <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        </div>
      ))}
      <span className="sr-only">Loading current bank service health.</span>
    </div>
  )
}
