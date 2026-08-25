const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeEmail(value) {
  if (typeof value !== 'string') return null

  const normalized = value.trim().toLowerCase()
  return EMAIL_PATTERN.test(normalized) ? normalized : null
}
