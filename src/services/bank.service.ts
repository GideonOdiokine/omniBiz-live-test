import type { Bank } from '../types/bank.types'

const seedBanks: Bank[] = [
  {
    id: 'access',
    name: 'Access Bank',
    initials: 'AB',
    healthPercentage: 94,
    brandColor: '#d92d20',
  },
  {
    id: 'gtbank',
    name: 'GTBank',
    initials: 'GT',
    healthPercentage: 71,
    brandColor: '#e05a14',
  },
  {
    id: 'zenith',
    name: 'Zenith Bank',
    initials: 'ZB',
    healthPercentage: 58,
    brandColor: '#6d4bc3',
  },
  {
    id: 'firstbank',
    name: 'First Bank',
    initials: 'FB',
    healthPercentage: 43,
    brandColor: '#075da8',
  },
  {
    id: 'uba',
    name: 'UBA',
    initials: 'UB',
    healthPercentage: 82,
    brandColor: '#c62828',
  },
]

let currentBanks = seedBanks

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const handleAbort = () => {
      window.clearTimeout(timeoutId)
      reject(new DOMException('Request was cancelled', 'AbortError'))
    }

    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    }, ms)

    if (signal?.aborted) {
      handleAbort()
      return
    }

    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

export async function getBanks(signal?: AbortSignal): Promise<Bank[]> {
  await wait(700, signal)

  currentBanks = currentBanks.map((bank) => {
    const change = Math.floor(Math.random() * 7) - 3

    return {
      ...bank,
      healthPercentage: Math.max(
        0,
        Math.min(100, bank.healthPercentage + change),
      ),
    }
  })

  return currentBanks.map((bank) => ({ ...bank }))
}
