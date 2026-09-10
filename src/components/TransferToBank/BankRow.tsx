import { ChevronRight } from 'lucide-react'
import type { Bank } from '../../types/bank.types'
import { HealthBadge } from './HealthBadge'

interface BankRowProps {
  bank: Bank
  onSelect: (bank: Bank) => void
}

export function BankRow({ bank, onSelect }: BankRowProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(bank)}
        className="group flex min-h-24 w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 sm:gap-4 sm:px-6"
        aria-label={`Transfer with ${bank.name}, ${bank.healthPercentage}% service health`}
      >
        <span
          aria-hidden="true"
          style={{ backgroundColor: bank.brandColor }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-sm sm:h-14 sm:w-14 sm:text-base"
        >
          {bank.initials}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-bold text-slate-950 sm:text-lg">
            {bank.name}
          </span>
          <span className="mt-1 block text-sm font-medium text-slate-500">
            Tap to transfer
          </span>
        </span>

        <HealthBadge percentage={bank.healthPercentage} />
        <ChevronRight
          aria-hidden="true"
          className="hidden h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 sm:block"
        />
      </button>
    </li>
  )
}
