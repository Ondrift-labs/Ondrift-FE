import { ArrowRight, CircleAlert, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DemoNotice, EmptyState, LoadingState } from '../../components/PageStates'
import { StatusBadge } from '../../components/StatusBadge'
import { TracePanel } from '../../components/TracePanel'
import { usePaginatedResource } from '../../hooks/usePaginatedResource'
import { makeDemoItems } from '../../lib/demoData'
import { toWorkItem } from '../../lib/adapters'
import type { WorkItem } from '../../types/api'

const kpis = [
  { label: '진행 RFQ', value: '165', delta: '+12 이번 주', path: '/sales', tone: 'blue' },
  { label: '진행 프로젝트', value: '124', delta: '정상 107 · 주의 17', path: '/projects', tone: 'indigo' },
  { label: 'MRP 발주 후보', value: '4,440', delta: '긴급 48개 품목', path: '/procurement', tone: 'orange' },
  { label: 'Hold LOT', value: '364', delta: '24시간 초과 21 LOT', path: '/inventory', tone: 'red' },
  { label: '미결 NCR', value: '255', delta: '중결함 19건', path: '/quality', tone: 'purple' },
]

const flow = [
  { label: '수주', value: 82, count: '18건', path: '/sales' },
  { label: '설계', value: 68, count: '24건', path: '/design' },
  { label: '조달', value: 74, count: '31건', path: '/procurement' },
  { label: '생산', value: 55, count: '16건', path: '/production' },
  { label: '품질', value: 43, count: '12건', path: '/quality' },
  { label: '출하', value: 65, count: '21건', path: '/service' },
]

export function HomePage() {
  const demoItems = useMemo(() => makeDemoItems('act', 8), [])
  const { data, loading, error, isDemo } = usePaginatedResource<WorkItem>('ncrs', 1, 5, demoItems, toWorkItem)
  return (
    <div className="page-container dashboard-page">
      <header className="dashboard-header"><div><span className="eyebrow">MONDAY, AUGUST 10</span><h1>좋은 아침입니다, 관리자님.</h1><p>오늘 우선 확인할 제조 흐름과 경보를 정리했습니다.</p></div><div className="system-health"><span /><div><strong>운영 상태 정상</strong><small>마지막 동기화 09:42</small></div></div></header>
      {error && <DemoNotice message={error} />}
      <section className="metric-grid" aria-label="통합 핵심 지표">
        {kpis.map((kpi) => <Link className={`metric-card ${kpi.tone}`} to={kpi.path} key={kpi.label} aria-label={`${kpi.label} ${kpi.value}건 상세 목록 보기`}><span>{kpi.label}<ArrowRight size={15} /></span><strong>{kpi.value}</strong><small>{kpi.delta}</small></Link>)}
      </section>
      <div className="dashboard-grid">
        <section className="panel flow-chart" aria-labelledby="flow-title"><div className="panel-heading"><div><span className="eyebrow">E2E FLOW</span><h2 id="flow-title">단계별 진행 현황</h2></div><span className="chart-caption"><TrendingUp size={15} />전주 대비 +4.8%</span></div>
          <div className="bar-chart" role="img" aria-label="단계별 목표 대비 진행률: 수주 82, 설계 68, 조달 74, 생산 55, 품질 43, 출하 65 퍼센트">{flow.map((item) => <Link to={item.path} className="bar-column" key={item.label}><span className="bar-value">{item.value}%</span><span className="bar-track"><i style={{ height: `${item.value}%` }} /></span><strong>{item.label}</strong><small>{item.count}</small></Link>)}</div>
        </section>
        <section className="panel attention-panel" aria-labelledby="attention-title"><div className="panel-heading"><div><span className="eyebrow">ACTION REQUIRED</span><h2 id="attention-title">오늘의 주의 업무</h2></div><Link to="/quality">전체 보기</Link></div>
          {loading && !data ? <LoadingState /> : data && data.items.length ? <div className="attention-list">{data.items.slice(0, 4).map((item) => <Link to="/projects" key={item.id}><span className="attention-icon"><CircleAlert size={17} /></span><span><strong>{item.name}</strong><small>{item.reference} · {item.owner}</small></span><StatusBadge value={item.risk} /></Link>)}</div> : <EmptyState />}
          {isDemo && <p className="data-origin">API 연결 전 검토용 항목입니다.</p>}
        </section>
      </div>
      <TracePanel compact />
      <section className="panel risk-panel" aria-labelledby="risk-title"><div className="panel-heading"><div><span className="eyebrow">RISK SIGNAL</span><h2 id="risk-title">모듈별 위험 신호</h2></div></div><div className="risk-row"><span>영업</span><i className="low" /><span>설계</span><i className="mid" /><span>조달</span><i className="high" /><span>생산</span><i className="mid" /><span>품질</span><i className="high" /><span>서비스</span><i className="low" /></div><div className="risk-legend"><span><i className="low" />안정</span><span><i className="mid" />주의</span><span><i className="high" />위험</span></div></section>
    </div>
  )
}
