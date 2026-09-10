import { useCallback, useEffect, useRef, useState } from 'react'
import { getBanks } from '../services/bank.service'
import type { Bank } from '../types/bank.types'

interface UseBanksResult {
  banks: Bank[]
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  lastUpdated: Date | null
  refetch: () => Promise<void>
}

export function useBanks(): UseBanksResult {
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const activeRequest = useRef<AbortController | null>(null)

  const fetchBanks = useCallback(async (initialLoad = false) => {
    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller

    if (initialLoad) setIsLoading(true)
    else setIsRefreshing(true)

    setError(null)

    try {
      const data = await getBanks(controller.signal)

      if (!controller.signal.aborted) {
        setBanks(data)
        setLastUpdated(new Date())
      }
    } catch (requestError) {
      if (
        !controller.signal.aborted &&
        !(requestError instanceof DOMException && requestError.name === 'AbortError')
      ) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load bank health data',
        )
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    }
  }, [])

  const refetch = useCallback(() => fetchBanks(false), [fetchBanks])

  useEffect(() => {
    const initialRequestId = window.setTimeout(() => {
      void fetchBanks(true)
    }, 0)

    const intervalId = window.setInterval(() => {
      void fetchBanks(false)
    }, 30_000)

    return () => {
      window.clearTimeout(initialRequestId)
      window.clearInterval(intervalId)
      activeRequest.current?.abort()
    }
  }, [fetchBanks])

  return {
    banks,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refetch,
  }
}
