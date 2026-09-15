export type Region = 'North America' | 'EMEA' | 'APAC'
export type TxStatus = 'completed' | 'pending' | 'failed'
export type ProductCategory =
  | 'Analytics'
  | 'Automation'
  | 'Security'
  | 'Integrations'
  | 'Support'

export interface Transaction {
  id: string
  date: string
  clientName: string
  revenue: number
  status: TxStatus
  region: Region
  productCategory: ProductCategory
}

const CLIENTS = [
  'Northwind Labs',
  'Acme Robotics',
  'Helios Freight',
  'Cobalt Health',
  'Pioneer Ledger',
  'Summit Cloud',
  'Beacon Retail',
  'Orbit Media',
  'Cedar Systems',
  'Lumen Finance',
  'Atlas Mobility',
  'Quartz Energy',
  'Nimbus Soft',
  'Ironclad Legal',
  'Vesper Foods',
]

const REGIONS: Region[] = ['North America', 'EMEA', 'APAC']
const CATEGORIES: ProductCategory[] = [
  'Analytics',
  'Automation',
  'Security',
  'Integrations',
  'Support',
]

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateTransactions(count = 500): Transaction[] {
  const rand = mulberry32(42)
  const start = new Date('2025-01-01T00:00:00Z').getTime()
  const span = 365 * 24 * 60 * 60 * 1000

  return Array.from({ length: count }, (_, i) => {
    const statusRoll = rand()
    const status: TxStatus =
      statusRoll < 0.72 ? 'completed' : statusRoll < 0.9 ? 'pending' : 'failed'
    const revenue =
      Math.round((800 + rand() * 42000 + (status === 'completed' ? 1200 : 0)) * 100) /
      100
    return {
      id: `txn_${String(i + 1).padStart(4, '0')}`,
      date: new Date(start + rand() * span).toISOString(),
      clientName: CLIENTS[Math.floor(rand() * CLIENTS.length)],
      revenue,
      status,
      region: REGIONS[Math.floor(rand() * REGIONS.length)],
      productCategory: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
    }
  }).sort((a, b) => a.date.localeCompare(b.date))
}

export function fuzzyMatch(haystack: string, needle: string): boolean {
  if (!needle.trim()) return true
  const h = haystack.toLowerCase()
  const n = needle.toLowerCase().trim()
  if (h.includes(n)) return true
  let hi = 0
  for (let i = 0; i < n.length; i++) {
    const ch = n[i]
    hi = h.indexOf(ch, hi)
    if (hi === -1) return false
    hi += 1
  }
  return true
}
