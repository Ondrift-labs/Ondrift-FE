import type { WorkItem } from '../types/api'

type ApiRecord = Record<string, unknown>

function text(record: ApiRecord, keys: string[], fallback: string) {
  for (const key of keys) if (record[key] !== undefined && record[key] !== null && String(record[key]).trim()) return String(record[key])
  return fallback
}

export function toWorkItem(record: ApiRecord, index: number): WorkItem {
  const id = text(record, ['id', 'number'], String(index + 1))
  const rawProgress = Number(record.progress ?? record.progress_rate ?? record.completion_rate ?? 0)
  const progress = Number.isFinite(rawProgress) ? Math.min(100, Math.max(0, rawProgress)) : 0
  const rawRisk = text(record, ['risk', 'risk_level'], '정상').toLowerCase()
  const risk: WorkItem['risk'] = rawRisk.includes('high') || rawRisk.includes('위험') ? '위험' : rawRisk.includes('medium') || rawRisk.includes('주의') ? '주의' : '정상'
  return {
    id,
    reference: text(record, ['number', 'reference', 'code', 'lot_number', 'serial_number'], `REC-${id}`),
    name: text(record, ['name', 'item_name', 'title', 'description', 'customer_name'], '이름 미등록'),
    project: text(record, ['project_number', 'project_id', 'project'], '프로젝트 미지정'),
    owner: text(record, ['owner_name', 'owner', 'assignee', 'supplier_name'], '담당자 미지정'),
    status: text(record, ['status', 'inspection_result'], '상태 미지정'),
    dueDate: text(record, ['due_date', 'expected_date', 'scheduled_date', 'created_at'], '-').slice(0, 10),
    progress,
    risk,
  }
}
