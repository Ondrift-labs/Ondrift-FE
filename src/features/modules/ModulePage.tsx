import { Filter, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ModuleDefinition } from '../../app/modules'
import { PageHeader } from '../../components/PageHeader'
import { DemoNotice, EmptyState, LoadingState } from '../../components/PageStates'
import { Pagination } from '../../components/Pagination'
import { StatusBadge } from '../../components/StatusBadge'
import { TracePanel } from '../../components/TracePanel'
import { usePaginatedResource } from '../../hooks/usePaginatedResource'
import { makeDemoItems } from '../../lib/demoData'
import { toWorkItem } from '../../lib/adapters'
import type { WorkItem } from '../../types/api'

const metricValues: Record<string, string[]> = {
  sales: ['203건', '60.4%', '13건'], projects: ['124건', '68.2%', '17건'], design: ['240건', '194건', '31건'], procurement: ['390건', '83.7%', '48개'], production: ['86건', '93.9%', '12건'], inventory: ['1,842 LOT', '364 LOT', '28건'], quality: ['439건', '255건', '19건'], service: ['24건', '31건', '8건'], cost: ['₩18.9억', '18.7%', '7건'], rnd: ['240건', '38건', '74.1%'],
}

export function ModulePage({ module }: { module: ModuleDefinition }) {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const size = 10
  const demoItems = useMemo(() => makeDemoItems(module.key.slice(0, 3)), [module.key])
  const { data, loading, error, isDemo } = usePaginatedResource<WorkItem>(module.endpoint, page, size, demoItems, toWorkItem)
  const values = metricValues[module.key] ?? ['-', '-', '-']
  useEffect(() => setPage(1), [module.key])

  return (
    <div className="page-container">
      <PageHeader eyebrow={module.eyebrow} title={module.title} description={module.description} />
      {error && <DemoNotice message={error} />}
      <section className="metric-grid compact" aria-label={`${module.label} 핵심 지표`}>
        {module.metric.map((label, index) => <article className="metric-card" key={label}><span>{label}</span><strong>{values[index]}</strong><small>{index === 1 ? '전주 대비 +2.4%p' : '오늘 기준'}</small></article>)}
      </section>
      {module.key === 'projects' && <TracePanel />}
      <section className="panel table-panel" aria-labelledby="work-list-title">
        <div className="panel-heading"><div><span className="eyebrow">Live operations</span><h2 id="work-list-title">업무 현황</h2></div><div className="table-tools"><label><Search size={16} /><span className="sr-only">목록 검색</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="번호 또는 프로젝트 검색" /></label><button className="button secondary"><Filter size={16} />필터</button></div></div>
        {loading && !data ? <LoadingState /> : data && data.items.length > 0 ? <>
          <div className="table-scroll"><table><thead><tr><th>업무 번호</th><th>품목</th><th>프로젝트</th><th>담당자</th><th>상태</th><th>진척</th><th>납기</th><th>위험</th></tr></thead>
            <tbody>{data.items.filter((item) => `${item.reference} ${item.project} ${item.name}`.toLowerCase().includes(query.toLowerCase())).map((item) => <tr key={item.id}><td><strong className="reference">{item.reference}</strong></td><td>{item.name}</td><td>{item.project}</td><td>{item.owner}</td><td><StatusBadge value={item.status} /></td><td><div className="progress-cell"><span><i style={{ width: `${item.progress}%` }} /></span><small>{item.progress}%</small></div></td><td>{item.dueDate}</td><td><StatusBadge value={item.risk} /></td></tr>)}</tbody>
          </table></div><Pagination page={data.page} pages={data.pages} total={data.total} size={data.size} onPageChange={setPage} /></> : <EmptyState />}
        {loading && data && <div className="updating" role="status">목록 업데이트 중…</div>}
        {isDemo && <p className="data-origin">현재 표는 검토용 데모 데이터입니다. API 연결 시 동일한 목록 계약으로 자동 전환됩니다.</p>}
      </section>
    </div>
  )
}
