export function StatusBadge({ value }: { value: string }) {
  const tone = value.includes('완료') || value === '정상' ? 'success' : value.includes('대기') || value === '주의' ? 'warning' : value === '위험' ? 'danger' : 'info'
  return <span className={`status-badge ${tone}`}>{value}</span>
}
