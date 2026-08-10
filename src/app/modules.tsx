import {
  Boxes,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ClipboardCheck,
  Factory,
  FlaskConical,
  House,
  PackageCheck,
  PanelsTopLeft,
  Settings2,
  ShoppingCart,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ModuleDefinition {
  path: string
  key: string
  label: string
  eyebrow: string
  title: string
  description: string
  endpoint: string
  metric: [string, string, string]
  icon: LucideIcon
}

export const modules: ModuleDefinition[] = [
  { path: '/', key: 'home', label: '홈', eyebrow: 'Control Tower', title: '통합 관제', description: '수주부터 출하까지 제조 흐름을 한눈에 확인합니다.', endpoint: 'ncrs', metric: ['진행 RFQ', '진행 프로젝트', '미결 경보'], icon: House },
  { path: '/sales', key: 'sales', label: '영업·수주', eyebrow: 'Sales & Order', title: '영업·수주 현황', description: '견적, 수주 전환과 고객 납기 약속을 추적합니다.', endpoint: 'orders', metric: ['진행 견적', '수주 전환율', '납기 임박'], icon: BriefcaseBusiness },
  { path: '/projects', key: 'projects', label: '프로젝트', eyebrow: 'Project', title: '프로젝트 실행', description: 'WBS, Stage Gate와 주요 이슈를 통합 관리합니다.', endpoint: 'projects', metric: ['진행 프로젝트', '평균 진척률', '지연 작업'], icon: PanelsTopLeft },
  { path: '/design', key: 'design', label: '설계·PDM', eyebrow: 'Design / PLM', title: 'BOM·설계변경', description: 'BOM 품목을 중심으로 설계 이력을 조회합니다. ECR/ECO 편집은 후속 범위입니다.', endpoint: 'bom-items', metric: ['활성 BOM', '미결 ECR', '배포 대기'], icon: Settings2 },
  { path: '/procurement', key: 'procurement', label: '구매·공급사', eyebrow: 'Procurement / SCM', title: '조달 준비도', description: '구매 발주와 공급사 납기를 관리합니다.', endpoint: 'purchase-orders', metric: ['발주 대기', '평균 입고율', '부족 품목'], icon: ShoppingCart },
  { path: '/production', key: 'production', label: '생산', eyebrow: 'MES', title: '생산 실행', description: '작업지시와 공정 진행 상태를 관제합니다.', endpoint: 'work-orders', metric: ['진행 작업지시', '직행률', '공수 초과'], icon: Factory },
  { path: '/inventory', key: 'inventory', label: '자재·물류', eyebrow: 'WMS', title: '자재·물류 추적', description: '재고, LOT 상태와 수량 흐름을 추적합니다.', endpoint: 'inventory', metric: ['가용 LOT', 'Hold LOT', '출하 대기'], icon: Boxes },
  { path: '/quality', key: 'quality', label: '품질', eyebrow: 'QMS', title: '품질 보증', description: '검사 결과와 공정 품질 신호를 관리합니다. CAPA 편집은 후속 범위입니다.', endpoint: 'inspections', metric: ['검사 진행', '미결 NCR', 'CAPA 지연'], icon: ClipboardCheck },
  { path: '/service', key: 'service', label: '현장·서비스', eyebrow: 'FSM', title: '출하·서비스', description: '출하와 Serial 흐름을 연결합니다. A/S·RMA 편집은 후속 범위입니다.', endpoint: 'shipments', metric: ['출하 예정', '미결 A/S', 'RMA 처리'], icon: PackageCheck },
  { path: '/cost', key: 'cost', label: '원가·경영', eyebrow: 'Cost / ERP', title: '원가·손익', description: '프로젝트 실행 현황을 원가 관점의 출발점으로 조회합니다. EAC 계산은 후속 범위입니다.', endpoint: 'projects', metric: ['예상 매출', '평균 마진', '손실 경보'], icon: ChartNoAxesCombined },
  { path: '/rnd', key: 'rnd', label: '연구개발·검증', eyebrow: 'R&D / V&V', title: '연구개발·검증', description: '프로젝트 WBS를 검증 활동의 기준으로 조회합니다. DVP&R 편집은 후속 범위입니다.', endpoint: 'wbs-tasks', metric: ['활성 요구사항', '시험 대기', '검증 완료율'], icon: FlaskConical },
]
