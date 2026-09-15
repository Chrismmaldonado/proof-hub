import { useMemo, useState } from 'react'
import { useEventLog } from '../../context/EventLogContext'

export type Industry =
  | 'Professional Services'
  | 'Retail'
  | 'Construction'
  | 'Healthcare'
  | 'Technology'
  | 'Hospitality'

export interface InsuranceState {
  industry: Industry | ''
  annualRevenue: number
  employees: number
  highRiskLocation: boolean
  coverageLimit: number
  deductible: number
  step: 1 | 2 | 3
}

const INDUSTRY_FACTOR: Record<Industry, number> = {
  'Professional Services': 1.0,
  Retail: 1.15,
  Construction: 1.55,
  Healthcare: 1.35,
  Technology: 0.95,
  Hospitality: 1.25,
}

export function computeMonthlyPremium(state: InsuranceState): number {
  if (!state.industry || state.annualRevenue <= 0) return 0
  const base = 85
  const revenuePart = Math.sqrt(state.annualRevenue) * 0.045
  const headcountPart = state.employees * 2.4
  const coveragePart = (state.coverageLimit / 1_000_000) * 38
  const riskPart = state.highRiskLocation ? 1.28 : 1
  const deductibleDiscount = Math.max(0.72, 1 - state.deductible / 50_000)
  const industry = INDUSTRY_FACTOR[state.industry]
  const monthly =
    (base + revenuePart + headcountPart + coveragePart) *
    industry *
    riskPart *
    deductibleDiscount
  return Math.round(monthly * 100) / 100
}

const initial: InsuranceState = {
  industry: '',
  annualRevenue: 250_000,
  employees: 12,
  highRiskLocation: false,
  coverageLimit: 1_000_000,
  deductible: 2_500,
  step: 1,
}

export function useInsuranceCalc() {
  const { log } = useEventLog()
  const [state, setState] = useState<InsuranceState>(initial)

  const premium = useMemo(() => computeMonthlyPremium(state), [state])

  const step1Valid = state.industry !== '' && state.annualRevenue > 0
  const step2Valid = state.employees >= 1 && state.coverageLimit >= 250_000
  const step3Valid = state.deductible >= 500

  function patch(partial: Partial<InsuranceState>, message?: string) {
    setState((prev) => {
      const next = { ...prev, ...partial }
      if (message) log('insurance', message, 'action', partial as Record<string, unknown>)
      return next
    })
  }

  function goNext() {
    if (state.step === 1 && step1Valid) {
      patch({ step: 2 }, 'Wizard → step 2 (risk variables)')
    } else if (state.step === 2 && step2Valid) {
      patch({ step: 3 }, 'Wizard → step 3 (deductible)')
    }
  }

  function goBack() {
    if (state.step > 1) {
      const step = (state.step - 1) as 1 | 2 | 3
      patch({ step }, `Wizard → step ${step}`)
    }
  }

  return {
    state,
    premium,
    step1Valid,
    step2Valid,
    step3Valid,
    patch,
    goNext,
    goBack,
  }
}
