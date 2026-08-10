export function getVisiblePages(page: number, pages: number) {
  if (pages <= 0) return []
  const start = Math.max(1, Math.min(page - 2, pages - 4))
  const end = Math.min(pages, start + 4)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}
