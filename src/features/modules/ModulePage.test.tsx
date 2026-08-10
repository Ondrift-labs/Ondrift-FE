import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { modules } from '../../app/modules'
import { ModulePage } from './ModulePage'

describe('ModulePage', () => {
  afterEach(() => vi.restoreAllMocks())

  it('shows the API error and explicit demo fallback', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('network down'))
    render(<MemoryRouter><ModulePage module={modules.find((item) => item.key === 'sales')!} /></MemoryRouter>)
    expect(screen.getByRole('status')).toHaveTextContent('데이터를 불러오는 중')
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('데모 데이터로 표시 중'))
    expect(screen.getByText('SAL-2026-0001')).toBeInTheDocument()
  })

  it('shows an empty state for a valid empty response without demo data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ items: [], total: 0, page: 1, size: 10, pages: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    render(<MemoryRouter><ModulePage module={modules.find((item) => item.key === 'quality')!} /></MemoryRouter>)
    await waitFor(() => expect(screen.getByText('표시할 데이터가 없습니다.')).toBeInTheDocument())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
