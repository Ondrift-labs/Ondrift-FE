import { Check, CircleEllipsis } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  { label: '수주', ref: 'SO-2026-0184', path: '/sales', state: '완료' },
  { label: '프로젝트', ref: 'PJT-26-1034', path: '/projects', state: '완료' },
  { label: 'BOM', ref: 'BOM-2608-044', path: '/design', state: '완료' },
  { label: 'MRP·구매', ref: 'PO-2026-2188', path: '/procurement', state: '완료' },
  { label: '생산', ref: 'WO-2026-0821', path: '/production', state: '진행' },
  { label: '품질', ref: 'INS-2026-817', path: '/quality', state: '대기' },
  { label: '출하', ref: 'SHP-2026-411', path: '/service', state: '대기' },
]

export function TracePanel({ compact = false }: { compact?: boolean }) {
  return (
    <section className="panel trace-panel" aria-labelledby="trace-title">
      <div className="panel-heading"><div><span className="eyebrow">Digital Thread</span><h2 id="trace-title">PJT-26-1034 제조 이력</h2></div><span className="status-badge info">진행률 72%</span></div>
      {!compact && <p className="panel-description">EV 인버터 제어보드 · 고객 납기 2026.08.24 · Gate G7 생산 진행</p>}
      <ol className="trace-steps">
        {steps.map((step, index) => <li key={step.label} className={step.state === '완료' ? 'done' : step.state === '진행' ? 'current' : ''}>
          <Link to={step.path} aria-label={`${step.label} ${step.ref} ${step.state}`}>
            <span className="trace-icon">{step.state === '완료' ? <Check size={15} /> : <CircleEllipsis size={15} />}</span>
            <span className="trace-label">{step.label}</span><strong>{step.ref}</strong><small>{step.state}</small>
          </Link>{index < steps.length - 1 && <span className="trace-line" />}
        </li>)}
      </ol>
    </section>
  )
}
