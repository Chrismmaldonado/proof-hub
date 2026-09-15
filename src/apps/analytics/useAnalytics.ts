import { useMemo, useState } from 'react'
import { useEventLog } from '../../context/EventLogContext'
import {
  fuzzyMatch,
  generateTransactions,
  type Region,
  type Transaction,
  type TxStatus,
} from './mockData'

export interface AnalyticsFilters {
  regions: Region[]
  statuses: TxStatus[]
  dateFrom: string
  dateTo: string
  clientQuery: string
}

const ALL = generateTransactions(500)

const defaultFilters: AnalyticsFilters = {
  regions: [],
  statuses: [],
  dateFrom: '',
  dateTo: '',
  clientQuery: '',
}

export function useAnalytics() {
  const { log } = useEventLog()
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultFilters)

  const filtered = useMemo(() => {
    return ALL.filter((tx) => {
      if (filters.regions.length && !filters.regions.includes(tx.region))
        return false
      if (filters.statuses.length && !filters.statuses.includes(tx.status))
        return false
      if (filters.dateFrom && tx.date.slice(0, 10) < filters.dateFrom) return false
      if (filters.dateTo && tx.date.slice(0, 10) > filters.dateTo) return false
      if (!fuzzyMatch(tx.clientName, filters.clientQuery)) return false
      return true
    })
  }, [filters])

  const kpis = useMemo(() => {
    const revenue = filtered.reduce((s, t) => s + t.revenue, 0)
    const avg = filtered.length ? revenue / filtered.length : 0
    const completed = filtered.filter((t) => t.status === 'completed').length
    const successRate = filtered.length ? (completed / filtered.length) * 100 : 0
    return { revenue, avg, successRate, count: filtered.length }
  }, [filtered])

  const series = useMemo(() => {
    const map = new Map<string, number>()
    for (const tx of filtered) {
      if (tx.status === 'failed') continue
      const key = tx.date.slice(0, 7)
      map.set(key, (map.get(key) ?? 0) + tx.revenue)
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }))
  }, [filtered])

  function update<K extends keyof AnalyticsFilters>(
    key: K,
    value: AnalyticsFilters[K],
  ) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value }
      log(
        'analytics',
        `Filter changed: ${key}`,
        'action',
        { [key]: value } as Record<string, unknown>,
      )
      return next
    })
  }

  function toggleRegion(region: Region) {
    setFilters((prev) => {
      const regions = prev.regions.includes(region)
        ? prev.regions.filter((r) => r !== region)
        : [...prev.regions, region]
      log('analytics', `Region filter → ${regions.join(', ') || 'all'}`, 'action')
      return { ...prev, regions }
    })
  }

  function toggleStatus(status: TxStatus) {
    setFilters((prev) => {
      const statuses = prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status]
      log('analytics', `Status filter → ${statuses.join(', ') || 'all'}`, 'action')
      return { ...prev, statuses }
    })
  }

  function reset() {
    setFilters(defaultFilters)
    log('analytics', 'Filters reset', 'info')
  }

  return {
    allCount: ALL.length,
    filters,
    filtered,
    kpis,
    series,
    update,
    toggleRegion,
    toggleStatus,
    reset,
    sample: filtered.slice(-12).reverse() as Transaction[],
  }
}
