import { AlertTriangle, Inbox } from 'lucide-react'

export function LoadingState() {
  return <div className="loading-state" role="status" aria-live="polite"><span className="spinner" />데이터를 불러오는 중입니다.</div>
}

export function EmptyState() {
  return <div className="empty-state"><Inbox size={28} /><strong>표시할 데이터가 없습니다.</strong><span>검색 조건을 바꾸거나 새 업무를 등록해 주세요.</span></div>
}

export function DemoNotice({ message }: { message: string }) {
  return <div className="demo-notice" role="alert"><AlertTriangle size={18} /><span><strong>데모 데이터로 표시 중</strong> — {message}</span></div>
}
