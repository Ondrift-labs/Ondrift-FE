import { describe, expect, it } from 'vitest'

import {
  computeQuotaWindow,
  evaluateQuota,
  parseAndValidateBody,
  parseDailyBudget,
} from '../../functions/api/rewrite.js'

const VALID_INSTALL_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('parseAndValidateBody', () => {
  it('accepts a valid request and normalizes the install ID', () => {
    expect(
      parseAndValidateBody({
        prompt: 'Make this prompt clearer',
        service: 'chatgpt',
        persona: 'concise editor',
        language: 'Korean',
        installId: VALID_INSTALL_ID.toUpperCase(),
      }),
    ).toEqual({
      prompt: 'Make this prompt clearer',
      service: 'chatgpt',
      persona: 'concise editor',
      language: 'Korean',
      installId: VALID_INSTALL_ID,
    })
  })

  it.each([
    { prompt: '', service: 'chatgpt', installId: VALID_INSTALL_ID },
    { prompt: 'x'.repeat(2001), service: 'chatgpt', installId: VALID_INSTALL_ID },
    { prompt: 'hello', service: 'unknown', installId: VALID_INSTALL_ID },
    { prompt: 'hello', service: 'gemini', installId: 'not-a-uuid' },
    { prompt: 'hello', service: 'gemini', installId: VALID_INSTALL_ID, persona: 12 },
  ])('rejects an invalid request', (payload) => {
    expect(parseAndValidateBody(payload)).toBeNull()
  })
})

describe('quota helpers', () => {
  it('builds UTC quota keys and the next UTC reset time', () => {
    expect(
      computeQuotaWindow(VALID_INSTALL_ID, '203.0.113.1', new Date('2026-08-24T23:59:59Z')),
    ).toEqual({
      installKey: `usage:${VALID_INSTALL_ID}:20260824`,
      ipKey: 'ipquota:203.0.113.1:20260824',
      globalKey: 'globalquota:20260824',
      resetAt: '2026-08-25T00:00:00.000Z',
    })
  })

  it('enforces install, IP, and global ceilings at their thresholds', () => {
    expect(evaluateQuota(3, 0, 0, 2000)).toBe('daily_limit_reached')
    expect(evaluateQuota(0, 20, 0, 2000)).toBe('daily_limit_reached')
    expect(evaluateQuota(0, 0, 2000, 2000)).toBe('service_unavailable')
    expect(evaluateQuota(2, 19, 1999, 2000)).toBeNull()
  })

  it('parses non-negative budgets and defaults invalid values', () => {
    expect(parseDailyBudget('2500')).toBe(2500)
    expect(parseDailyBudget('0')).toBe(0)
    expect(parseDailyBudget('-1')).toBe(2000)
    expect(parseDailyBudget('not-a-number')).toBe(2000)
    expect(parseDailyBudget(undefined)).toBe(2000)
  })
})
