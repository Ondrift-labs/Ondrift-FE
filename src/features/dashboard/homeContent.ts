// Static demo content for HomePage, split out of the component body so the JSX only deals
// with rendering (mirrors the content/component split used by landingCopy.ts elsewhere in
// this codebase). Part of the unreached prototype dashboard, kept for reference -- see
// README "Status of this repository".

export const HOME_KPIS = [
  { label: '진행 RFQ', value: '165', delta: '+12 이번 주', path: '/sales', tone: 'blue' },
  { label: '진행 프로젝트', value: '124', delta: '정상 107 · 주의 17', path: '/projects', tone: 'indigo' },
  { label: 'MRP 발주 후보', value: '4,440', delta: '긴급 48개 품목', path: '/procurement', tone: 'orange' },
  { label: 'Hold LOT', value: '364', delta: '24시간 초과 21 LOT', path: '/inventory', tone: 'red' },
  { label: '미결 NCR', value: '255', delta: '중결함 19건', path: '/quality', tone: 'purple' },
]

export const HOME_FLOW = [
  { label: '수주', value: 82, count: '18건', path: '/sales' },
  { label: '설계', value: 68, count: '24건', path: '/design' },
  { label: '조달', value: 74, count: '31건', path: '/procurement' },
  { label: '생산', value: 55, count: '16건', path: '/production' },
  { label: '품질', value: 43, count: '12건', path: '/quality' },
  { label: '출하', value: 65, count: '21건', path: '/service' },
]
