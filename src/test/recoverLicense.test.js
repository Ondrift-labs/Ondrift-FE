import { describe, expect, it } from 'vitest'

import {
  computeRecoveryQuotaWindow,
  evaluateRecoveryRateLimit,
  normalizeEmail,
} from '../../functions/api/recover-license.js'

describe('normalizeEmail', () => {
  it('accepts plausible email addresses and normalizes case and whitespace', () => {
    expect(normalizeEmail('  Buyer@Example.COM ')).toBe('buyer@example.com')
  })

  it.each([
    undefined,
    '',
    'buyer',
    'buyer@example',
    'buyer @example.com',
    'buyer@example .com',
  ])('rejects an invalid email address', (email) => {
    expect(normalizeEmail(email)).toBeNull()
  })
})

describe('recovery rate-limit helpers', () => {
  it('builds UTC per-email and per-IP daily keys', () => {
    expect(
      computeRecoveryQuotaWindow(
        'buyer@example.com',
        '203.0.113.1',
        new Date('2026-08-24T23:59:59Z'),
      ),
    ).toEqual({
      emailKey: 'recovery-email:buyer@example.com:20260824',
      ipKey: 'recovery-ip:203.0.113.1:20260824',
    })
  })

  it('allows attempts below both daily limits', () => {
    expect(evaluateRecoveryRateLimit(2, 9)).toBeNull()
  })

  it('blocks attempts at or above the per-email limit', () => {
    expect(evaluateRecoveryRateLimit(3, 0)).toBe('rate_limited')
    expect(evaluateRecoveryRateLimit(4, 0)).toBe('rate_limited')
  })

  it('blocks attempts at or above the per-IP limit', () => {
    expect(evaluateRecoveryRateLimit(0, 10)).toBe('rate_limited')
    expect(evaluateRecoveryRateLimit(0, 11)).toBe('rate_limited')
  })
})
