import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'
import { getVisiblePages } from '../lib/pagination'

describe('Pagination', () => {
  it('keeps visible page numbers inside server page boundaries', () => {
    expect(getVisiblePages(1, 8)).toEqual([1, 2, 3, 4, 5])
    expect(getVisiblePages(8, 8)).toEqual([4, 5, 6, 7, 8])
    expect(getVisiblePages(1, 0)).toEqual([])
  })

  it('disables boundary navigation and reports the exact range', () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} pages={3} total={21} size={10} onPageChange={onPageChange} />)
    expect(screen.getByText('전체 21건 · 21-21')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: '이전 페이지' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
