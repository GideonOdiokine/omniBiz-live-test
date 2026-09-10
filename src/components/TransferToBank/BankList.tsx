import type { Bank } from '../../types/bank.types'
import { BankRow } from './BankRow'

interface BankListProps {
  banks: Bank[]
  onBankSelect: (bank: Bank) => void
}

export function BankList({ banks, onBankSelect }: BankListProps) {
  return (
    <ul
      aria-label="Banks available for transfer"
      className="divide-y divide-slate-100"
    >
      {banks.map((bank) => (
        <BankRow key={bank.id} bank={bank} onSelect={onBankSelect} />
      ))}
    </ul>
  )
}
