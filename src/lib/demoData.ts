import type { WorkItem } from '../types/api'

const names = ['EV 인버터 제어보드', '산업용 센서 모듈', 'BMS 메인보드', '충전기 통신보드', '스마트 계량 제어기', '모터 드라이브 PCB']
const owners = ['김서윤', '박현우', '이도윤', '최민지', '정하준', '오지우']
const statuses = ['검토 중', '승인 대기', '진행 중', '입고 대기', '검사 중', '완료']
const risks: WorkItem['risk'][] = ['정상', '정상', '정상', '주의', '위험']

export function makeDemoItems(prefix: string, count = 37): WorkItem[] {
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1
    const day = String((n % 27) + 1).padStart(2, '0')
    return {
      id: `${prefix}-${n}`,
      reference: `${prefix.toUpperCase()}-2026-${String(n).padStart(4, '0')}`,
      name: names[index % names.length],
      project: `PJT-26-${String(1031 + (index % 9)).padStart(4, '0')}`,
      owner: owners[index % owners.length],
      status: statuses[index % statuses.length],
      dueDate: `2026-08-${day}`,
      progress: Math.min(100, 18 + ((index * 13) % 90)),
      risk: risks[index % risks.length],
    }
  })
}
