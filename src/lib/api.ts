import type { PaginatedResponse } from '../types/api'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
const TOKEN_KEY = 'ondrift_access_token'

export function getAccessToken() { return sessionStorage.getItem(TOKEN_KEY) }
export function setAccessToken(token: string) { sessionStorage.setItem(TOKEN_KEY, token) }
export function clearAccessToken() { sessionStorage.removeItem(TOKEN_KEY) }

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function fetchPage<T>(endpoint: string, page: number, size: number, signal?: AbortSignal) {
  const url = new URL(`${API_BASE_URL}/${endpoint.replace(/^\//, '')}`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('size', String(size))
  let response: Response
  try {
    const token = getAccessToken()
    response = await fetch(url, { signal, headers: token ? { Authorization: `Bearer ${token}` } : undefined })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(`서버에 연결할 수 없습니다 (${API_BASE_URL})`)
  }
  if (response.status === 401) {
    clearAccessToken()
    window.dispatchEvent(new Event('ondrift:unauthorized'))
    throw new ApiError('인증이 만료되었습니다. 다시 로그인해 주세요.', 401)
  }
  if (!response.ok) throw new ApiError(`API 요청 실패: ${response.status} ${response.statusText}`, response.status)
  const body = (await response.json()) as Partial<PaginatedResponse<T>>
  if (!Array.isArray(body.items) || typeof body.total !== 'number') {
    throw new ApiError('API 응답 형식이 올바르지 않습니다.')
  }
  const pages = Math.max(0, Number(body.pages ?? Math.ceil(body.total / size)))
  return { items: body.items, total: body.total, page: Number(body.page ?? page), size: Number(body.size ?? size), pages }
}

export async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
  if (!response.ok) throw new ApiError(response.status === 401 ? '아이디 또는 비밀번호를 확인해 주세요.' : `로그인 요청 실패: ${response.status}`, response.status)
  const body = await response.json() as { access_token?: string }
  if (!body.access_token) throw new ApiError('로그인 응답에 access_token이 없습니다.')
  setAccessToken(body.access_token)
  return body.access_token
}

export function paginate<T>(items: T[], page: number, size: number): PaginatedResponse<T> {
  const pages = items.length === 0 ? 0 : Math.ceil(items.length / size)
  const safePage = pages === 0 ? 1 : Math.min(Math.max(1, page), pages)
  const start = (safePage - 1) * size
  return { items: items.slice(start, start + size), total: items.length, page: safePage, size, pages }
}
