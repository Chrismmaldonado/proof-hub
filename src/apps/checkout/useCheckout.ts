import { useMemo, useState } from 'react'
import { useEventLog } from '../../context/EventLogContext'

export type BillingCycle = 'monthly' | 'annual'
export type PayPhase = 'idle' | 'loading' | 'success' | 'error'

export interface CheckoutState {
  cycle: BillingCycle
  cardNumber: string
  expiry: string
  cvc: string
  name: string
  phase: PayPhase
  errorMessage: string
  receiptId: string
}

const PLAN = {
  name: 'Proof Hub Pro',
  monthly: 49,
  annual: 470,
}

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

const initial: CheckoutState = {
  cycle: 'monthly',
  cardNumber: '',
  expiry: '',
  cvc: '',
  name: '',
  phase: 'idle',
  errorMessage: '',
  receiptId: '',
}

export function useCheckout() {
  const { log } = useEventLog()
  const [state, setState] = useState<CheckoutState>(initial)

  const pricing = useMemo(() => {
    const unit = state.cycle === 'monthly' ? PLAN.monthly : PLAN.annual
    const label = state.cycle === 'monthly' ? 'Monthly' : 'Annual (save ~20%)'
    const tax = Math.round(unit * 0.08 * 100) / 100
    const total = Math.round((unit + tax) * 100) / 100
    return { plan: PLAN.name, unit, label, tax, total }
  }, [state.cycle])

  const cardValid = state.cardNumber.replace(/\s/g, '').length === 16
  const expiryValid = /^\d{2}\/\d{2}$/.test(state.expiry)
  const cvcValid = /^\d{3,4}$/.test(state.cvc)
  const nameValid = state.name.trim().length >= 2
  const formValid = cardValid && expiryValid && cvcValid && nameValid

  function patch(partial: Partial<CheckoutState>, message?: string) {
    setState((prev) => {
      const next = { ...prev, ...partial }
      if (message) log('checkout', message, 'action', partial as Record<string, unknown>)
      return next
    })
  }

  function setCycle(cycle: BillingCycle) {
    patch({ cycle }, `Billing cycle → ${cycle}`)
  }

  async function submit() {
    if (!formValid || state.phase === 'loading') return
    patch({ phase: 'loading', errorMessage: '' }, 'Payment submit → loading')
    log('checkout', 'Simulated Stripe Elements authorize…', 'info')

    await new Promise((r) => setTimeout(r, 1400))

    const fail = Math.random() < 0.35
    if (fail) {
      setState((prev) => ({
        ...prev,
        phase: 'error',
        errorMessage: 'Card Declined: Insufficient Funds',
      }))
      log('checkout', 'Simulated decline: Insufficient Funds', 'error')
      return
    }

    const receiptId = `rcpt_${Math.random().toString(36).slice(2, 10)}`
    setState((prev) => ({
      ...prev,
      phase: 'success',
      receiptId,
      errorMessage: '',
    }))
    log('checkout', `Payment success → ${receiptId}`, 'success', {
      total: pricing.total,
      cycle: state.cycle,
    })
  }

  function reset() {
    setState(initial)
    log('checkout', 'Checkout reset to idle', 'info')
  }

  return {
    state,
    pricing,
    formValid,
    cardValid,
    expiryValid,
    cvcValid,
    nameValid,
    patch,
    setCycle,
    submit,
    reset,
  }
}
