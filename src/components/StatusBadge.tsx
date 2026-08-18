// Rules are checked in order; the first match wins, same as the nested ternary this replaced.
const STATUS_TONE_RULES: Array<{ test: (value: string) => boolean; tone: string }> = [
  { test: (value) => value.includes('완료') || value === '정상', tone: 'success' },
  { test: (value) => value.includes('대기') || value === '주의', tone: 'warning' },
  { test: (value) => value === '위험', tone: 'danger' },
]

function resolveTone(value: string): string {
  return STATUS_TONE_RULES.find((rule) => rule.test(value))?.tone ?? 'info'
}

export function StatusBadge({ value }: { value: string }) {
  const tone = resolveTone(value)
  return <span className={`status-badge ${tone}`}>{value}</span>
}
