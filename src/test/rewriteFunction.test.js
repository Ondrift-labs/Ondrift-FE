import { describe, expect, it } from 'vitest'

import {
  computeQuotaWindow,
  evaluateQuota,
  LICENSE_DAILY_LIMIT,
  parseAndValidateBody,
  parseDailyBudget,
} from '../../functions/api/rewrite.js'
import {
  evaluateLicenseQuota,
  isLicenseActive,
} from '../../functions/_shared/license.js'

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

  it('accepts and normalizes a valid license key', () => {
    expect(
      parseAndValidateBody({
        prompt: 'Make this prompt clearer',
        service: 'claude',
        installId: VALID_INSTALL_ID,
        licenseKey: 'ondr-a1b2-c3d4',
      }),
    ).toEqual({
      prompt: 'Make this prompt clearer',
      service: 'claude',
      installId: VALID_INSTALL_ID,
      licenseKey: 'ONDR-A1B2-C3D4',
    })
  })

  it('drops an invalid license key instead of rejecting the request', () => {
    expect(
      parseAndValidateBody({
        prompt: 'Make this prompt clearer',
        service: 'gemini',
        installId: VALID_INSTALL_ID,
        licenseKey: 'stale-license',
      }),
    ).toEqual({
      prompt: 'Make this prompt clearer',
      service: 'gemini',
      installId: VALID_INSTALL_ID,
    })
  })

  it('continues accepting requests without a license key', () => {
    expect(
      parseAndValidateBody({
        prompt: 'Make this prompt clearer',
        service: 'perplexity',
        installId: VALID_INSTALL_ID,
      }),
    ).toEqual({
      prompt: 'Make this prompt clearer',
      service: 'perplexity',
      installId: VALID_INSTALL_ID,
    })
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

describe('Pro license helpers', () => {
  const periodEnd = '2026-08-25T12:00:00.000Z'

  it('accepts an active license before its period end', () => {
    expect(
      isLicenseActive(
        { status: 'active', currentPeriodEnd: periodEnd },
        new Date('2026-08-25T11:59:59.000Z'),
      ),
    ).toBe(true)
  })

  it('rejects a revoked license', () => {
    expect(
      isLicenseActive(
        { status: 'revoked', currentPeriodEnd: periodEnd },
        new Date('2026-08-25T11:00:00.000Z'),
      ),
    ).toBe(false)
  })

  it('accepts an expired license inside the three-day grace window', () => {
    expect(
      isLicenseActive(
        { status: 'active', currentPeriodEnd: periodEnd },
        new Date('2026-08-28T11:59:59.000Z'),
      ),
    ).toBe(true)
  })

  it('rejects an expired license after the three-day grace window', () => {
    expect(
      isLicenseActive(
        { status: 'active', currentPeriodEnd: periodEnd },
        new Date('2026-08-28T12:00:01.000Z'),
      ),
    ).toBe(false)
  })

  it('enforces the Pro daily limit and shared global budget', () => {
    expect(evaluateLicenseQuota(LICENSE_DAILY_LIMIT - 1, 1999, 2000)).toBeNull()
    expect(evaluateLicenseQuota(LICENSE_DAILY_LIMIT, 0, 2000)).toBe(
      'daily_limit_reached',
    )
    expect(evaluateLicenseQuota(LICENSE_DAILY_LIMIT + 1, 0, 2000)).toBe(
      'daily_limit_reached',
    )
    expect(evaluateLicenseQuota(0, 2000, 2000)).toBe('service_unavailable')
  })
})
