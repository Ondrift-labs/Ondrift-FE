import { useEffect, useState } from 'react'
import { fetchPage, paginate } from '../lib/api'
import type { PaginatedResponse } from '../types/api'

interface ResourceState<T> {
  data: PaginatedResponse<T> | null
  loading: boolean
  error: string | null
  isDemo: boolean
}

export function usePaginatedResource<T>(endpoint: string, page: number, size: number, demoItems: T[], mapItem?: (item: Record<string, unknown>, index: number) => T) {
  const [state, setState] = useState<ResourceState<T>>({ data: null, loading: true, error: null, isDemo: false })

  useEffect(() => {
    const controller = new AbortController()
    setState((current) => ({ ...current, loading: true }))
    fetchPage<Record<string, unknown>>(endpoint, page, size, controller.signal)
      .then((data) => {
        const mapped: PaginatedResponse<T> = mapItem
          ? { ...data, items: data.items.map((item, index) => mapItem(item, index)) }
          : data as unknown as PaginatedResponse<T>
        setState({ data: mapped, loading: false, error: null, isDemo: false })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        setState({ data: paginate(demoItems, page, size), loading: false, error: message, isDemo: true })
      })
    return () => controller.abort()
  }, [demoItems, endpoint, mapItem, page, size])

  return state
}
