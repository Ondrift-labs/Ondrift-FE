import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  pages: number
  total: number
  size: number
  onPageChange: (page: number) => void
}

export function getVisiblePages(page: number, pages: number) {
  if (pages <= 0) return []
  const start = Math.max(1, Math.min(page - 2, pages - 4))
  const end = Math.min(pages, start + 4)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function Pagination({ page, pages, total, size, onPageChange }: PaginationProps) {
  const safePage = pages === 0 ? 1 : Math.min(Math.max(1, page), pages)
  const from = total === 0 ? 0 : (safePage - 1) * size + 1
  const to = Math.min(total, safePage * size)
  return (
    <div className="pagination" aria-label="페이지 탐색">
      <span className="pagination-summary">전체 {total.toLocaleString()}건 · {from}-{to}</span>
      <div className="page-buttons">
        <button onClick={() => onPageChange(safePage - 1)} disabled={safePage <= 1} aria-label="이전 페이지"><ChevronLeft size={16} /></button>
        {getVisiblePages(safePage, pages).map((number) => <button key={number} className={number === safePage ? 'active' : ''} aria-current={number === safePage ? 'page' : undefined} onClick={() => onPageChange(number)}>{number}</button>)}
        <button onClick={() => onPageChange(safePage + 1)} disabled={pages === 0 || safePage >= pages} aria-label="다음 페이지"><ChevronRight size={16} /></button>
      </div>
    </div>
  )
}
