export const LICENSE_DAILY_LIMIT = 100
export const LICENSE_GRACE_PERIOD_MS = 3 * 24 * 60 * 60 * 1000

const LICENSE_KEY_PATTERN = /^ONDR-[A-Z0-9]{4}-[A-Z0-9]{4}$/i

export function normalizeLicenseKey(value) {
  if (typeof value !== 'string' || !LICENSE_KEY_PATTERN.test(value)) return null
  return value.toUpperCase()
}

export function isLicenseActive(record, now = new Date()) {
  if (!record || record.status !== 'active' || typeof record.currentPeriodEnd !== 'string') {
    return false
  }

  const currentPeriodEnd = Date.parse(record.currentPeriodEnd)
  const nowTime = now instanceof Date ? now.getTime() : Number(now)

  if (!Number.isFinite(currentPeriodEnd) || !Number.isFinite(nowTime)) return false
  return nowTime <= currentPeriodEnd + LICENSE_GRACE_PERIOD_MS
}

export function computeLicenseUsageKey(licenseKey, now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll('-', '')
  return `license-usage:${licenseKey}:${date}`
}

export function evaluateLicenseQuota(licenseCount, globalCount, globalBudget) {
  if (licenseCount >= LICENSE_DAILY_LIMIT) return 'daily_limit_reached'
  if (globalCount >= globalBudget) return 'service_unavailable'
  return null
}
