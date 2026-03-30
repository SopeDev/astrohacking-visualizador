import {
  ASSIGNMENT_ROWS,
  ASSIGNMENTS_STORAGE_KEY,
} from '@/data/correspondences'

export function readAssignmentsFromSession() {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(ASSIGNMENTS_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return typeof data === 'object' && data !== null ? data : null
  } catch {
    return null
  }
}

export function isAssignmentsComplete(data) {
  if (!data || typeof data !== 'object') return false
  return ASSIGNMENT_ROWS.every(
    (row) =>
      typeof data[row.key] === 'string' && data[row.key].length > 0,
  )
}
