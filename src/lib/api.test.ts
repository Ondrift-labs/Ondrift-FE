import { describe, expect, it } from 'vitest'
import { paginate } from './api'

describe('paginate', () => {
  it('clamps a page past the final page and returns the final slice', () => {
    const result = paginate(Array.from({ length: 21 }, (_, index) => index + 1), 99, 10)
    expect(result.page).toBe(3)
    expect(result.pages).toBe(3)
    expect(result.items).toEqual([21])
  })

  it('represents an empty collection with zero pages', () => {
    expect(paginate([], 1, 10)).toEqual({ items: [], total: 0, page: 1, size: 10, pages: 0 })
  })
})
